"use strict";
const _ = require("lodash");
const p = require("path");
const yml = require("js-yaml");
const BaseFileLoaderAbstract_1 = require("./BaseFileLoaderAbstract");
class YamlLoader extends BaseFileLoaderAbstract_1.BaseFileLoaderAbstract {
    supports(resource, type = null) {
        return _.isString(resource) && resource && (('yml' === type || 'yaml' === type) || ('.yml' === p.extname(resource) || '.yaml' === p.extname(resource)));
    }
    load(resource, type = null) {
        var content = this.getFileContent(resource);
        try {
            var parsedFile = yml.load(content);
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
exports.YamlLoader = YamlLoader;
//# sourceMappingURL=YamlLoader.js.map