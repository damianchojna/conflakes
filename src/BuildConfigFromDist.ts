'use strict';
import * as fs from 'fs';
import * as p from 'path';
import * as  _ from 'lodash';
import * as ini from 'ini';
import * as yml from 'js-yaml';

export class BuildConfigFromDist {

    public static readonly errorMessages = {
        fileNotExist: 'Given file does not exist: ',
        problemWithFile: 'Problem with read or parse, check file path or check the syntax of the file',
        notValidDistFileName: 'Given file name does not contain the "dist" word: '
    }

    public static readonly parsers = {
        '.ini'  : { parse: ini.parse,    stringify: ini.stringify},
        '.yml'  : { parse: yml.safeLoad, stringify: yml.safeDump },
        '.yaml' : { parse: yml.safeLoad, stringify: yml.safeDump },
        '.json' : { parse: JSON.parse,   stringify: JSON.stringify }
    };

    public merge(inputFile: string): void {
        if (!fs.existsSync(inputFile)) {
            throw Error(BuildConfigFromDist.errorMessages.fileNotExist + inputFile);
        }

        var inputObject = this.parseFile(inputFile);

        let outputFileName = p.basename(inputFile);
        var outputFile = p.join(p.dirname(inputFile), this.resolveOutputFileName(outputFileName));

        if (fs.existsSync(outputFile)) {
            var outputObject = this.parseFile(outputFile);
        }

        var merged = _.merge(inputObject, outputObject);
        fs.writeFileSync(outputFile, BuildConfigFromDist.parsers[p.extname(inputFile)].stringify(merged));
    }

    private parseFile(path: string): Object {
        const ext = p.extname(path);
        if (!(ext in BuildConfigFromDist.parsers)) {
            throw new Error(`Not support ${ext} format files please use some of ${Object.keys(BuildConfigFromDist.parsers).join(',')}`);
        }

        try {
            const content = fs.readFileSync(path, 'utf8');

            return BuildConfigFromDist.parsers[ext].parse(content);
        } catch (e) {
            throw new Error(BuildConfigFromDist.errorMessages.problemWithFile + path)
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

