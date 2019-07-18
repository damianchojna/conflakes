"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const p = require("path");
const yml = require("js-yaml");
const BaseFileLoaderAbstract_1 = require("./BaseFileLoaderAbstract");
const GlobalVariableType_1 = require("./Extensions/Yaml/GlobalVariableType");
class YamlLoader extends BaseFileLoaderAbstract_1.BaseFileLoaderAbstract {
    supports(resource, type = null) {
        return _.isString(resource) && resource && (('yml' === type || 'yaml' === type) || ('.yml' === p.extname(resource) || '.yaml' === p.extname(resource)));
    }
    load(resource, type = null, as) {
        var content = this.getFileContent(resource);
        try {
            var parsedFile = yml.load(content, { schema: GlobalVariableType_1.default });
        }
        catch (e) {
            throw new Error(`Parse Error: ${resource}\n${e.toString()}`);
        }
        var imports = [];
        if ('imports' in parsedFile) {
            for (let imp in parsedFile['imports']) {
                if (parsedFile['imports'][imp]['as'] && as) {
                    parsedFile['imports'][imp]['as'] = as + '.' + parsedFile['imports'][imp]['as'];
                }
                else if (as) {
                    parsedFile['imports'][imp]['as'] = as;
                }
            }
            imports = parsedFile['imports'];
            delete parsedFile['imports'];
        }
        this.importFromArray(imports, resource);
        _.merge(this.container, as ? _.set({}, as, parsedFile) : parsedFile);
    }
}
exports.YamlLoader = YamlLoader;
//# sourceMappingURL=YamlLoader.js.map