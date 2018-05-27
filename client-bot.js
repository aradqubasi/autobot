const dgram = require('dgram');
const config = require('./config.js').client;
const uuidv4 = require('uuid/v4');
const WebSocketAdapter = require('./web-socket-adapter.js');
var dba = require('./dba.js');
var wsClients = [];
var last = -1;

const process = function (message, client, remote) {
    try {

    }
    catch (error) { 
        
    }

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
                wsClient.buy('CALL', 'USD', 'frxEURUSD', 44.95, 5, 'm', message);
                return;
            }
        }
        
    }
};

const client = dgram.createSocket('udp4');

client.on('error', (err) => {
    console.log(`client ${config.user} error:\n${err.stack}`);
    server.close();
});

client.on('message', (message, remote) => {
    console.log(`client ${config.user} got: ${message} from ${remote.address}:${remote.port}`);
    process(message, client, remote);
});

client.on('listening', () => {
    const address = client.address();
    console.log(`client ${config.user} listening ${address.address}:${address.port}`);
});
  
client.bind(config.port);

for (var index = 0; index < config.count; index++) {
    const wsClient = new WebSocketAdapter(config.url, config.token);
    wsClient.open();
    wsClients.push(wsClient);
    // setTimeout(() => {wsClient.buy('CALL', 'USD', 'frxEURUSD', 44.95, 5, 'm', 759)}, 5000);
    // setTimeout(() => {wsClient.close()}, 15000);
}

setTimeout(() => {process('1', '', '')}, 1000);
setTimeout(() => {process('2', '', '')}, 1000);
setTimeout(() => {process('3', '', '')}, 1000);
setTimeout(() => {process('4', '', '')}, 1000);
setTimeout(() => {process('5', '', '')}, 1000);
setTimeout(() => {process('6', '', '')}, 1000);
setTimeout(() => {process('7', '', '')}, 1000);
setTimeout(() => {process('8', '', '')}, 1000);
setTimeout(() => {process('9', '', '')}, 1000);
setTimeout(() => {process('10', '', '')}, 1000);
setTimeout(() => {process('11', '', '')}, 1000);
setTimeout(() => {process('12', '', '')}, 1000);
setTimeout(() => {process('13', '', '')}, 1000);
setTimeout(() => {process('14', '', '')}, 1000);
setTimeout(() => {process('15', '', '')}, 1000);
setTimeout(() => {process('16', '', '')}, 1000);
setTimeout(() => {process('17', '', '')}, 1000);
setTimeout(() => {process('18', '', '')}, 1000);
setTimeout(() => {process('19', '', '')}, 1000);
setTimeout(() => {process('20', '', '')}, 1000);