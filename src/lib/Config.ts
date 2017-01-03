import * as pathMod from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as yml from 'js-yaml';
import * as ini from 'ini';

export class Config {
    private configs: Object;
    private parsers = {
        '.json': function (content) {
            return JSON.parse(content);
        },
        '.yml': function (content) {
            return yml.safeLoad(content);
        },
        '.ini': function (content) {
            return ini.parse(content);
        }
    }

    constructor(rootConfigPath) {
        this.configs = this.deepFreeze(this.readConfigFile(rootConfigPath));
    }

    public get(property: string, defaultParam?: any): any {
        if (!_.isString(property) || !property) {
            throw new Error("Calling config.get parameter must be non empty string");
        }

        let value = _.get(this.configs, property, defaultParam);

        if (!_.isUndefined(value)) {
            return value
        }

        if (!_.isUndefined(defaultParam)) {
            return defaultParam
        }

        throw new Error(`Configuration property "${property}" is not defined`);
    }

    public has(property: string): boolean {
        return _.has(this.configs, property);
    };

    public all(): Object {
        return this.configs;
    }

    private readConfigFile(configPath: string): Object {
        try {
            var content = fs.readFileSync(configPath, 'utf8')
        } catch (e) {
            throw new Error(`There was an error reading the config file: \n${e.toString()}`)
        }

        try {
            let ext = pathMod.extname(configPath);
            if (ext in this.parsers) {
                var subconfig = this.parsers[ext](content);
            } else {
                var subconfig = this.parsers[0](content);
            }
        } catch (e) {
            throw new Error(`Not valid file: ${configPath}\n${e.toString()}`)
        }

        if ('imports' in subconfig) {
            var imports = subconfig['imports'];
            delete subconfig['imports'];

            imports.forEach((importConfig)=> {
                if (pathMod.isAbsolute(importConfig)) {
                    _.merge(subconfig, this.readConfigFile(importConfig));
                } else {
                    _.merge(subconfig, this.readConfigFile(pathMod.join(pathMod.dirname(configPath), importConfig)));
                }
            });
        }
        return subconfig;
    }

    private deepFreeze(o: Object): Object {
        Object.freeze(o);

        Object.getOwnPropertyNames(o).forEach((prop)=> {
            if (!_.isNull(o[prop]) &&
                (_.isObject(o[prop]) || _.isFunction(o[prop]))
                && !Object.isFrozen(o[prop])) {

                this.deepFreeze(o[prop]);
            }
        });

        return o;
    };
}

