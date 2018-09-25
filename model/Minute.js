class Minute {
    constructor() {
        /** @type {Number} */
        this.minutes = 0
        /** @type {Number} */
        this.seconds = 0
    }
    /**
    * @returns {Number} total seconds
    */
    getSeconds() {
        return this.minutes * 60 + this.seconds
    }
}

module.exports = Minute