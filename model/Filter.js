const HourInterval = require('./HourInterval')
const InHourInterval = require('./InHourInterval')

class Filter {
    constructor() {
        /** @type {String} */
        this._id = ''
        /** @type {?String} */
        this.signalistId = undefined
        /** @type {?String} */
        this.symbol = undefined
        /** @type {?String} */
        this.timeframe = undefined
        /** @type {?Number} */
        this.day = undefined
        /** @type {?HourInterval} */
        this.hour = undefined
        /** @type {?InHourInterval} */
        this.inHour = undefined
    }
}

module.exports = Filter