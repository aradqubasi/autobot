const ApiTokenDetails = require('./apiTokenDetails')
const ApiTokenRequest = require('./apiTokenRequest')
const ApiTokenPassthrough = require('./apiTokenPassthrough')

class ApiTokenResponse {
    constructor() {
        /** @type {String} */
        this.new_token = undefined
        /** @type {ApiTokenDetails[]} */
        this.tokens = undefined
        /** @type {ApiTokenRequest} */
        this.echo_req = undefined
        /** @type {String} */
        this.msg_type = 'api_token'
        /** @type {ApiTokenPassthrough} */
        this.passthrough = undefined
    }
}

module.exports = ApiTokenResponse