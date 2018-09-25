const ApiTokenPassthrough = require('./apiTokenPassthrough')

class ApiTokenDeleteRequest {
    /**
     * @description DTO for delete token request
     * @param {String} token token to delete
     */
    constructor(token) {
        /** @type {Number} */
        this.api_token = 1
        /** @type {String} */
        this.delete_token = token
    }
}

module.exports = ApiTokenDeleteRequest