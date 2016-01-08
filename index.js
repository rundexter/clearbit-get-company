var util = require('./util.js');
var request = require('request').defaults({
    baseUrl: 'https://company.clearbit.com/'
});

var pickInputs = {
        'domain': 'domain',
        'company_name': 'company_name',
        'twitter': 'twitter',
        'linkedin': 'linkedin',
        'facebook': 'facebook'
    },
    pickOutputs = {
        'id': 'id',
        'name': 'name',
        'legalName': 'legalName',
        'domain': 'domain',
        'tags': 'tags',
        'description': 'description',
        'location': 'location',
        'metrics': 'metrics'
    };

module.exports = {

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var inputs = util.pickInputs(step, pickInputs),
            validateErrors = util.checkValidateErrors(inputs, pickInputs),
            apiKey = dexter.environment('clearbit_api_key'),
            api = '/v2/companies/find';

        if (!apiKey)
            return this.fail('A [clearbit_api_key] environment variable is required for this module');

        if (validateErrors)
            return this.fail(validateErrors);

        request.get({uri: api, qs: inputs, auth: { user: apiKey, pass: '' }, json: true}, function (error, response, body) {
            if (error)
                this.fail(error);
            else if (body && body.error)
                this.fail(body.error);
            else
                this.complete(util.pickOutputs(body, pickOutputs));
        }.bind(this));
    }
};
