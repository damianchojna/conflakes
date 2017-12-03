import { LoaderResolverInterface } from "./LoaderResolverInterface";
import { LoaderInterface } from "./LoaderInterface";
export declare class LoaderResolver implements LoaderResolverInterface {
    private loaders;
    constructor(loaders?: Array<LoaderInterface>);
    resolve(resource: any, type?: string | null): LoaderInterface | boolean;
    addLoader(loader: LoaderInterface): void;
    getLoaders(): LoaderInterface[];
}
