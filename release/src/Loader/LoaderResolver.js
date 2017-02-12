"use strict";
class LoaderResolver {
    constructor(loaders = []) {
        this.loaders = [];
        loaders.forEach((loader) => {
            this.addLoader(loader);
        });
    }
    resolve(resource, type = null) {
        for (let i = 0, len = this.loaders.length; i < len; i++) {
            if (this.loaders[i].supports(resource, type)) {
                return this.loaders[i];
            }
        }
        return false;
    }
    addLoader(loader) {
        this.loaders.push(loader);
        loader.setResolver(this);
    }
    getLoaders() {
        return this.loaders;
    }
}
exports.LoaderResolver = LoaderResolver;
//# sourceMappingURL=LoaderResolver.js.map