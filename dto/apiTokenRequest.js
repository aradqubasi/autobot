const ApiTokenPassthrough = require('./apiTokenPassthrough')

class ApiTokenRequest {
    /**
     * @param {String} tokenName 
     * @param {String[]} scopes 
     */
    constructor(tokenName, scopes) {
        /** @type {Number} */
        this.api_token = 1
        /** @type {String} */
        this.new_token = tokenName
        /** @type {String[]} */
        this.new_token_scopes = scopes
        /** @type {ApiTokenPassthrough} */
        this.passthrough = new ApiTokenPassthrough(tokenName)
    }
}

module.exports = ApiTokenRequest