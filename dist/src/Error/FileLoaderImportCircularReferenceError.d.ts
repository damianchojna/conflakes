import { FileLoaderLoadError } from "./FileLoaderLoadError";
export declare class FileLoaderImportCircularReferenceError extends FileLoaderLoadError {
    constructor(resources: string[]);
}
