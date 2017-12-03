export declare class BuildConfigFromDist {
    static readonly errorMessages: {
        fileNotExist: string;
        problemWithFile: string;
        notValidDistFileName: string;
    };
    static readonly parsers: {
        '.ini': {
            parse: any;
            stringify: any;
        };
        '.yml': {
            parse: any;
            stringify: any;
        };
        '.yaml': {
            parse: any;
            stringify: any;
        };
        '.json': {
            parse: (text: string, reviver?: (key: any, value: any) => any) => any;
            stringify: {
                (value: any, replacer?: (key: string, value: any) => any, space?: string | number): string;
                (value: any, replacer?: (string | number)[], space?: string | number): string;
            };
        };
    };
    merge(inputFile: string): void;
    private parseFile(path);
    private resolveOutputFileName(filename);
    isDist(path: string): boolean;
}
