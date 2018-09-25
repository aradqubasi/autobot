const Signal = require('./Signal.js')

class SignalistRequest {
    constructor() {
        /** @type {String} */
        this._id = ''
        /** @type {Date} */
        this.received = 0
        /** @type {Error} */
        this.error = undefined
        /** @type {String} */
        this.message = undefined
        /** @type {Signal} */
        this.signal = undefined
        /** @type {String} */
        this.signalistId = undefined
    }
}

module.exports = SignalistRequest