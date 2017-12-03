import {LoaderResolverInterface} from "./LoaderResolverInterface";

export interface LoaderInterface {


    load(resource: any, type: string|null): void;

    /**
     * Returns whether this class supports the given resource.
     */
    supports(resource: any, type: string|null): boolean;


    getResolver(): LoaderResolverInterface;

    /**
     * Each loader must have reference to resolver because each loader can import another resource and must be able to resolve it
     */
    setResolver(resolver: LoaderResolverInterface);
}