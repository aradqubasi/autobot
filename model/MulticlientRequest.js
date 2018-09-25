const MulticlientSignal = require('./MulticlientSignal.js')
const ClientGroup = require('./ClientGroup.js')

class MulticlientRequest {
    constructor() {
        /** @type {String} */
        this._id = ''
        /** @type {Number} */
        this.requested = 0
        /** @type {String} */
        this.signalId = ''
        /** @type {String} */
        this.signalistId = ''
        /** @type {ClientGroup} */
        this.clients = undefined
        /** @type {Error} */
        this.error = undefined
        /** @type {MulticlientSignal} */
        this.multiclientSignal = undefined
    }
}

module.exports = MulticlientRequest