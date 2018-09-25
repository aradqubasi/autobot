class AuthorizeRequest {
    /**
     * @param {String} token token to use for authrization
     */
    constructor (token) {
        /** @type {String} */
        this.authorize = token
    }
}

module.exports = AuthorizeRequest