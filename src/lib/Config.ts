import * as path from 'path';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as yml from 'js-yaml';
import * as ini from 'ini';

class Config {
    private configs: Object;
    private parsers = {
        '.json': JSON.parse,
        '.yml': yml.safeLoad,
        '.ini': ini.parse
    };

    constructor() {
        this.configs = this.deepFreeze(this.readConfigFile(process.env.CONFIG_DIR));
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
        let content;
        try {
            content = fs.readFileSync(configPath, 'utf8')
        } catch (e) {
            throw new Error(`There was an error reading the config file: \n${e.toString()}`)
        }
        let subConfig;
        try {
            let ext = path.extname(configPath);
            subConfig = this.parsers[ext](content);
        } catch (e) {
            throw new Error(`Not valid file: ${configPath}\n${e.toString()}`)
        }

        if ('imports' in subConfig) {
            let imports = subConfig['imports'];
            delete subConfig['imports'];

            imports.forEach((importConfig) => {
                if (path.isAbsolute(importConfig)) {
                    _.merge(subConfig, this.readConfigFile(importConfig));
                } else {
                    _.merge(subConfig, this.readConfigFile(path.join(path.dirname(configPath), importConfig)));
                }
            });
        }
        return subConfig;
    }

    private deepFreeze(o: Object): Object {
        Object.freeze(o);
        _.forEach(o, (value, key) => {
            if (!_.isNull(o[key]) &&
                (_.isObject(o[key]) || _.isFunction(o[key]))
                && !Object.isFrozen(o[key])) {

                this.deepFreeze(o[key]);
            }
        });

        return o;
    };
}
export default new Config();
