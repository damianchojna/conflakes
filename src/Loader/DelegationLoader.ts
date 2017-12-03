import {LoaderAbstract} from "./LoaderAbstract";
import {FileLoaderLoadError} from "../Error/FileLoaderLoadError";
import {LoaderResolverInterface} from "./LoaderResolverInterface";

export class DelegatingLoader extends LoaderAbstract {

    private configContainer: object;

    public constructor(resolver: LoaderResolverInterface, configContainter: object) {
        super();
        this.resolver = resolver;
        this.configContainer = configContainter;
    }

    public load(resource, type = null) {
        let loader = this.resolver.resolve(resource, type);

        if (false === loader) {
            throw new FileLoaderLoadError(resource);
        }

        return loader.load(resource, type);
    }

    public getConfig(): object {
        return this.configContainer;
    }

    public supports(resource, type = null) {
        return false !== this.resolver.resolve(resource, type);
    }
}
