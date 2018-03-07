"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const p = require("path");
const ini = require("ini");
const BaseFileLoaderAbstract_1 = require("./BaseFileLoaderAbstract");
class IniLoader extends BaseFileLoaderAbstract_1.BaseFileLoaderAbstract {
    supports(resource, type = null) {
        return _.isString(resource) && resource && ('ini' === type || '.ini' === p.extname(resource));
    }
    load(resource, type = null, as) {
        var content = this.getFileContent(resource);
        try {
            var parsedFile = ini.parse(content);
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
exports.IniLoader = IniLoader;
//# sourceMappingURL=IniLoader.js.map