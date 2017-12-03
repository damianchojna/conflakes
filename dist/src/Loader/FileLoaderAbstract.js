"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoaderAbstract_1 = require("./LoaderAbstract");
const _ = require("lodash");
const p = require("path");
const fs = require("fs");
const FileLoaderImportCircularReferenceError_1 = require("../Error/FileLoaderImportCircularReferenceError");
const FileLoaderLoadError_1 = require("../Error/FileLoaderLoadError");
class FileLoaderAbstract extends LoaderAbstract_1.LoaderAbstract {
    import(resource, type = null, ignoreErrors = false, sourceResource = null) {
        try {
            var loader = this.resolve(resource, type);
            resource = p.isAbsolute(resource) && _.isString(resource) ? p.normalize(resource) : p.normalize(p.join(p.dirname(sourceResource), resource));
            var resources = _.isArray(resource) ? resource : [resource];
            for (let i = 0, count = resources.length; i < count; ++i) {
                if (resources[i] in FileLoaderAbstract.loading) {
                    if (i == count - 1) {
                        throw new FileLoaderImportCircularReferenceError_1.FileLoaderImportCircularReferenceError(Object.keys(FileLoaderAbstract.loading));
                    }
                }
                else {
                    resource = resources[i];
                    break;
                }
            }
            FileLoaderAbstract.loading[resource] = true;
            try {
                var ret = loader.load(resource, type);
            }
            finally {
                delete FileLoaderAbstract.loading[resource];
            }
            return ret;
        }
        catch (e) {
            if (e instanceof FileLoaderImportCircularReferenceError_1.FileLoaderImportCircularReferenceError) {
                throw e;
            }
            if (!ignoreErrors) {
                if (e instanceof FileLoaderLoadError_1.FileLoaderLoadError) {
                    throw e;
                }
                throw new FileLoaderLoadError_1.FileLoaderLoadError(resource, sourceResource, e);
            }
        }
    }
    importFromArray(imports, sourceResource) {
        imports.forEach((importConfig) => {
            var resource = _.isUndefined(importConfig.resource) ? null : importConfig.resource;
            var ignore_errors = _.isUndefined(importConfig.ignore_errors) ? false : importConfig.ignore_errors;
            var type = _.isUndefined(importConfig.type) ? null : importConfig.type;
            this.import(resource, type, ignore_errors, sourceResource);
        });
    }
    getFileContent(resource) {
        return fs.readFileSync(resource, 'utf8');
    }
}
FileLoaderAbstract.loading = [];
exports.FileLoaderAbstract = FileLoaderAbstract;
//# sourceMappingURL=FileLoaderAbstract.js.map