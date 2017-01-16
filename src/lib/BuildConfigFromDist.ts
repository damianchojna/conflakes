'use strict';
import * as fs from 'fs';
import * as p from 'path';
import * as  _ from 'lodash';

export default class BuildConfigFromDist {

    public static readonly errorMessages = {
        fileNotExist: 'Given file does not exist: ',
        notValidJsonFile: 'Not valid json in file: ',
        notValidDistFileName: 'Given file name does not contain the "dist" word: '
    };

    public static merge(inputFile: string): void {
        if (!fs.existsSync(inputFile)) {
            throw Error(BuildConfigFromDist.errorMessages.fileNotExist + inputFile);
        }

        let inputJson = BuildConfigFromDist.readJsonFile(inputFile);

        let outputFileName = p.basename(inputFile);
        let outputFile = p.join(p.dirname(inputFile), BuildConfigFromDist.resolveOutputFileName(outputFileName));
        let outputJson = {};
        if (fs.existsSync(outputFile)) {
            outputJson = BuildConfigFromDist.readJsonFile(outputFile);
        }

        let merged = _.merge(inputJson, outputJson);
        fs.writeFileSync(outputFile, JSON.stringify(merged));
    }

    private static readJsonFile(path: string): Object {
        try {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        } catch (e) {
            throw new Error(BuildConfigFromDist.errorMessages.notValidJsonFile + path)
        }
    }

    private static resolveOutputFileName(filename: string): string {
        let splited = filename.split('.');
        if (splited.indexOf("dist") === -1) {
            throw new Error(BuildConfigFromDist.errorMessages.notValidDistFileName + filename);
        }

        splited.splice(splited.indexOf('dist'), 1);
        return splited.join('.');
    }

    public static isDist(path: string): boolean {
        let splited = p.basename(path).split('.');
        return splited.indexOf("dist") !== -1;
    }
}

