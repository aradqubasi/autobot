class ClientSignalParameters {
    constructor() {
        /** @type {String} */
        this.basis = 'stake'
        /** @type {String} */
        this.contract_type = ''
        /** @type {String} */
        this.currency = ''
        /** @type {String} */
        this.symbol = ''
        /** @type {Date} */
        this.date_expiry = undefined
        /** @type {Number} */
        this.duration = undefined
        /** @type {String} */
        this.duration_unit = undefined
        /** @type {Number} */
        this.amount = 0
    }
}

module.exports = ClientSignalParameters