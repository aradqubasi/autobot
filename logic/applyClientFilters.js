const Time = require('../model/Time')
const Minute = require('../model/Minute')
const HourInterval = require('../model/HourInterval')
const InHourInterval = require('../model/InHourInterval')
const Filter = require('../model/Filter')

/**
 * @param {Filter[]} filters - client filters
 * @param {String} signalistId - id of signalist who have emitted signal
 * @param {String} timeframe - timeframe
 * @param {Date} now - signal date
 * @returns {Boolean} - true if signal passed through filters
 */
function applyClientFilters(filters, signalistId, symbol, timeframe, now) { 
    const day = now.getDay()
    const inHourSeconds = now.getMinutes() * 60 + now.getSeconds()
    const hourSeconds = now.getHours() * 3600 + hourSeconds
    /**
     * @description check whether specified value is in range
     * @param {Number} value value in seconds
     * @param {Number} begin begin of interval in seconds
     * @param {Number} end end of interval ion seconds
     * @returns {Boolean} true if in range
     */
    const compareSecondsIntervals = function (value, begin, end) {
        if (end > begin) {
            return value >= begin && value <= end
        }
        else {
            return false
        }
        // else {
        //     return value >= begin || value <= end
        // }
    }
    for (var index = 0; index < filters.length; index++) {
        var filter = filters[index]
        const bySignalist = filter.signalistId == signalistId || filter.signalistId == null
        const bySymbol = filter.symbol == symbol || filter.symbol == null
        const byTimeframe = filter.timeframe == timeframe || filter.timeframe == null
        const byDay = filter.day == day || filter.day == null
        var byHour = true
        if (filter.hour && filter.hour.begin && filter.hour.begin && filter.hour.end) {
            byHour = compareSecondsIntervals(hourSeconds, filter.hour.begin.getSeconds(), filter.hour.end.getSeconds())
        }
        const byInHour = true
        if (filter.inHour && filter.inHour.begin && filter.inHour.begin && filter.inHour.end) {
            byInHour = compareSecondsIntervals(inHourSeconds, filter.inHour.begin.getSeconds(), filter.inHour.end.getSeconds())
        }
        if (bySignalist && bySymbol && byTimeframe && byDay && byHour && byInHour) {
            // logger.info(`applyClientFilters, filtered out by - filterId: ${filter._id || 'none'} - signalistId: ${signalistId}, symbol: ${symbol}, timeframe: ${timeframe}, now: ${now}`)
            return false
        }
    }
    // logger.info(`applyClientFilters, passthrougn - signalistId: ${signalistId}, symbol: ${symbol}, timeframe: ${timeframe}, now: ${now}`)
    return true
}

module.exports = applyClientFilters