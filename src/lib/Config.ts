import path = require('path');
import fs = require('fs');
import _ = require('lodash');

export class Config {
    private configs: Object;

    constructor(rootConfigPath) {
        this.configs = this.deepFreeze(this.readJsonConfig(rootConfigPath));
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

    private readJsonConfig(configPath: string): Object {
        try {
            var json = fs.readFileSync(configPath, 'utf8')
        } catch (e) {
            throw new Error(`There was an error reading the config file: \n${e.toString()}`)
        }

        try {
            var subconfig = JSON.parse(json);
        } catch (e) {
            throw new Error(`Not valid json file: ${configPath}\n${e.toString()}`)
        }

        if ('imports' in subconfig) {
            var imports = subconfig['imports'];
            delete subconfig['imports'];

            imports.forEach((importConfig)=> {
                if (path.isAbsolute(importConfig)) {
                    _.extend(subconfig, this.readJsonConfig(importConfig));
                } else {
                    _.extend(subconfig, this.readJsonConfig(path.join(path.dirname(configPath), importConfig)));
                }
            });
        }
        return subconfig;
    }

    private deepFreeze(o: Object): Object {
        Object.freeze(o);

        Object.getOwnPropertyNames(o).forEach( (prop)=>{
            if (!_.isNull(o[prop]) &&
                (_.isObject(o[prop]) || _.isFunction(o[prop]))
                && !Object.isFrozen(o[prop])) {

                this.deepFreeze(o[prop]);
            }
        });

        return o;
    };
}

