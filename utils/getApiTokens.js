const WebSocket = require('ws')

const ApiTokenDetails = require('../dto/apiTokenDetails'),
ApiTokenRequest = require('../dto/apiTokenRequest'),
ApiTokenPassthrough = require('../dto/apiTokenPassthrough'),
ApiTokenResponse = require('../dto/apiTokenResponse'),
AuthorizeRequest = require('../dto/authorizeRequest'),
AuthorizeResponse = require('../dto/authorizeResponse'),
ApiTokenListRequest = require('../dto/apiTokenListRequest')

const WebSocketHelper = require('./wsHelpers')

/**
 * @description connect to Binary Api via admin token and get list of all available tokens
 * @param {String} wsurl web socket url
 * @param {String} admin admin token
 * @returns {ApiTokenDetails[]} collection of tokens
 */
async function GetApiTokens(wsurl, admin) {
    const ws = new WebSocket(wsurl)


    await WebSocketHelper.open(ws)


    const authResponse = new AuthorizeResponse(await WebSocketHelper.send(ws, new AuthorizeRequest(admin)))
    if (authResponse.error) {
        throw new Error(`${authResponse.error.code} ${authResponse.error.message}`)
    }
    if (authResponse.msg_type != 'authorize') {
        throw new Error(`Unexpected msg_type, expected authorize but ${authResponse.msg_type} found`)
    }
    console.debug(authResponse)


    /** @type {ApiTokenResponse} */
    const listResponse = await WebSocketHelper.send(ws, new ApiTokenListRequest())
    console.debug(listResponse)
    for (let index = 0; index < listResponse.api_token.tokens.length; index++) {
        const detail = listResponse.api_token.tokens[index];
        // console.debug(detail)
    }

    return listResponse.api_token.tokens
}

module.exports = GetApiTokens
// getApiTokens('wss://ws.binaryws.com/websockets/v3?app_id=1', 'jU9vvzkUurCeVfx')