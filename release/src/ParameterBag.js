"use strict";
const _ = require("lodash");
class ParameterBag {
    constructor(params) {
        this.get = function (property, defaultParam) {
            if (!_.isString(property) || !property) {
                throw new Error("Parameter must be non empty string");
            }
            let value = _.get(this.parameters, property, defaultParam);
            if (!_.isUndefined(value)) {
                return value;
            }
            if (!_.isUndefined(defaultParam)) {
                return defaultParam;
            }
            throw new Error(`Configuration property "${property}" is not defined`);
        };
        this.has = function (property) {
            return _.has(this.parameters, property);
        };
        this.all = function () {
            return this.parameters;
        };
        this.parameters = params;
    }
}
exports.ParameterBag = ParameterBag;
//# sourceMappingURL=ParameterBag.js.map