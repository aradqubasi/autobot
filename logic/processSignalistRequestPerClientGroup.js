const ClientGroup = require('../model/ClientGroup')
const SignalistRequest = require('../model/SignalistRequest')
const MulticlientRequest = require('../model/MulticlientRequest')
const MulticlientSignal = require('../model/MulticlientSignal')
const MulticlientSignalPassthrough = require('../model/MulticlientSignalPassthrough')
const ClientSignalParameters = require('../model/ClientSignalParameters')

/** 
 * @param {ClientGroup} clients
 * @param {SignalistRequest} request
 * @returns {MulticlientRequest} 
 */
function processSignalistRequestPerClientGroup(clients, request) {
    // logger.info(`Worker ${process.pid} processSignalistRequestPerClientGroup`)
    const multiclientRequest = new MulticlientRequest()
    try {
        multiclientRequest._id = uuidv4()
        multiclientRequest.signalId = request._id
        multiclientRequest.signalistId = request.signalistId
        multiclientRequest.clients = clients
        multiclientRequest.multiclientSignal = new MulticlientSignal()
        multiclientRequest.multiclientSignal.price = clients.amount
        clients.clients.forEach(client => {
            multiclientRequest.multiclientSignal.tokens.push(client.token)
        })
        multiclientRequest.multiclientSignal.parameters = new ClientSignalParameters()
        multiclientRequest.multiclientSignal.parameters.amount = clients.amount
        multiclientRequest.multiclientSignal.parameters.contract_type = request.signal.callput
        multiclientRequest.multiclientSignal.parameters.currency = clients.currency
        if (request.signal.date_expiry && request.signal.date_expiry != "") {
            multiclientRequest.multiclientSignal.parameters.date_expiry = request.signal.date_expiry
        }
        else {
            multiclientRequest.multiclientSignal.parameters.duration = request.signal.tfdigi
            multiclientRequest.multiclientSignal.parameters.duration_unit = request.signal.tfdur
        }
        multiclientRequest.multiclientSignal.parameters.symbol = 'frx' + request.signal.symbol
        multiclientRequest.multiclientSignal.passthrough = new MulticlientSignalPassthrough()
        multiclientRequest.multiclientSignal.passthrough.multiclientSignalId = multiclientRequest._id
    }
    catch (error) {
        multiclientRequest.error = error
    }
    return multiclientRequest
}

module.exports = processSignalistRequestPerClientGroup