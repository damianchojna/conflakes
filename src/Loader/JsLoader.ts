import * as _ from 'lodash';
import * as p from 'path';
import {BaseFileLoaderAbstract} from "./BaseFileLoaderAbstract";

export class JsLoader extends BaseFileLoaderAbstract {

    public supports(resource: any, type: string|null = null): boolean {
        return _.isString(resource) && resource && ('js'=== type || p.extname(resource) === '.js')
    }

    /**
     * Laduje do kontenera resource example FileResource jeżeli JsonLoader obsługuje imporotwanie resourców to używa metody
     * import aby wcześniej jeszcze rozwiązać który loader powinien być użyty do załadowania rezourca
     *
     * @param resource
     * @param type
     * @returns {any}
     */
    public load(resource: any, type: string|null = null): void {

        let parsedFile;

        try {
            parsedFile = require(resource);
            if (!_.isObject(parsedFile)) throw new Error(`Module ${resource} do not export object`);
        } catch (e) {
            throw e;
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