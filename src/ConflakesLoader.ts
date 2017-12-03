import {LoaderResolver} from "./Loader/LoaderResolver";
import {DelegatingLoader} from "./Loader/DelegationLoader";
import {JsonLoader} from "./Loader/JsonLoader";
import {JsLoader} from "./Loader/JsLoader";
import {YamlLoader} from "./Loader/YamlLoader";
import {IniLoader} from "./Loader/IniLoader";
import {ObjectLoader} from "./Loader/ObjectLoader";
import {FunctionLoader} from "./Loader/FunctionLoader";
import {Config} from "./Config";
import * as _ from 'lodash';

export class ConflakesLoader {

    private frozen: Config|boolean = false;
    private loader: DelegatingLoader;
    private config: object;

    public constructor() {
        this.config = {};
        let resolver = new LoaderResolver([
            new JsonLoader(this.config),
            new YamlLoader(this.config),
            new IniLoader(this.config),
            new ObjectLoader(this.config),
            new FunctionLoader(this.config),
            new JsLoader(this.config),
        ]);
        this.loader = new DelegatingLoader(resolver, this.config);
        this.frozen = false;
    }

    public load = function(resource, type = null): ConflakesLoader {
        this.loader.load(resource, type);
        return this;
    }

    public getConfig = function(freeze = true): Config {
        if (this.frozen || freeze) {
            if (!this.frozen) {
                this.frozen = new Config(this.deepFreeze(this.config));
            }
            return this.frozen;
        }
        return new Config(this.deepFreeze(this.config));
    }

    private deepFreeze(o: Object): object {
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