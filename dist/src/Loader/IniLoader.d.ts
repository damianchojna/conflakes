import { BaseFileLoaderAbstract } from "./BaseFileLoaderAbstract";
export declare class IniLoader extends BaseFileLoaderAbstract {
    supports(resource: any, type?: string | null): boolean;
    load(resource: any, type: string | null, as: string | null): void;
}
