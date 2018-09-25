const ClientSignalParameters = require('./ClientSignalParameters.js')
const ClientSignalPassthrough = require('./ClientSignalPassthrough.js')

class ClientSignal {
    constructor() {
        /** @type {Number} */
        this.buy = 1
        /** @type {Number} */
        this.price = 0
        /** @type {ClientSignalParameters} */
        this.parameters = undefined
        /** @type {ClientSignalPassthrough} */
        this.passthrough = undefined
    }
}

module.exports = ClientSignal