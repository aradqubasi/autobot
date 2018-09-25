const Filter = require('./Filter')

class Client {
    constructor() {
        /** @type {String} */
        this._id = ''
        /** @type {String} */
        this.token = ''
        /** @type {String} */
        this.currency = ''
        /** @type {Number} */
        this.amount = 0
        /** @type {Filter[]} */
        this.filters = []
    }
}

module.exports = Client