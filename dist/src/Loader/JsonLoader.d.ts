import { BaseFileLoaderAbstract } from "./BaseFileLoaderAbstract";
export declare class JsonLoader extends BaseFileLoaderAbstract {
    supports(resource: any, type?: string | null): boolean;
    load(resource: any, type?: string | null): void;
}
