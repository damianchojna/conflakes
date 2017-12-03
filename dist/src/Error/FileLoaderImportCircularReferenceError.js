"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FileLoaderLoadError_1 = require("./FileLoaderLoadError");
class FileLoaderImportCircularReferenceError extends FileLoaderLoadError_1.FileLoaderLoadError {
    constructor(resources) {
        let message = `Circular reference detected in "${resources[0]}" ("${resources.join(" > ")}" > "${resources[0]}"`;
        super(message);
    }
}
exports.FileLoaderImportCircularReferenceError = FileLoaderImportCircularReferenceError;
//# sourceMappingURL=FileLoaderImportCircularReferenceError.js.map