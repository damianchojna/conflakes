"use strict";
class FileLoaderLoadError extends Error {
    constructor(resource, sourceResource = null, prevError = null) {
        super('');
        this.name = this.constructor.name;
        var prevErrMessage = '';
        if (prevError) {
            prevErrMessage = `\n${prevError.message}`;
        }
        if (sourceResource) {
            this.message = `Cannot import: ${resource} from ${sourceResource}${prevErrMessage}`;
        }
        else {
            this.message = `Cannot load: ${resource}${prevErrMessage}`;
        }
    }
}
exports.FileLoaderLoadError = FileLoaderLoadError;
//# sourceMappingURL=FileLoaderLoadError.js.map