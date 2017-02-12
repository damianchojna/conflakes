"use strict";
const LoaderResolver_1 = require("./Loader/LoaderResolver");
const DelegationLoader_1 = require("./Loader/DelegationLoader");
const JsonLoader_1 = require("./Loader/JsonLoader");
const YamlLoader_1 = require("./Loader/YamlLoader");
const IniLoader_1 = require("./Loader/IniLoader");
const ObjectLoader_1 = require("./Loader/ObjectLoader");
const FunctionLoader_1 = require("./Loader/FunctionLoader");
const ParameterBag_1 = require("./ParameterBag");
const _ = require("lodash");
class ConfigLoader {
    constructor() {
        this.load = function (resource, type = null) {
            loader.load(resource, type);
            return this;
        };
        this.getConfig = function (freeze = true) {
            if (frozen || freeze) {
                if (!frozen) {
                    frozen = new ParameterBag_1.ParameterBag(this.deepFreeze(config));
                }
                return frozen;
            }
            return new ParameterBag_1.ParameterBag(this.deepFreeze(config));
        };
        this.transformToSingleton = function () {
            exports = module.exports = this.getConfig();
            return this.getConfig();
        };
        var config = {};
        let resolver = new LoaderResolver_1.LoaderResolver([
            new JsonLoader_1.JsonLoader(config),
            new YamlLoader_1.YamlLoader(config),
            new IniLoader_1.IniLoader(config),
            new ObjectLoader_1.ObjectLoader(config),
            new FunctionLoader_1.FunctionLoader(config)
        ]);
        var loader = new DelegationLoader_1.DelegatingLoader(resolver, config);
        var frozen = false;
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
exports = module.exports = ConfigLoader;
//# sourceMappingURL=module.js.map