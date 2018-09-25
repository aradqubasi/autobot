const ClientSignal = require('./ClientSignal')

class ClientRequest {
    constructor() {
        /** @type {String} */
        this._id = ''
        /** @type {Number} */
        this.requested = 0
        /** @type {String} */
        this.signalId = ''
        /** @type {String} */
        this.signalistId = ''
        /** @type {String} */
        this.subscriberId = ''
        /** @type {Error} */
        this.error = undefined
        /** @type {ClientSignal} */
        this.clientSignal = undefined
    }
}

module.exports = ClientRequest