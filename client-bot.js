const dgram = require('dgram');
const config = require('./config.js').client;
var dbo = require('./dbo.js');

const process = function (message, client, remote) {

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