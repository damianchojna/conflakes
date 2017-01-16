'use strict';
const expect = require('chai').expect;
const path = require("path");
describe('Config Module', () => {
    function invalidRequireCache(path) {
        delete require.cache[path];
    }
    describe('Tests on load module', () => {
        let basePath = path.resolve(__dirname, '..', '..', 'fixtures', 'constructor');
        describe('When CONFIG_DIR is NOT set', () => {
            it('Should throw exception "There was an error reading the config file"', () => {
                //given
                process.env.CONFIG_DIR = 'config.error.json';
                //then
                expect(require.bind(null, '../../../src/lib/Config')).to.throw(Error, /There was an error reading the config file.*/);
            });
        });
        describe('When config file is NOT valid', () => {
            it('Should throw exception "Not valid file"', () => {
                //given
                process.env.CONFIG_DIR = path.resolve(basePath, 'config.json');
                //then
                expect(require.bind(null, '../../../src/lib/Config')).to.throw(Error, /Not valid file.*/);
            });
        });
        describe('When imports file NOT exist', () => {
            it('Should throw exception "There was an error reading the config file"', () => {
                //given
                process.env.CONFIG_DIR = path.resolve(basePath, 'service_bundles.json');
                //then
                expect(require.bind(null, '../../../src/lib/Config')).to.throw(Error, /There was an error reading the config file.*/);
            });
        });
        describe('When imports config file NOT valid', () => {
            it('Should throw exception "Not valid file"', () => {
                //given
                process.env.CONFIG_DIR = path.resolve(basePath, 'load_not_valid.json');
                //then
                expect(require.bind(null, '../../../src/lib/Config')).to.throw(Error, /Not valid file.*/);
            });
        });
    });
    describe('Tests loaders and parsers', () => {
        let basePath = path.resolve(__dirname, '..', '..', 'fixtures');
        it('Should import file yml file', () => {
            //given
            process.env.CONFIG_DIR = path.resolve(basePath, 'yml', 'config.prod.json');
            //when
            const config = require('../../../src/lib/Config').default;
            let all = config.all();
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
            process.env.CONFIG_DIR = path.resolve(basePath, 'ini', 'config.prod.json');
            invalidRequireCache(path.resolve(__dirname, '..', '..', '..', 'src', 'lib', 'Config.js'));
            //when
            const config = require('../../../src/lib/Config').default;
            let all = config.all();
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
        let basePath = path.resolve(__dirname, '..', '..', 'fixtures'), config;
        before(() => {
            invalidRequireCache(path.resolve(__dirname, '..', '..', '..', 'src', 'lib', 'Config.js'));
            process.env.CONFIG_DIR = path.resolve(basePath, 'methods', 'config.prod.json');
            config = require('../../../src/lib/Config').default;
        });
        it('Should import file form root config', () => {
            // when
            let all = config.all();
            // then
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
            //when
            let all = config.all();
            // //then
            expect(() => {
                all.newParam = 'someValue';
            }).to.throw(Error, /Can't add property newParam, object is not extensible.*/);
        });
    });
    describe('Tests "get" method', () => {
        let config;
        let basePath = path.resolve(__dirname, '..', '..', 'fixtures');
        before(() => {
            invalidRequireCache(path.resolve(__dirname, '..', '..', '..', 'src', 'lib', 'Config.js'));
            process.env.CONFIG_DIR = path.resolve(basePath, 'methods', 'config.prod.json');
            config = require('../../../src/lib/Config').default;
        });
        it('Should get property', () => {
            //when
            let mailerClass = config.get('services.mailer.class');
            //then
            expect(mailerClass).to.equal("Mailer");
        });
        it('Should throw exception when there is no property in the configuration', () => {
            //then
            expect(config.get.bind(config, 'services.non.exist.parameter'))
                .to.throw(Error, /Configuration property.*is not defined/);
        });
        it('Should throw exception when someone try modify config properties', () => {
            let services = config.get('services');
            //then
            expect(() => {
                services.newParam = 'someValue';
            }).to.throw(Error, /Can't add property newParam, object is not extensible.*/);
        });
    });
});
