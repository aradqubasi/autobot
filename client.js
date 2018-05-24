const WebSocket = require('ws');
var ws = new WebSocket('wss://ws.binaryws.com/websockets/v3?app_id=12869');

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', function(message) {
    message = message.trim();
    if (message == 'authorize') {
        const authorize = {
            authorize: 'eHlqUl1lXl1Efm5'
        };
        ws.send(JSON.stringify(authorize), (error) => { console.debug(error);});
        console.log(message);
    }
});

process.stdin.on('error', function(error) {
    console.log('stdin: an error occur');
    console.debug(error);
});

ws.on('open', function (socket) {
    console.log('ws: opened');
});

ws.on('error', function(error) {
    console.log('ws: an error occur');
    console.debug(error);
});

ws.on('message', function(message) {
    console.log('ws: message ' + message);
});

ws.on('close', function(code) {
    console.log('ws: disconnected ' + code);
});