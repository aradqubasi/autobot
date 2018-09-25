const WebSocket = require('ws')

const ApiTokenDetails = require('../dto/apiTokenDetails'),
ApiTokenRequest = require('../dto/apiTokenRequest'),
ApiTokenPassthrough = require('../dto/apiTokenPassthrough'),
ApiTokenResponse = require('../dto/apiTokenResponse')

const Helper = require('./wsHelpers')

/**
 * @description calls Binary API and create a specified number of toens with scope
 * @param {String} wsurl 
 * @param {String} admin 
 * @param {String} prefix
 * @param {String[]} scopes
 * @param {Number} count 
 * @returns {Promise<String[]>}
 */
async function GenerateApiTokens(wsurl, admin, prefix, scopes, count) {

    /** @type {String[]} */
    var tokens = []

    const ws = new WebSocket(wsurl)
    await Helper.open(ws)
    await Helper.send(ws, { authorize: admin })

    var genereted = 0
    while (genereted < count) {
        /** @type {ApiTokenRequest} */
        const request = new ApiTokenRequest(`${prefix}${genereted}`, ['trade'])
        /** @type {ApiTokenResponse} */
        const response = await Helper.send(ws, request)
        if (response && response.error == null && response.msg_type == 'api_token') {
            genereted++
        }
        else if (response && response.error && response.error.code == 'RateLimit') {
            await Helper.wait()
        }
        else {
            // console.debug(request)
            // console.debug(response)
            // process.exit()
        }
    }
}

// generateApiTokens('wss://ws.binaryws.com/websockets/v3?app_id=1', 'jU9vvzkUurCeVfx', '200spartans', ['trade'], 200)

module.exports = GenerateApiTokens