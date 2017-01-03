"use strict";
const pathMod = require("path");
const fs = require("fs");
const _ = require("lodash");
const yml = require("js-yaml");
const ini = require("ini");
class Config {
    constructor(rootConfigPath) {
        this.parsers = {
            '.json': function (content) {
                return JSON.parse(content);
            },
            '.yml': function (content) {
                return yml.safeLoad(content);
            },
            '.ini': function (content) {
                return ini.parse(content);
            }
        };
        this.configs = this.deepFreeze(this.readConfigFile(rootConfigPath));
    }
    get(property, defaultParam) {
        if (!_.isString(property) || !property) {
            throw new Error("Calling config.get parameter must be non empty string");
        }
        let value = _.get(this.configs, property, defaultParam);
        if (!_.isUndefined(value)) {
            return value;
        }
        if (!_.isUndefined(defaultParam)) {
            return defaultParam;
        }
        throw new Error(`Configuration property "${property}" is not defined`);
    }
    has(property) {
        return _.has(this.configs, property);
    }
    ;
    all() {
        return this.configs;
    }
    readConfigFile(configPath) {
        try {
            var content = fs.readFileSync(configPath, 'utf8');
        }
        catch (e) {
            throw new Error(`There was an error reading the config file: \n${e.toString()}`);
        }
        try {
            let ext = pathMod.extname(configPath);
            if (ext in this.parsers) {
                var subconfig = this.parsers[ext](content);
            }
            else {
                var subconfig = this.parsers[0](content);
            }
        }
        catch (e) {
            throw new Error(`Not valid file: ${configPath}\n${e.toString()}`);
        }
        if ('imports' in subconfig) {
            var imports = subconfig['imports'];
            delete subconfig['imports'];
            imports.forEach((importConfig) => {
                if (pathMod.isAbsolute(importConfig)) {
                    _.merge(subconfig, this.readConfigFile(importConfig));
                }
                else {
                    _.merge(subconfig, this.readConfigFile(pathMod.join(pathMod.dirname(configPath), importConfig)));
                }
            });
        }
        return subconfig;
    }
    deepFreeze(o) {
        Object.freeze(o);
        Object.getOwnPropertyNames(o).forEach((prop) => {
            if (!_.isNull(o[prop]) &&
                (_.isObject(o[prop]) || _.isFunction(o[prop]))
                && !Object.isFrozen(o[prop])) {
                this.deepFreeze(o[prop]);
            }
        });
        return o;
    }
    ;
}
exports.Config = Config;
//# sourceMappingURL=Config.js.map