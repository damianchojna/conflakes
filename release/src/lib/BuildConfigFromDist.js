'use strict';
const fs = require("fs");
const p = require("path");
const _ = require("lodash");
class BuildConfigFromDist {
    static merge(inputFile) {
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
    static readJsonFile(path) {
        try {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        }
        catch (e) {
            throw new Error(BuildConfigFromDist.errorMessages.notValidJsonFile + path);
        }
    }
    static resolveOutputFileName(filename) {
        let splited = filename.split('.');
        if (splited.indexOf("dist") === -1) {
            throw new Error(BuildConfigFromDist.errorMessages.notValidDistFileName + filename);
        }
        splited.splice(splited.indexOf('dist'), 1);
        return splited.join('.');
    }
    static isDist(path) {
        let splited = p.basename(path).split('.');
        return splited.indexOf("dist") !== -1;
    }
}
BuildConfigFromDist.errorMessages = {
    fileNotExist: 'Given file does not exist: ',
    notValidJsonFile: 'Not valid json in file: ',
    notValidDistFileName: 'Given file name does not contain the "dist" word: '
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BuildConfigFromDist;
