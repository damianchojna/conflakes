'use strict';
const expect = require('chai').expect;
import * as path from 'path';
import {FileLoaderImportCircularReferenceError} from "../../src/Error/FileLoaderImportCircularReferenceError";
import {FileLoaderLoadError} from "../../src/Error/FileLoaderLoadError";

describe('Config module', () => {
    var config: Object;
    beforeEach(function () {
        delete require.cache[require.resolve(path.join('..', '..', 'src', 'module'))];
        let ConfigModule = require(path.join('..', '..', 'src', 'module'));
        config = new ConfigModule();
    });

    describe('Check types', () => {
        var jsonTypes = {
            types: {
                "true": true,
                "false": false,
                "null": null,
                "string": "STRING",
                "Int_12": 12,
                "Int_12_minus": -12,
                "string_12": "12",
                "int_0": 0,
                "int_1": 1,
                "octal_code": "0b0110",
                "string_comma": "1111,2222,3333,4444,5555",
                "array": [1111, 2222, 3333, 4444, 5555],
                "Hex_255": "0xFF",
                "Float": "-10100.1",
                "Float_E": "-1.2E2"
            }
        }

        var iniTypes = {
            types: {
                "11112222333344445555": "1111,2222,3333,4444,5555",
                "constant": "PHP_VERSION",
                "false": false,
                "no": "no",
                "none": "none",
                "off": "off",
                "on": "on",
                "true": true,
                "yes": "yes",
            }
        };

        var ymlTypes = {
            types: {
                regexp: /pattern/gim
            }
        };

        it('Check types from json', () => {
            config.load(__dirname + '/../../../tests/Fixtures/types/json/types.json');
            expect(config.getConfig().all()).to.deep.equal(jsonTypes);
        });

        it('Check types from ini', () => {
            config.load(__dirname + '/../../../tests/Fixtures/types/ini/types.ini');
            expect(config.getConfig().all()).to.deep.equal(iniTypes);
        });

        it('Check types from yml', () => {
            config.load(__dirname + '/../../../tests/Fixtures/types/yaml/types.yml');
            expect(config.getConfig().all()).to.deep.equal(ymlTypes);
        });
    });

    describe('Transform to Singleton', () => {
        it('Should return previus config from require', () => {
            let configBag = config.load(__dirname + '/../../../tests/Fixtures/schema/mixed_semantic_config/environments/dev.json').transformToSingleton();

            let singletonConfigBag = require(path.join('..', '..', 'src', 'module'));

            expect(configBag === singletonConfigBag).to.equal(true);
            expect(configBag.all()).to.deep.equal(singletonConfigBag.all());
        });
    });

    describe('Check Importing files', () => {
        var semanticDevConfig = {
            dbs: {
                master: {
                    name: 'hbq_db_master',
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    port: '3306'
                },
                slave: {
                    name: 'hbq_db_slave',
                    host: 'localhost',
                    user: 'root',
                    password: '',
                    port: '3306'
                },
                slave2: {
                    name: "hbq_db"
                }
            },
            routing: {
                homage: {
                    path: '/homepage',
                    defaults: {
                        _controller: "App/Default",
                        _format: "json"
                    }
                },
                article_show: {
                    path: '/articles/{_locale}/{year}/{slug}.{_format}',
                    defaults: {
                        _controller: "AppBundle:Article:show",
                        _format: "html"
                    },
                    requirements: {
                        _format: "html|rss",
                        _locale: "en|fr",
                        year: '\\d+'
                    }
                }
            },
            utils: {
                max_items_per_page: "10",
                default_items_order: "custom_order"
            },
            security: {
                firewalls: {
                    main: {
                        form_login: {
                            login_path: 'login',
                            check_path: 'login'

                        }
                    }
                },
                blacklist: [
                    "192.168.0.110",
                    "192.168.0.120",
                    "192.168.0.130"
                ]
            }
        };

        it('Should import semantic mixed format config', () => {
            config.load(__dirname + '/../../../tests/Fixtures/schema/mixed_semantic_config/environments/dev.json');
            expect(config.getConfig().all()).to.deep.equal(semanticDevConfig);
        });

        it('Should import semantic json format config', () => {
            config.load(__dirname + '/../../../tests/Fixtures/schema/json_semantic_config/environments/dev.json');
            expect(config.getConfig().all()).to.deep.equal(semanticDevConfig);
        });

        it('Should import semantic yml format config', () => {
            config.load(__dirname + '/../../../tests/Fixtures/schema/yml_semantic_config/environments/dev.yml');
            expect(config.getConfig().all()).to.deep.equal(semanticDevConfig);
        });

        it('Should trow FileLoaderImportCircularReferenceError', () => {
            expect(() => {
                config.load(__dirname + '/../../../tests/Fixtures/bad_schema/circular_reference/main.json');
            }).to.throw(FileLoaderImportCircularReferenceError);
        });

        it('Should trow FileLoaderLoadError when user import non exist file', () => {
            expect(() => {
                config.load(__dirname + '/../../../tests/Fixtures/bad_schema/not_found_import_file/main.json');
            }).to.throw(FileLoaderLoadError, /Cannot import:/);
        });

        it('Should trow FileLoaderLoadError when user load non exist file', () => {
            expect(() => {
                config.load(__dirname + '/../../../tests/Fixtures/bad_schema/not_exist_file/main.json');
            }).to.throw(Error, /no such file or directory/);
        });
    });

    describe('ParameterBag "get" method', () => {
        it('Should get property', () => {
            config.load(__dirname + '/../../../tests/Fixtures/schema/mixed_semantic_config/environments/dev.json');
            expect(config.getConfig().get('dbs.master.name')).to.equal('hbq_db_master');
            expect(config.getConfig().get('security.blacklist[2]')).to.equal('192.168.0.130');
        });
        it('Should throw exception when there is no property in the configuration', () => {
            expect(() => {
                config.getConfig().get('services.non.exist.parameter');
            }).to.throw(Error, /Configuration property.*is not defined/);
        });
        it('Should throw exception when someone try modify config properties', () => {
            //when
            config.load(__dirname + '/../../../tests/Fixtures/schema/mixed_semantic_config/environments/dev.json');
            var dbsMaster = config.getConfig().get('dbs.master');
            //then
            expect(() => {
                dbsMaster.newParam = 'someValue';
            }).to.throw(Error, /Can't add property newParam, object is not extensible.*/);
        });
    });

    describe('ParameterBag "all" method', () => {
        it('Should return correct object', () => {
            var configSchema = {
                utils: {
                    max_items_per_page: 10,
                    default_items_order: null
                },
                security: {
                    firewalls: {
                        main: {
                            form_login: {
                                login_path: 'login'
                            }
                        }
                    }
                }
            };
            config.load(configSchema);
            expect(config.getConfig().all()).to.deep.equal(configSchema);
        });
    });
});
