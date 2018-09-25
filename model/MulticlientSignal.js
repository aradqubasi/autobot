const ClientSignalParameters = require('./ClientSignalParameters.js')
const MulticlientSignalPassthrough = require('./MulticlientSignalPassthrough.js')

class MulticlientSignal {
    constructor() {
        /** @type {Number} */
        this.buy_contract_for_multiple_accounts = 1
        /** @type {Number} */
        this.price = 0
        /** @type {String[]} */
        this.tokens = []
        /** @type {ClientSignalParameters} */
        this.parameters = undefined
        /** @type {MulticlientSignalPassthrough} */
        this.passthrough = undefined
    }
}

module.exports = MulticlientSignal