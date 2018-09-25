class ProfitTable {
    constructor() {
        /** @type {String} */
        this.app_id = ''
        /** @type {String} */
        this.buy_price = ''
        /** @type {String} */
        this.contract_id = ''
        /** @type {String} */
        this.longcode = ''
        /** @type {String} */
        this.payout = ''
        /** @type {String} */
        this.purchase_time = ''
        /** @type {String} */
        this.sell_price = ''
        /** @type {String} */
        this.sell_time = ''
        /** @type {String} */
        this.shortcode = ''
        /** @type {String} */
        this.transaction_id = ''
    }
}
class ProfitTableWrap {
    constructor() {
        /** @type {String} */
        this._id = ''
        /** @type {String} */
        this.token = ''
        /** @type {ProfitTable} */
        this.profit_table = {}
    }
}