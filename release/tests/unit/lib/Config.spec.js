'use strict';
const expect = require('chai').expect;
const fs = require("fs");
const path = require("path");
const sinon = require("sinon");
const ini = require("ini");
describe('Config Module', () => {
    var { Config } = require(path.join('..', '..', '..', 'src', 'lib', 'Config'));
    var readFileSyncMock;
    describe('Tests "constructor"', () => {
        beforeEach(function () {
            readFileSyncMock = sinon.stub(fs, 'readFileSync');
        });
        afterEach(function () {
            readFileSyncMock.restore();
        });
        it('Should throw exception when given config file is not exist', () => {
            //given
            readFileSyncMock.withArgs('config.json').throws(Error);
            //then
            expect(() => {
                new Config('config.json');
            }).to.throw(Error, /There was an error reading the config file.*/);
        });
        it('Should throw exception when given config file has non valid json', () => {
            //given
            readFileSyncMock.withArgs('config.json').returns('{');
            //then
            expect(() => {
                new Config('config.json');
            }).to.throw(Error, /Not valid file.*/);
        });
        it('Should throw exception when given import config file is not exist', () => {
            //given
            readFileSyncMock.withArgs('config.prod.json').returns(JSON.stringify({
                imports: [
                    "services.json"
                ],
            }));
            readFileSyncMock.withArgs('services.json').returns(JSON.stringify({
                imports: [
                    "service_bundles.json"
                ],
            }));
            readFileSyncMock.withArgs('service_bundles.json').throws(Error);
            //then
            expect(() => {
                new Config('service_bundles.json');
            }).to.throw(Error, /There was an error reading the config file.*/);
        });
        it('Should throw exception when given import config file has non valid json', () => {
            //given
            readFileSyncMock.withArgs('config.prod.json').returns(JSON.stringify({
                imports: [
                    "services.json"
                ],
            }));
            readFileSyncMock.withArgs('services.json').returns(JSON.stringify({
                imports: [
                    "service_bundles.json"
                ],
            }));
            readFileSyncMock.withArgs('service_bundles.json').returns('{');
            //then
            expect(() => {
                new Config('config.json');
            }).to.throw(Error, /Not valid file.*/);
        });
    });
    describe('Tests loaders and parsers', () => {
        beforeEach(function () {
            readFileSyncMock = sinon.stub(fs, 'readFileSync');
        });
        afterEach(function () {
            readFileSyncMock.restore();
        });
        it('Should import file yml file', () => {
            //given
            readFileSyncMock.withArgs('config.prod.json').returns(JSON.stringify({
                imports: [
                    "services.yml"
                ]
            }));
            readFileSyncMock.withArgs('services.yml').returns(`
                imports:
                    - routing.json
                services:
                    mailer:
                        class: Mailer
            `);
            readFileSyncMock.withArgs('routing.json').returns(JSON.stringify({
                routing: {
                    home: {
                        path: "/"
                    }
                }
            }));
            //when
            var config = new Config('config.prod.json');
            var all = config.all();
            //then
            expect(all).to.deep.equal({
                services: {
                    mailer: {
                        class: "Mailer"
                    }
                },
                routing: {
                    home: {
                        path: "/"
                    }
                }
            });
        });
        it('Should import file ini file', () => {
            //given
            readFileSyncMock.withArgs('config.prod.json').returns(JSON.stringify({
                imports: [
                    "/home/prod/app/infrastructure.ini"
                ],
                dbs: {
                    master: {
                        host: "dbb"
                    }
                }
            }));
            readFileSyncMock.withArgs('/home/prod/app/infrastructure.ini').returns(ini.encode({
                dbs: {
                    master: {
                        password: "12345"
                    },
                }
            }));
            //when
            var config = new Config('config.prod.json');
            var all = config.all();
            //then
            expect(all).to.deep.equal({
                dbs: {
                    master: {
                        host: "dbb",
                        password: "12345"
                    }
                }
            });
        });
    });
    describe('Tests "all" method', () => {
        beforeEach(function () {
            readFileSyncMock = sinon.stub(fs, 'readFileSync');
            //given
            readFileSyncMock.withArgs('config.prod.json').returns(JSON.stringify({
                imports: [
                    "services.json"
                ],
                framework: {
                    name: "AppName"
                }
            }));
            readFileSyncMock.withArgs('services.json').returns(JSON.stringify({
                services: {
                    mailer: {
                        class: "Mailer"
                    }
                }
            }));
        });
        afterEach(function () {
            readFileSyncMock.restore();
        });
        it('Should import file form root config', () => {
            //given
            //in beforeEach
            //when
            var config = new Config('config.prod.json');
            var all = config.all();
            //then
            expect(all).to.deep.equal({
                services: {
                    mailer: {
                        class: "Mailer"
                    }
                },
                framework: {
                    name: "AppName"
                }
            });
        });
        it('Should throw exception when someone try modify config properties', () => {
            //given
            //in beforeEach
            //when
            var config = new Config('config.prod.json');
            var all = config.all();
            //then
            expect(() => {
                all.newParam = 'someValue';
            }).to.throw(Error, /Can't add property newParam, object is not extensible.*/);
        });
    });
    describe('Tests "get" method', () => {
        beforeEach(function () {
            readFileSyncMock = sinon.stub(fs, 'readFileSync');
            //given
            readFileSyncMock.withArgs('config.prod.json').returns(JSON.stringify({
                imports: [
                    "services.json"
                ],
                framework: {
                    name: "AppName"
                }
            }));
            readFileSyncMock.withArgs('services.json').returns(JSON.stringify({
                services: {
                    mailer: {
                        class: "Mailer"
                    }
                }
            }));
        });
        afterEach(function () {
            readFileSyncMock.restore();
        });
        it('Should get property', () => {
            //given
            //in beforeEach
            //when
            var config = new Config('config.prod.json');
            var mailerClass = config.get('services.mailer.class');
            //then
            expect(mailerClass).to.equal("Mailer");
        });
        it('Should throw exception when there is no property in the configuration', () => {
            //given
            //in beforeEach
            //when
            var config = new Config('config.prod.json');
            //then
            expect(() => {
                config.get('services.non.exist.parameter');
            }).to.throw(Error, /Configuration property.*is not defined/);
        });
        it('Should throw exception when someone try modify config properties', () => {
            //given
            //in beforeEach
            //when
            var config = new Config('config.prod.json');
            var services = config.get('services');
            //then
            expect(() => {
                services.newParam = 'someValue';
            }).to.throw(Error, /Can't add property newParam, object is not extensible.*/);
        });
    });
});
//# sourceMappingURL=Config.spec.js.map