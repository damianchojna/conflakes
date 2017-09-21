"use strict";
const _ = require("lodash");
const p = require("path");
const ini = require("ini-config-parser");
const BaseFileLoaderAbstract_1 = require("./BaseFileLoaderAbstract");
class IniLoader extends BaseFileLoaderAbstract_1.BaseFileLoaderAbstract {
    supports(resource, type = null) {
        return _.isString(resource) && resource && ('ini' === type || '.ini' === p.extname(resource));
    }
    load(resource, type = null) {
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
        _.merge(this.container, parsedFile);
    }
}
exports.IniLoader = IniLoader;
//# sourceMappingURL=IniLoader.js.map