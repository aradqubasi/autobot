const dgram = require('dgram');
const config = require('./config.js').client;
const uuidv4 = require('uuid/v4');
const WebSocketAdapter = require('./web-socket-adapter.js');
const MongoDbaAdapter = require('./mongo-dba-adapter.js');
const Cache = require('./cache.js');
const dbUrl = require('./config.js').db.url;
var wsClients = [];
var last = -1;

const cache = new Cache();
const dba = new MongoDbaAdapter();
dba.open(dbUrl);
const process = function (message) {
    const clientRequest = {
        messageId : uuidv4(),
        receivedOn : Date.now(),
        parsedOn : 0,
        finishedOn : 0,
        clientId : '',
        processingError : {},
        inboundMessage : message,
        outboundMessage : {}
    }

    try {
        //transform
        clientRequest.inboundMessage = JSON.parse(message);
        const currency = cache.currency;
        const symbol = 'frx' + clientRequest.inboundMessage.symbol;
        clientRequest.outboundMessage = {
            buy: 1,
            parameters: {
                basis: 'stake',
                contract_type: clientRequest.inboundMessage.callput,
                currency: currency,
                symbol: symbol
            },
            passthrough: {
                signalistId: clientRequest.inboundMessage.signalistId,
                signalId: clientRequest.inboundMessage.signalId,
                botId: cache.botId,
                receivedByAutobotOn: clientRequest.inboundMessage.receivedOn
            }
        }

        if (clientRequest.inboundMessage.date_expiry) {
            clientRequest.outboundMessage.parameters.date_expiry = clientRequest.inboundMessage.date_expiry
        }
        else {
            clientRequest.outboundMessage.parameters.duration = clientRequest.inboundMessage.tfdigi;
            clientRequest.outboundMessage.parameters.duration_unit = clientRequest.inboundMessage.tfdur;
        }

        if (clientRequest.inboundMessage.martin == 0) {
            clientRequest.outboundMessage.parameters.amount= cache.lot;
            clientRequest.outboundMessage.price = cache.lot;
        }
        else {
            clientRequest.outboundMessage.parameters.amount= cache.lot * martin;
            clientRequest.outboundMessage.price = cache.lot * martin;
        }
        
        clientRequest.parsedOn = Date.now();
        clientRequest.outboundMessage.passthrough.sentToBinaryOn = clientRequest.parsedOn;
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
                    wsClient.buy(clientRequest.outboundMessage);
                    break;
                }
            }
        }
        //end
    }
    catch (error) { 
        clientRequest.processingError = error;
    }
    dba.insertClientRequest(clientRequest)
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
    wsClient.onBinaryResponce(binaryResponse => { dba.insertBinaryResponse(binaryResponse) })
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