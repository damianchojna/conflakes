'use strict';
const fs = require("fs");
const p = require("path");
const _ = require("lodash");
class BuildConfigFromDist {
    merge(inputFile) {
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
    readJsonFile(path) {
        try {
            return JSON.parse(fs.readFileSync(path, 'utf8'));
        }
        catch (e) {
            throw new Error(BuildConfigFromDist.errorMessages.notValidJsonFile + path);
        }
    }
    resolveOutputFileName(filename) {
        let splited = filename.split('.');
        if (splited.indexOf("dist") === -1) {
            throw new Error(BuildConfigFromDist.errorMessages.notValidDistFileName + filename);
        }
        splited.splice(splited.indexOf('dist'), 1);
        return splited.join('.');
    }
    isDist(path) {
        let splited = p.basename(path).split('.');
        if (splited.indexOf("dist") === -1) {
            return false;
        }
        return true;
    }
}
BuildConfigFromDist.errorMessages = {
    fileNotExist: 'Given file does not exist: ',
    notValidJsonFile: 'Not valid json in file: ',
    notValidDistFileName: 'Given file name does not contain the "dist" word: '
};
exports.BuildConfigFromDist = BuildConfigFromDist;
//# sourceMappingURL=BuildConfigFromDist.js.map