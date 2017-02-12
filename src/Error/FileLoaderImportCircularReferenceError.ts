import {FileLoaderLoadError} from "./FileLoaderLoadError";

export class FileLoaderImportCircularReferenceError extends FileLoaderLoadError {
    public constructor(resources: string[]) {
        let message = `Circular reference detected in "${resources[0]}" ("${resources.join(" > ")}" > "${resources[0]}"`;
        super(message);
    }
}