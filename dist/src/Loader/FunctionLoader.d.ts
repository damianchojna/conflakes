import { BaseFileLoaderAbstract } from "./BaseFileLoaderAbstract";
export declare class FunctionLoader extends BaseFileLoaderAbstract {
    supports(resource: any, type?: string | null): boolean;
    load(callback: Function, type: string | null, as: string | null): void;
}
