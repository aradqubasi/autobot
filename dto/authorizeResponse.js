const AuthorizeRequest = require('./authorizeRequest')

class AuthorizeResponse {
    /**
     * @param {Object|Buffer|String} [data] raw response from binary api or null
     */
    constructor(data) {
        /** @type {Object} */
        this.authorize = null
        /** @type {AuthorizeRequest} */
        this.echo_req = null
        /** @type {String} */
        this.msg_type = null
        /** @type {Object} */
        this.error = null

        if (data && data === Object(data)) {
            this.authorize = data.authorize
            this.echo_req = data.echo_req
            this.msg_type = data.msg_type
            this.error = data.error
        }
        else if (data) {
            const parsed = JSON.parse(data)
            this.authorize = parsed.authorize
            this.echo_req = parsed.echo_req
            this.msg_type = parsed.msg_type
            this.error = parsed.error
        }
    }
}

module.exports = AuthorizeResponse