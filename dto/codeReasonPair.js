class CodeReasonPair {
    /**
     * @description tuple to hold error and close reasons
     * @param {Number} code 
     * @param {String} reason 
     */
    constructor(code, reason) {
        /** @type {Number} */
        this.code = code
        /** @type {String} */
        this.reason = reason
    }
}

module.exports = CodeReasonPair