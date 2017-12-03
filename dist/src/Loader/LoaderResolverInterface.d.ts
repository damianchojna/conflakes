import { LoaderInterface } from "./LoaderInterface";
export interface LoaderResolverInterface {
    resolve(resource: any, type: string | null): LoaderInterface | boolean;
}
