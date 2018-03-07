"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
const BaseFileLoaderAbstract_1 = require("./BaseFileLoaderAbstract");
class ObjectLoader extends BaseFileLoaderAbstract_1.BaseFileLoaderAbstract {
    supports(resource, type = null) {
        return _.isPlainObject(resource) || (_.isPlainObject(resource) && 'object' === type);
    }
    load(resource, type = null, as) {
        var imports = [];
        if ('imports' in resource) {
            imports = resource['imports'];
            delete resource['imports'];
        }
        this.importFromArray(imports, 'object');
        _.merge(this.container, resource);
    }
}
exports.ObjectLoader = ObjectLoader;
//# sourceMappingURL=ObjectLoader.js.map