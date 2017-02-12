'use strict';
import * as fs from 'fs';
import * as p from 'path';
import * as  _ from 'lodash';

export class BuildConfigFromDist {

    public static readonly errorMessages = {
        fileNotExist: 'Given file does not exist: ',
        notValidJsonFile: 'Not valid json in file: ',
        notValidDistFileName: 'Given file name does not contain the "dist" word: '
    }

    public merge(inputFile: string): void {
        if (!fs.existsSync(inputFile)) {
            throw Error(BuildConfigFromDist.errorMessages.fileNotExist + inputFile);
        }

        var inputJson = this.readJsonFile(inputFile);

        let outputFileName = p.basename(inputFile);
        var outputFile = p.join(p.dirname(inputFile), this.resolveOutputFileName(outputFileName));

        if (fs.existsSync(outputFile)) {
            var outputJson = this.readJsonFile(outputFile);
        }

        var merged = _.merge(inputJson, outputJson);
        fs.writeFileSync(outputFile, JSON.stringify(merged));
    }

    private readJsonFile(path: string): Object {
        try {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        } catch (e) {
            throw new Error(BuildConfigFromDist.errorMessages.notValidJsonFile + path)
        }
    }

    private resolveOutputFileName(filename: string): string {
        let splited = filename.split('.');
        if (splited.indexOf("dist") === -1) {
            throw new Error(BuildConfigFromDist.errorMessages.notValidDistFileName + filename);
        }

        splited.splice(splited.indexOf('dist'), 1);
        return splited.join('.');
    }

    public isDist(path: string): boolean {
        let splited = p.basename(path).split('.');
        if (splited.indexOf("dist") === -1) {
            return false;
        }
        return true;
    }
}

