const Client = require('./Client.js')

class ClientGroup {
    constructor() {
        /** @type {Number} */
        this.amount = 0
        /** @type {String} */
        this.currency = ''
        /** @type {Client[]} */
        this.clients = []
    }
}

module.exports = ClientGroup