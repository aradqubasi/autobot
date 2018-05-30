const dgram = require('dgram');
const config = require('./config.js').reception;
const uuidv4 = require('uuid/v4');
const Cache = require('./cache.js');
// var dba = require('./dba.js');
var UdpServerAdapter = require('./udp-server-adapter.js');

const server = new UdpServerAdapter();
const cache = new Cache();
const client = dgram.createSocket('udp4');
client.bind(() => {
    client.setBroadcast(true);
});
// client.setBroadcast(true);

const process = async function (message) {
    var receivedOn = Date.now();
    var signalId = uuidv4();
    var parsedOn = 0;
    var finishedOn = 0;
    var signalistId = '';
    var processError = {};
    var inboundMessage = message;
    var outboundMessage = {};
    try {
        outboundMessage = JSON.parse(message);
        const signalist = cache.signalists[outboundMessage.logints];
        if (signalist && signalist.password == outboundMessage.passts) {
            outboundMessage.signalistId = signalist.id;
            outboundMessage.signalId = signalId;
            outboundMessage.receivedOn = receivedOn;
            const datagram = Buffer.from(JSON.stringify(outboundMessage));
            const address = config.broadcast.address;
            const port = config.broadcast.port;
            parsedOn = Date.now();
            client.send(datagram, port, address, (error) => { 
                if (error) {console.log(error);}
            });
        }
        else {
            throw new Error('invalid credentials');
        }
    } catch (error) {
        processError = error;
    }
    // finishedOn = Date.now();
    //console.debug(request);

    //dba.inbound.insertOne(request);
};

server.onMessage((message) => {
    // console.debug(JSON.parse(message).debug);
    process(message);
});
server.onError((error) => {
    console.log(`error!`);
    console.debug(error);
});


cache.ports.forEach(function(port) {
    server.open(port);
});
cache.onPortOpen((port) => { server.open(port); });
cache.onPortClose((port) => { server.close(port); });