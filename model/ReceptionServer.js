const Signalist = require('./Signalist.js')

class ReceptionServer {
    constructor () {
        /** @type {String} */
        this.name = ''
        /** @type {String[]} */
        this.signalistIds = []
        /** @type {Number[]} */
        this.ports = []
        /** @type {String[]} */
        this.serviceTokens = []
        /** @type {String} */
        this.urlOfBinary = ''
    }
}

module.exports = Signalist