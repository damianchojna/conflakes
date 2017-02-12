import construct = Reflect.construct;

export class FileLoaderLoadError extends Error {
    public constructor(resource:string, sourceResource:string|null = null, prevError:Error|null = null) {
        super('');
        this.name = this.constructor.name;

        var prevErrMessage = '';
        if (prevError) {
            prevErrMessage = `\n${prevError.message}`;
        }

        if (sourceResource) {
            this.message = `Cannot import: ${resource} from ${sourceResource}${prevErrMessage}`;
        } else {
            this.message = `Cannot load: ${resource}${prevErrMessage}`;
        }
    }
}