"use strict";
const _ = require("lodash");
const p = require("path");
const BaseFileLoaderAbstract_1 = require("./BaseFileLoaderAbstract");
class JsonLoader extends BaseFileLoaderAbstract_1.BaseFileLoaderAbstract {
    supports(resource, type = null) {
        return _.isString(resource) && resource && ('json' === type || p.extname(resource) === '.json');
    }
    /**
     * Laduje do kontenera resource example FileResource jeżeli JsonLoader obsługuje imporotwanie resourców to używa metody
     * import aby wcześniej jeszcze rozwiązać który loader powinien być użyty do załadowania rezourca
     *
     * @param resource
     * @param type
     * @returns {any}
     */
    load(resource, type = null) {
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
        _.merge(this.container, parsedFile);
    }
}
exports.JsonLoader = JsonLoader;
//# sourceMappingURL=JsonLoader.js.map