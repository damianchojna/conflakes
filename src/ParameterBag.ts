import * as _ from 'lodash';

export class ParameterBag {

    public constructor(params:Object) {
        var parameters = params;
    }

    public get = function(property: string, defaultParam?: any): any {
        if (!_.isString(property) || !property) {
            throw new Error("Parameter must be non empty string");
        }

        let value = _.get(parameters, property, defaultParam);

        if (!_.isUndefined(value)) {
            return value
        }

        if (!_.isUndefined(defaultParam)) {
            return defaultParam
        }

        throw new Error(`Configuration property "${property}" is not defined`);
    }

    public has = function(property: string): boolean {
        return _.has(parameters, property);
    };

    public all = function(): Object {
        return parameters;
    }
}