"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yaml = require('js-yaml');
const _ = require('lodash');
var GlobalVariableType = new yaml.Type('tag:yaml.org,2002:js/variable', {
    kind: 'scalar',
    construct: function (path) {
        return _.get(typeof window !== 'undefined' ? window : global, path);
    },
});
var GlobalVariableSchema = yaml.Schema.create([GlobalVariableType]);
exports.default = GlobalVariableSchema;
//# sourceMappingURL=GlobalVariableType.js.map