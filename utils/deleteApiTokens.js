const WebSocket = require('ws')

const ApiTokenDetails = require('../dto/apiTokenDetails'),
ApiTokenRequest = require('../dto/apiTokenRequest'),
ApiTokenPassthrough = require('../dto/apiTokenPassthrough'),
ApiTokenResponse = require('../dto/apiTokenResponse'),
AuthorizeRequest = require('../dto/authorizeRequest'),
AuthorizeResponse = require('../dto/authorizeResponse'),
ApiTokenListRequest = require('../dto/apiTokenListRequest'),
ApiTokenDeleteRequest = require('../dto/apiTokenDeleteRequest')

const WebSocketHelper = require('./wsHelpers')

/**
 * @description connect to Binary Api via admin token and delete tokens from list
 * @param {String} wsurl web socket url
 * @param {String} admin admin token
 * @param {String[]} tokens tokens to delete
 * @returns {ApiTokenDetails[]} collection of tokens
 */
async function DeleteApiTokens(wsurl, admin, tokens) {
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

    for (let index = 0; index < tokens.length; index++) {
        const request = new ApiTokenDeleteRequest(tokens[index])
        const response = await WebSocketHelper.send(ws, request)
        if (response.error) {
            throw new Error(`${response.error.code} ${response.error.message}`)
        }
        if (response.msg_type != 'api_token') {
            throw new Error(`Unexpected msg_type, expected api_token but ${response.msg_type} found`)
        }
    }
}

// DeleteApiTokens('wss://ws.binaryws.com/websockets/v3?app_id=1', 'jU9vvzkUurCeVfx', ['0EGIBRZQllR0mbl', 'E4rgXHC87iUS45k', 'Po8rlWBVYskIPyI'])

module.exports = DeleteApiTokens