const Client = require('../model/Client')
const ClientSignalParameters = require('../model/ClientSignalParameters')
const ClientSignalPassthrough = require('../model/ClientSignalPassthrough')
const ClientRequest = require('../model/ClientRequest')
const SignalistRequest = require('../model/SignalistRequest')
const uuidv4 = require('uuid/v4')

/** 
 * @param {Client} client
 * @param {SignalistRequest} request
 * @returns {ClientRequest} 
 */
function processSignalistRequestPerClient(client, request) {
    const clientRequest = new ClientRequest()
    try {
        clientRequest._id = uuidv4()
        clientRequest.signalId = request._id
        clientRequest.signalistId = request.signalistId
        clientRequest.subscriberId = client._id
        clientRequest.clientSignal = new ClientRequest()
        clientRequest.clientSignal.price = client.amount
        clientRequest.clientSignal.parameters = new ClientSignalParameters()
        clientRequest.clientSignal.parameters.amount = client.amount
        clientRequest.clientSignal.parameters.contract_type = request.signal.callput
        clientRequest.clientSignal.parameters.currency = client.currency
        if (request.signal.date_expiry) {
            clientRequest.clientSignal.parameters.date_expiry = request.signal.date_expiry
        }
        else {
            clientRequest.clientSignal.parameters.duration = request.signal.duration
            clientRequest.clientSignal.parameters.duration_unit = request.signal.duration_unit
        }
        clientRequest.clientSignal.parameters.symbol = 'frx' + request.signal.symbol
        clientRequest.clientSignal.passthrough = new ClientSignalPassthrough()
        clientRequest.clientSignal.passthrough.clientSignalId = clientRequest._id
    }
    catch (error) {
        clientRequest.error = error
    }
    return clientRequest
}

module.exports = processSignalistRequestPerClient