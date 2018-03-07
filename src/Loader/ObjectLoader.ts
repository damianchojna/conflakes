import * as _ from 'lodash';
import {BaseFileLoaderAbstract} from "./BaseFileLoaderAbstract";

export class ObjectLoader extends BaseFileLoaderAbstract {

    public supports(resource: any, type: string|null = null): boolean {
        return _.isPlainObject(resource) || (_.isPlainObject(resource) && 'object' === type);
    }

    /**
     * Laduje do kontenera resource example FileResource jeżeli JsonLoader obsługuje imporotwanie resourców to używa metody
     * import aby wcześniej jeszcze rozwiązać który loader powinien być użyty do załadowania rezourca
     *
     */
    public load(resource: Object, type: string|null = null, as: string|null): void {

        var imports = [];
        if ('imports' in resource) {

            for (let imp in resource['imports']) {
                if (resource['imports'][imp]['as'] && as) {
                    resource['imports'][imp]['as'] = as + '.' + resource['imports'][imp]['as']
                } else if (as) {
                    resource['imports'][imp]['as'] = as;
                }
            }
            imports = resource['imports'];
            delete resource['imports'];
        }


        this.importFromArray(imports, 'object');

        _.merge(this.container, resource);

    }

}