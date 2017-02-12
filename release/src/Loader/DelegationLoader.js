"use strict";
const LoaderAbstract_1 = require("./LoaderAbstract");
const FileLoaderLoadError_1 = require("../Error/FileLoaderLoadError");
class DelegatingLoader extends LoaderAbstract_1.LoaderAbstract {
    constructor(resolver, configContainter) {
        super();
        this.resolver = resolver;
        this.configContainer = configContainter;
    }
    load(resource, type = null) {
        let loader = this.resolver.resolve(resource, type);
        if (false === loader) {
            throw new FileLoaderLoadError_1.FileLoaderLoadError(resource);
        }
        return loader.load(resource, type);
    }
    getConfig() {
        return this.configContainer;
    }
    supports(resource, type = null) {
        return false !== this.resolver.resolve(resource, type);
    }
}
exports.DelegatingLoader = DelegatingLoader;
//# sourceMappingURL=DelegationLoader.js.map