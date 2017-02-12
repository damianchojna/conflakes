import {LoaderAbstract} from "./LoaderAbstract";
import {FileLoaderLoadError} from "../Error/FileLoaderLoadError";
import {ConfigContainer} from "../ParameterBag";

export class DelegatingLoader extends LoaderAbstract {

    private configContainer:ConfigContainer;

    public constructor(resolver: LoaderResolverInterface, configContainter:ConfigContainer) {
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

    public getConfig():ConfigContainer {
        return this.configContainer;
    }

    public supports(resource, type = null) {
        return false !== this.resolver.resolve(resource, type);
    }
}
