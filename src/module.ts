import {LoaderResolver} from "./Loader/LoaderResolver";
import {DelegatingLoader} from "./Loader/DelegationLoader";
import {JsonLoader} from "./Loader/JsonLoader";
import {YamlLoader} from "./Loader/YamlLoader";
import {IniLoader} from "./Loader/IniLoader";
import {ObjectLoader} from "./Loader/ObjectLoader";
import {FunctionLoader} from "./Loader/FunctionLoader";
import {ParameterBag} from "./ParameterBag";
import * as _ from 'lodash';

class ConfigLoader {

    public constructor() {
        var config = {};
        let resolver = new LoaderResolver([
            new JsonLoader(config),
            new YamlLoader(config),
            new IniLoader(config),
            new ObjectLoader(config),
            new FunctionLoader(config)
        ]);
        var loader = new DelegatingLoader(resolver, config);
        var frozen:ParameterBag|boolean = false;
    }

    public load = function(resource, type = null) {
        loader.load(resource, type);
        return this;
    }

    public getConfig = function(freeze = true) {
        if (frozen || freeze) {
            if (!frozen) {
                frozen = new ParameterBag(this.deepFreeze(config));
            }
            return frozen;
        }
        return new ParameterBag(this.deepFreeze(config));
    }

    public transformToSingleton = function() {
        exports = module.exports = this.getConfig();
        return this.getConfig();
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

exports = module.exports = ConfigLoader;
