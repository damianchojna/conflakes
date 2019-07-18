import * as _ from 'lodash';
import * as p from 'path';
import * as yml from 'js-yaml';
import {BaseFileLoaderAbstract} from "./BaseFileLoaderAbstract";
import GlobalVariableSchema from "./Extensions/Yaml/GlobalVariableType";

export class YamlLoader extends BaseFileLoaderAbstract {

    public supports(resource: any, type: string|null = null): boolean {
        return _.isString(resource) && resource && (('yml' === type || 'yaml' === type) || ('.yml' === p.extname(resource) || '.yaml' === p.extname(resource)))
    }

    /**
     * Laduje do kontenera resource example FileResource jeżeli JsonLoader obsługuje imporotwanie resourców to używa metody
     * import aby wcześniej jeszcze rozwiązać który loader powinien być użyty do załadowania rezourca
     *
     * @param resource
     * @param type
     * @returns {any}
     */
    public load(resource: any, type: string|null = null, as: string|null): void {

        var content = this.getFileContent(resource);

        try {
            var parsedFile = yml.load(content, { schema: GlobalVariableSchema });
        } catch (e) {
            throw new Error(`Parse Error: ${resource}\n${e.toString()}`)
        }

        var imports = [];
        if ('imports' in parsedFile) {

            for (let imp in parsedFile['imports']) {
                if (parsedFile['imports'][imp]['as'] && as) {
                    parsedFile['imports'][imp]['as'] = as + '.' + parsedFile['imports'][imp]['as']
                } else if (as) {
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