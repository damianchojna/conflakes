import { LoaderInterface } from "./LoaderInterface";
import { LoaderResolverInterface } from "./LoaderResolverInterface";
export declare abstract class LoaderAbstract implements LoaderInterface {
    abstract load(resource: any, type: string, as?: string | null): void;
    abstract supports(resource: any, type: string): boolean;
    protected resolver: any;
    getResolver(): LoaderResolverInterface;
    setResolver(resolver: LoaderResolverInterface): void;
    import(resource: any, type?: string | null): any;
    resolve(resource: any, type?: string | null): LoaderInterface;
}
