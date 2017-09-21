"use strict";
const FileLoaderLoadError_1 = require("../Error/FileLoaderLoadError");
class LoaderAbstract {
    getResolver() {
        return this.resolver;
    }
    setResolver(resolver) {
        this.resolver = resolver;
    }
    import(resource, type = null) {
        return this.resolve(resource, type).load(resource, type);
    }
    resolve(resource, type = null) {
        if (this.supports(resource, type)) {
            return this;
        }
        let loader = null === this.resolver ? false : this.resolver.resolve(resource, type);
        if (false === loader) {
            throw new FileLoaderLoadError_1.FileLoaderLoadError(resource);
        }
        return loader;
    }
}
exports.LoaderAbstract = LoaderAbstract;
//# sourceMappingURL=LoaderAbstract.js.map