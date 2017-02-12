"use strict";
const _ = require("lodash");
const BaseFileLoaderAbstract_1 = require("./BaseFileLoaderAbstract");
class ObjectLoader extends BaseFileLoaderAbstract_1.BaseFileLoaderAbstract {
    supports(resource, type = null) {
        return _.isPlainObject(resource) || (_.isPlainObject(resource) && 'object' === type);
    }
    /**
     * Laduje do kontenera resource example FileResource jeżeli JsonLoader obsługuje imporotwanie resourców to używa metody
     * import aby wcześniej jeszcze rozwiązać który loader powinien być użyty do załadowania rezourca
     *
     */
    load(resource, type = null) {
        var imports = [];
        if ('imports' in resource) {
            imports = resource['imports'];
            delete resource['imports'];
        }
        _.merge(this.container, resource);
        this.importFromArray(imports, 'object');
    }
}
exports.ObjectLoader = ObjectLoader;
//# sourceMappingURL=ObjectLoader.js.map