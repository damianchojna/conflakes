'use strict';
const fs = require('fs');
const p = require('path');
const expect = require('chai').expect;
const sinon = require('sinon');
const yml = require('js-yaml');
const {BuildConfigFromDist} = require('../../src/BuildConfigFromDist');

describe('BuildConfigFromDist', () => {

    let distBuild;
    var writeFileSyncMock;

    beforeEach(function () {
        distBuild = new BuildConfigFromDist();
        writeFileSyncMock = sinon.stub(fs, 'writeFileSync');
    });
    afterEach(function () {
        writeFileSyncMock.restore();
    });

    describe('JSON merge', () => {
        it('Should throw exception when given file is not exist', () => {
            expect(() => {
                distBuild.merge('non_exist.dist.json');
            }).to.throw(Error, BuildConfigFromDist.errorMessages.fileNotExist + 'non_exist.dist.json');
        });

        it('Should throw exception when no valid json given', () => {
            let inputFile = p.normalize(__dirname + '/../../../tests/Fixtures/dist/json/not_valid.json');
            expect(() => {
                distBuild.merge(inputFile);
            }).to.throw(Error, BuildConfigFromDist.errorMessages.problemWithFile + inputFile);
        });

        it('Should throw exception when given file name does not contain the "dist" word', () => {
            let inputFile = p.normalize(__dirname + '/../../../tests/Fixtures/dist/json/valid.json');
            expect(() => {
                distBuild.merge(inputFile);
            }).to.throw(Error, BuildConfigFromDist.errorMessages.notValidDistFileName + 'valid.json');
        });

        it('Should throw exception when output file has not valid json', () => {
            let inputFile = p.normalize(__dirname + '/../../../tests/Fixtures/dist/json/not_valid/config.dist.json');
            let outputFile = p.normalize(__dirname + '/../../../tests/Fixtures/dist/json/not_valid/config.json');

            expect(() => {
                distBuild.merge(inputFile);
            }).to.throw(Error, BuildConfigFromDist.errorMessages.problemWithFile + outputFile);
        });

        it('Should correct merge dist and user config', () => {
            let inputFile = p.normalize(__dirname + '/../../../tests/Fixtures/dist/json/valid/config.dist.json');

            distBuild.merge(inputFile);
            expect(JSON.parse(writeFileSyncMock.args[0][1])).to.deep.equal({
                "dbs": {
                    "master": {
                        "name": "custom"
                    },
                    "slave": {
                        "name": "hbq_db"
                    }
                }
            });
        });

        it("Should correct merge dist and user config when do not have user config file", () => {
            let inputFile = p.normalize(__dirname + '/../../../tests/Fixtures/dist/json//valid.dist.json');

            distBuild.merge(inputFile);
            expect(JSON.parse(writeFileSyncMock.args[0][1])).to.deep.equal({
                "one": "1"
            });
        });
    });

    describe('YML merge', () => {
        it('Should throw exception when no valid yml given', () => {
            let inputFile = p.normalize(__dirname + '/../../../tests/Fixtures/dist/yml/not_valid.yml');
            expect(() => {
                distBuild.merge(inputFile);
            }).to.throw(Error, BuildConfigFromDist.errorMessages.problemWithFile + inputFile);
        });

        it('Should throw exception when output file has not valid json', () => {
            let inputFile = p.normalize(__dirname + '/../../../tests/Fixtures/dist/yml/not_valid/config.dist.yml');
            let outputFile = p.normalize(__dirname + '/../../../tests/Fixtures/dist/yml/not_valid/config.yml');

            expect(() => {
                distBuild.merge(inputFile);
            }).to.throw(Error, BuildConfigFromDist.errorMessages.problemWithFile + outputFile);
        });

        it('Should correct merge dist and user config', () => {
            let inputFile = p.normalize(__dirname + '/../../../tests/Fixtures/dist/yml/valid/config.dist.yml');

            distBuild.merge(inputFile);
            let output = writeFileSyncMock.args[0][1];
            expect(output).to.deep.equal("dbs:\n  master:\n    name: custom\n  slave:\n    name: hbq_db\n");
        });

        it("Should correct merge dist and user config when do not have user config file", () => {
            let inputFile = p.normalize(__dirname + '/../../../tests/Fixtures/dist/yml/valid.dist.yml');

            distBuild.merge(inputFile);

            let output = writeFileSyncMock.args[0][1];
            expect(output).to.deep.equal("one: '1'\n");
        });
    });
});
