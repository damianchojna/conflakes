import {LoaderResolverInterface} from "./LoaderResolverInterface";
import {LoaderInterface} from "./LoaderInterface";

export class LoaderResolver implements LoaderResolverInterface {

    private loaders: Array<LoaderInterface> = [];

    public constructor(loaders: Array<LoaderInterface> = []) {
        loaders.forEach((loader)=> {
            this.addLoader(loader);
        })
    }

    public resolve(resource: any, type: string|null = null): LoaderInterface|boolean {
        for (let i = 0, len = this.loaders.length; i < len; i++) {
            if (this.loaders[i].supports(resource, type)) {
                return this.loaders[i];
            }
        }
        return false;
    }

    public addLoader(loader: LoaderInterface) {
        this.loaders.push(loader);
        loader.setResolver(this);
    }

    public getLoaders(): LoaderInterface[] {
        return this.loaders;
    }
}
