import {FileLoaderLoadError} from "../Error/FileLoaderLoadError";
import {LoaderInterface} from "./LoaderInterface";
import {LoaderResolverInterface} from "./LoaderResolverInterface";

export abstract class LoaderAbstract implements LoaderInterface {

    protected resolver;

    public getResolver(): LoaderResolverInterface {
        return this.resolver;
    }

    public setResolver(resolver: LoaderResolverInterface): void {
        this.resolver = resolver;
    }

    /**
     * Import resources defined in resource
     */
    public import(resource: any, type: string|null = null): any {
        return this.resolve(resource, type).load(resource, type);
    }

    public resolve(resource: any, type: string|null = null): LoaderInterface {
        if (this.supports(resource, type)) {
            return this;
        }

        let loader = null === this.resolver ? false : this.resolver.resolve(resource, type);

        if (false === loader) {
            throw new FileLoaderLoadError(resource);
        }

        return loader;
    }
}
