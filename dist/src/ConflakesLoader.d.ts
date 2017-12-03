import { Config } from "./Config";
export declare class ConflakesLoader {
    private frozen;
    private loader;
    private config;
    constructor();
    load: (resource: any, type?: any) => ConflakesLoader;
    getConfig: (freeze?: boolean) => Config;
    private deepFreeze(o);
}
