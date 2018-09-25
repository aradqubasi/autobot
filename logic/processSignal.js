const Signalist = require('../model/Signalist')
const SignalistRequest = require('../model/SignalistRequest')
const uuidv4 = require('uuid/v4')

/** 
 * @param {Map<String,Signalist>} [signalists] signalists by login
 * @param {Buffer} [buffer] buffer object containing signal
 * @returns {SignalistRequest} 
 */
function processSignal(signalists, buffer) {
    const signalistRequest = new SignalistRequest()
    try {
        signalistRequest.received = Date.now()
        signalistRequest._id = uuidv4()
        signalistRequest.message = buffer
        signalistRequest.message = JSON.parse(buffer)

        signalistRequest.signal = new Signal()
        signalistRequest.signal.logints = signalistRequest.message.logints
        signalistRequest.signal.callput = signalistRequest.message.callput
        signalistRequest.signal.date_expiry = signalistRequest.message.date_expiry
        signalistRequest.signal.martin = signalistRequest.message.martin
        signalistRequest.signal.notify_type = signalistRequest.message.notify_type
        signalistRequest.signal.passts = signalistRequest.message.passts
        signalistRequest.signal.symbol = signalistRequest.message.symbol
        signalistRequest.signal.tfdigi = signalistRequest.message.tfdigi
        signalistRequest.signal.tfdur = signalistRequest.message.tfdur

        const signalist = signalists.get(signalistRequest.signal.logints)
        
        if (signalist && signalist.password == signalistRequest.signal.passts) {
            //proceed
            signalistRequest.signalistId = signalist._id
        }
        else {
            throw new Error('invalid credentials');
        }
    }
    catch (error) {
        signalistRequest.error = error
    }
    return signalistRequest
}

module.exports = processSignal