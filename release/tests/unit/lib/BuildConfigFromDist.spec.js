'use strict';
const fs = require("fs");
const path = require("path");
const chai_1 = require("chai");
const sinon = require("sinon");
describe('BuildConfigFromDist', () => {
    const BuildConfigFromDist = require(path.join('..', '..', '..', 'src', 'lib', 'BuildConfigFromDist')).default;
    let existsFileSyncMock;
    let writeFileSyncMock;
    let readFileSyncMock;
    beforeEach(function () {
        existsFileSyncMock = sinon.stub(fs, 'existsSync');
        writeFileSyncMock = sinon.stub(fs, 'writeFileSync');
        readFileSyncMock = sinon.stub(fs, 'readFileSync');
    });
    afterEach(function () {
        existsFileSyncMock.restore();
        writeFileSyncMock.restore();
        readFileSyncMock.restore();
    });
    describe('Tests "merge" function', () => {
        it('Should throw exception when given file is not exist', () => {
            //given
            existsFileSyncMock.withArgs('file.dist.js').returns(false);
            //then
            chai_1.expect(BuildConfigFromDist.merge.bind(null, 'file.dist.js'))
                .to.throw(Error, BuildConfigFromDist.errorMessages.fileNotExist + 'file.dist.js');
        });
        it('Should throw exception when no valid json given', () => {
            //given
            existsFileSyncMock.withArgs('file.dist.js').returns(true);
            readFileSyncMock.returns('{');
            //then
            chai_1.expect(BuildConfigFromDist.merge.bind(null, 'file.dist.js')).to.throw(Error, BuildConfigFromDist.errorMessages.notValidJsonFile + 'file.dist.js');
        });
        it('Should throw exception when given file name does not contain the "dist" word', () => {
            //given
            existsFileSyncMock.withArgs('file.js').returns(true);
            readFileSyncMock.returns('{}');
            //then
            chai_1.expect(BuildConfigFromDist.merge.bind(null, 'file.js'))
                .to.throw(Error, BuildConfigFromDist.errorMessages.notValidDistFileName + 'file.js');
        });
        it('Should throw exception when output file has not valid json', () => {
            //given
            existsFileSyncMock.withArgs('file.dist.js').returns(true);
            existsFileSyncMock.withArgs('file.js').returns(true);
            readFileSyncMock.withArgs('file.dist.js').returns('{}');
            readFileSyncMock.withArgs('file.js').returns('{');
            //then
            chai_1.expect(BuildConfigFromDist.merge.bind(null, 'file.dist.js'))
                .to.throw(Error, BuildConfigFromDist.errorMessages.notValidJsonFile + 'file.js');
        });
        it('Should correct merge dist and user config', () => {
            //given
            existsFileSyncMock.withArgs('file.dist.js').returns(true);
            existsFileSyncMock.withArgs('file.js').returns(true);
            readFileSyncMock.withArgs('file.dist.js').returns(JSON.stringify({
                oldKey: "standard",
                newKey: "standard",
            }));
            readFileSyncMock.withArgs('file.js').returns(JSON.stringify({
                oldKey: "custom"
            }));
            //when
            BuildConfigFromDist.merge('file.dist.js');
            //then
            chai_1.expect(JSON.parse(writeFileSyncMock.args[0][1])).to.deep.equal({
                oldKey: "custom",
                newKey: "standard"
            });
        });
        it("Should correct merge dist and user config when do not have user config file", () => {
            //given
            existsFileSyncMock.withArgs('file.dist.js').returns(true);
            readFileSyncMock.withArgs('file.dist.js').returns(JSON.stringify({
                oldKey: "standard",
                newKey: "standard",
            }));
            existsFileSyncMock.withArgs('file.js').returns(false);
            //when
            BuildConfigFromDist.merge('file.dist.js');
            //then
            chai_1.expect(JSON.parse(writeFileSyncMock.args[0][1])).to.deep.equal({
                oldKey: "standard",
                newKey: "standard"
            });
        });
    });
});
