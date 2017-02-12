import * as _ from 'lodash';
import {BaseFileLoaderAbstract} from "./BaseFileLoaderAbstract";

export class FunctionLoader extends BaseFileLoaderAbstract {

    public supports(resource: any, type: string|null = null): boolean {
        return _.isFunction(resource) || (_.isFunction(resource) && 'function' === type);
    }

    /**
     * Laduje do kontenera resource example FileResource jeżeli JsonLoader obsługuje imporotwanie resourców to używa metody
     * import aby wcześniej jeszcze rozwiązać który loader powinien być użyty do załadowania rezourca
     *
     */
    public load(callback: Function, type: string|null = null): void {

        var resource = callback(this.container);

        if (!_.isPlainObject(resource)) {
            throw new Error(`Function does not return Object`);
        }

        var imports = [];
        if ('imports' in resource) {
            imports = resource['imports'];
            delete resource['imports'];
        }
        _.merge(this.container, resource);

        this.importFromArray(imports, 'function')
    }

}