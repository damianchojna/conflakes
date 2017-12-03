import { LoaderAbstract } from "./LoaderAbstract";
export declare abstract class FileLoaderAbstract extends LoaderAbstract {
    static loading: string[];
    import(resource: string, type?: string | null, ignoreErrors?: boolean, sourceResource?: string | null): void;
    importFromArray(imports: {
        resource: string;
        ignore_errors: boolean;
        type: string;
    }[], sourceResource: string): void;
    protected getFileContent(resource: string): string;
}
