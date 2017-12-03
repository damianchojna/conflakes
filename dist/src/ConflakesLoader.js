"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoaderResolver_1 = require("./Loader/LoaderResolver");
const DelegationLoader_1 = require("./Loader/DelegationLoader");
const JsonLoader_1 = require("./Loader/JsonLoader");
const JsLoader_1 = require("./Loader/JsLoader");
const YamlLoader_1 = require("./Loader/YamlLoader");
const IniLoader_1 = require("./Loader/IniLoader");
const ObjectLoader_1 = require("./Loader/ObjectLoader");
const FunctionLoader_1 = require("./Loader/FunctionLoader");
const Config_1 = require("./Config");
const _ = require("lodash");
class ConflakesLoader {
    constructor() {
        this.frozen = false;
        this.load = function (resource, type = null) {
            this.loader.load(resource, type);
            return this;
        };
        this.getConfig = function (freeze = true) {
            if (this.frozen || freeze) {
                if (!this.frozen) {
                    this.frozen = new Config_1.Config(this.deepFreeze(this.config));
                }
                return this.frozen;
            }
            return new Config_1.Config(this.deepFreeze(this.config));
        };
        this.config = {};
        let resolver = new LoaderResolver_1.LoaderResolver([
            new JsonLoader_1.JsonLoader(this.config),
            new YamlLoader_1.YamlLoader(this.config),
            new IniLoader_1.IniLoader(this.config),
            new ObjectLoader_1.ObjectLoader(this.config),
            new FunctionLoader_1.FunctionLoader(this.config),
            new JsLoader_1.JsLoader(this.config),
        ]);
        this.loader = new DelegationLoader_1.DelegatingLoader(resolver, this.config);
        this.frozen = false;
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
exports.ConflakesLoader = ConflakesLoader;
//# sourceMappingURL=ConflakesLoader.js.map