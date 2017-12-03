import {FileLoaderAbstract} from "./FileLoaderAbstract";

export abstract class BaseFileLoaderAbstract extends FileLoaderAbstract {

    protected container: object;

    public constructor(container: object) {
        super();
        this.container = container;
    }

}