import * as _ from 'lodash';
import * as p from 'path';
import {BaseFileLoaderAbstract} from "./BaseFileLoaderAbstract";

export class JsonLoader extends BaseFileLoaderAbstract {

    public supports(resource: any, type: string|null = null): boolean {
        return _.isString(resource) && resource && ('json'=== type || p.extname(resource) === '.json')
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

        var content = this.getFileContent(resource);

        try {
            var parsedFile = JSON.parse(content);
        } catch (e) {
            throw new Error(`Parse Error: ${resource}\n${e.toString()}`)
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