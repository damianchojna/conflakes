const yaml = require('js-yaml');
const _    = require('lodash');

var GlobalVariableType = new yaml.Type('tag:yaml.org,2002:js/var', {
    kind: 'scalar',
    construct: function (path) {
        return _.clone(_.get(global, path));
    },
});

var GlobalVariableSchema = yaml.Schema.create([ GlobalVariableType ]);


export default GlobalVariableSchema;