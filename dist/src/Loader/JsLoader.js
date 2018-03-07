"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const p = require("path");
const BaseFileLoaderAbstract_1 = require("./BaseFileLoaderAbstract");
class JsLoader extends BaseFileLoaderAbstract_1.BaseFileLoaderAbstract {
    supports(resource, type = null) {
        return _.isString(resource) && resource && ('js' === type || p.extname(resource) === '.js');
    }
    load(resource, type = null, as) {
        let parsedFile;
        try {
            parsedFile = require(resource);
            if (!_.isObject(parsedFile))
                throw new Error(`Module ${resource} do not export object`);
        }
        catch (e) {
            throw e;
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
exports.JsLoader = JsLoader;
//# sourceMappingURL=JsLoader.js.map