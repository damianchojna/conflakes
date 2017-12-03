import { LoaderResolverInterface } from "./LoaderResolverInterface";
export interface LoaderInterface {
    load(resource: any, type: string | null): void;
    supports(resource: any, type: string | null): boolean;
    getResolver(): LoaderResolverInterface;
    setResolver(resolver: LoaderResolverInterface): any;
}
