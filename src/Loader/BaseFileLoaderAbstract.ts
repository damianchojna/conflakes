import {ConfigContainer} from "../ParameterBag";
import {FileLoaderAbstract} from "./FileLoaderAbstract";

export abstract class BaseFileLoaderAbstract extends FileLoaderAbstract {

    protected container:Object; //@TODO a może objekt ?

    public constructor(container:Object) {
        super();
        this.container = container;
    }

}