import {LoaderInterface} from "./LoaderInterface";

export interface LoaderResolverInterface {
    /**
     * Returns a loader able to load the resource.
     *
     * @return LoaderInterface|false The loader or false if none is able to load the resource
     */
    resolve(resource: any, type: string|null = null): LoaderInterface|boolean;
}
