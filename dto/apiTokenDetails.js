class ApiTokenDetails {
    constructor() {
        /** @type {String} */
        this.display_name = ''

        /** @type {String} */
        this.last_used = ''

        /** @type {String[]} */
        this.scopes = []

        /** @type {String} */
        this.token = ''

        /** @type {String} */
        this.valid_for_ip = ''
    }
}

module.exports = ApiTokenDetails