const ApiTokensDetails = require('./dto/apiTokenDetails'),
DeleteApiTokens = require('./utils/deleteApiTokens'),
GenerateApiTokens = require('./utils/generateApiTokens'),
GetApiTokens = require('./utils/getApiTokens');


// DeleteApiTokens('wss://ws.binaryws.com/websockets/v3?app_id=1', 'jU9vvzkUurCeVfx', ['0EGIBRZQllR0mbl', 'E4rgXHC87iUS45k', 'Po8rlWBVYskIPyI'])
// generateApiTokens('wss://ws.binaryws.com/websockets/v3?app_id=1', 'jU9vvzkUurCeVfx', '200spartans', ['trade'], 200)
// getApiTokens('wss://ws.binaryws.com/websockets/v3?app_id=1', 'jU9vvzkUurCeVfx')

(async () => {
    (await GetApiTokens('wss://ws.binaryws.com/websockets/v3?app_id=1', 'jU9vvzkUurCeVfx'))
    .forEach(token => {
        console.debug(token)
    })
})()
