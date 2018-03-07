"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const p = require("path");
const BaseFileLoaderAbstract_1 = require("./BaseFileLoaderAbstract");
class JsonLoader extends BaseFileLoaderAbstract_1.BaseFileLoaderAbstract {
    supports(resource, type = null) {
        return _.isString(resource) && resource && ('json' === type || p.extname(resource) === '.json');
    }
    load(resource, type = null, as) {
        var content = this.getFileContent(resource);
        try {
            var parsedFile = JSON.parse(content);
        }
        catch (e) {
            throw new Error(`Parse Error: ${resource}\n${e.toString()}`);
        }
        var imports = [];
        if ('imports' in parsedFile) {
            imports = parsedFile['imports'];
            delete parsedFile['imports'];
        }
        this.importFromArray(imports, resource);
        _.merge(this.container, as ? _.set({}, as, parsedFile) : parsedFile);
    }
}
exports.JsonLoader = JsonLoader;
//# sourceMappingURL=JsonLoader.js.map