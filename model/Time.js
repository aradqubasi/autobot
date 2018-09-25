class Time {
    /**
     * @param {Number} hours 
     * @param {Number} minutes 
     * @param {Number} seconds 
     */
    constructor(hours, minutes, seconds) {
        /** @type {Number} */
        this.hours = hours || 0
        /** @type {Number} */
        this.minutes = minutes || 0
        /** @type {Number} */
        this.seconds = seconds || 0
    }
    /**
    * @returns {Number} total seconds
    */
    getSeconds() {
        return this.hours * 3600 + this.minutes * 60 + this.seconds
    }
}

module.exports = Time