const dgram = require('dgram');
const config = require('./config.js').client;
const uuidv4 = require('uuid/v4');
const WebSocketAdapter = require('./web-socket-adapter.js');
var dba = require('./dba.js');
const Cache = require('./cache.js');
var wsClients = [];
var last = -1;

const cache = new Cache();

const process = function (message) {
    var messageId = uuidv4();
    var receivedOn = Date.now();
    var parsedOn = 0;
    var finishedOn = 0;
    var clientId = '';
    var processingError = {};
    var inboundMessage = message;
    var outboundMessage = {};
    try {
        //transform
        inboundMessage = JSON.parse(message);
        const currency = cache.currency;
        const symbol = 'frx' + inboundMessage.symbol;
        outboundMessage = {
            buy: 1,
            parameters: {
                basis: 'stake',
                contract_type: inboundMessage.callput,
                currency: currency,
                symbol: symbol
            },
            passthrough: {
                signalistId: inboundMessage.signalistId,
                signalId: inboundMessage.signalId,
                botId: cache.botId
            }
        }

        if (inboundMessage.date_expiry) {
            outboundMessage.parameters.date_expiry = inboundMessage.date_expiry
        }
        else {
            outboundMessage.parameters.duration = inboundMessage.tfdigi;
            outboundMessage.parameters.duration_unit = inboundMessage.tfdur;
        }

        if (inboundMessage.martin == 0) {
            outboundMessage.parameters.amount= cache.lot;
            outboundMessage.price = cache.lot;
        }
        else {
            outboundMessage.parameters.amount= cache.lot * martin;
            outboundMessage.price = cache.lot * martin;
        }
        
        parsedOn = Date.now();
        //send data to binary
        if (wsClients.length == 0) {
            console.log('Socket list is empty!');
        }
        else {
            var next = last;
            for (var index = 1; index <= wsClients.length; index++) {
                next++;
                if (next >= wsClients.length) {
                    next = 0;
                }
                const wsClient = wsClients[next];
                if (wsClient.isAlive && wsClient.isAuthorized) {
                    last = next;
                    wsClient.buy(outboundMessage);
                    break;
                }
            }
        }
        //end
    }
    catch (error) { 
        processingError = error;
    }
    //dba.outbound.inserOne();
};

const client = dgram.createSocket({type: 'udp4', reuseAddr: true});
client.on('error', (err) => {
    console.log(`client ${config.user} error:\n${err.stack}`);
});
client.on('message', (message, remote) => {
    // console.log(`client ${config.user} got: ${message} from ${remote.address}:${remote.port}`);
    process(message);
});
client.on('listening', () => {
    const address = client.address();
    console.log(`client ${config.user} listening ${address.address}:${address.port}`);
});
client.bind(config.broadcast.port, config.broadcast.address, () => {});

for (var index = 0; index < config.count; index++) {
    const wsClient = new WebSocketAdapter(config.url, cache.token);
    wsClient.open();
    wsClients.push(wsClient);
    // setTimeout(() => {wsClient.buy('CALL', 'USD', 'frxEURUSD', 44.95, 5, 'm', 759)}, 5000);
    // setTimeout(() => {wsClient.close()}, 15000);
}

// setTimeout(() => {process('1', '', '')}, 1000);
// setTimeout(() => {process('2', '', '')}, 1000);
// setTimeout(() => {process('3', '', '')}, 1000);
// setTimeout(() => {process('4', '', '')}, 1000);
// setTimeout(() => {process('5', '', '')}, 1000);
// setTimeout(() => {process('6', '', '')}, 1000);
// setTimeout(() => {process('7', '', '')}, 1000);
// setTimeout(() => {process('8', '', '')}, 1000);
// setTimeout(() => {process('9', '', '')}, 1000);
// setTimeout(() => {process('10', '', '')}, 1000);
// setTimeout(() => {process('11', '', '')}, 1000);
// setTimeout(() => {process('12', '', '')}, 1000);
// setTimeout(() => {process('13', '', '')}, 1000);
// setTimeout(() => {process('14', '', '')}, 1000);
// setTimeout(() => {process('15', '', '')}, 1000);
// setTimeout(() => {process('16', '', '')}, 1000);
// setTimeout(() => {process('17', '', '')}, 1000);
// setTimeout(() => {process('18', '', '')}, 1000);
// setTimeout(() => {process('19', '', '')}, 1000);
// setTimeout(() => {process('20', '', '')}, 1000);