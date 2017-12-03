import { BaseFileLoaderAbstract } from "./BaseFileLoaderAbstract";
export declare class ObjectLoader extends BaseFileLoaderAbstract {
    supports(resource: any, type?: string | null): boolean;
    load(resource: Object, type?: string | null): void;
}
