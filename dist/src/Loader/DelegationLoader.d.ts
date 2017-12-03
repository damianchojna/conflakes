import { LoaderAbstract } from "./LoaderAbstract";
import { LoaderResolverInterface } from "./LoaderResolverInterface";
export declare class DelegatingLoader extends LoaderAbstract {
    private configContainer;
    constructor(resolver: LoaderResolverInterface, configContainter: object);
    load(resource: any, type?: any): any;
    getConfig(): object;
    supports(resource: any, type?: any): boolean;
}
