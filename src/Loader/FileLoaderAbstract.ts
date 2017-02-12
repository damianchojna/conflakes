import {LoaderAbstract} from "./LoaderAbstract";
import * as _ from 'lodash';
import * as p from 'path';
import * as fs from 'fs';
import {FileLoaderImportCircularReferenceError} from "../Error/FileLoaderImportCircularReferenceError";
import {FileLoaderLoadError} from "../Error/FileLoaderLoadError";

export abstract class FileLoaderAbstract extends LoaderAbstract {

    static loading:string[] = [];

    public import(resource:string, type?:string|null = null, ignoreErrors?:boolean = false, sourceResource?:string|null = null):void {
        try {
            var loader = this.resolve(resource, type);

            resource = p.isAbsolute(resource) && _.isString(resource) ? p.normalize(resource) : p.normalize(p.join(p.dirname(sourceResource), resource));

            var resources = _.isArray(resource) ? resource : [resource];

            for (let i = 0, count = resources.length; i < count; ++i) {
                if (resources[i] in FileLoaderAbstract.loading) {
                    if (i == count - 1) {
                        throw new FileLoaderImportCircularReferenceError(Object.keys(FileLoaderAbstract.loading));
                    }
                } else {
                    resource = resources[i];
                    break;
                }
            }
            FileLoaderAbstract.loading[resource] = true;

            try {
                var ret = loader.load(resource, type);
            } finally {
                delete FileLoaderAbstract.loading[resource];
            }

            return ret;
        } catch (e) {

            if (e instanceof FileLoaderImportCircularReferenceError) {
                throw e;
            }

            if (!ignoreErrors) {
                // prevent embedded imports from nesting multiple exceptions
                if (e instanceof FileLoaderLoadError) {
                    throw e;
                }

                throw new FileLoaderLoadError(resource, sourceResource, e);
            }
        }
    }

    public importFromArray(imports:Array, sourceResource:string) {
        imports.forEach((importConfig) => {
            var resource = _.isUndefined(importConfig.resource) ? null : importConfig.resource;
            var ignore_errors = _.isUndefined(importConfig.ignore_errors) ? false : importConfig.ignore_errors;
            var type = _.isUndefined(importConfig.type) ? null : importConfig.type;

            this.import(resource, type, ignore_errors, sourceResource);
        });
    }

    protected getFileContent(resource:string):string {
        return fs.readFileSync(resource, 'utf8');
    }
}