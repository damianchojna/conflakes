export declare class Config {
    private parameters;
    constructor(params: object);
    get: (property: string, defaultParam?: any) => any;
    has: (property: string) => boolean;
    all: () => Object;
}
