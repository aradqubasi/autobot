const dgram = require('dgram');
const config = require('./config.js').reception;
const db = require('./config.js').db
const uuidv4 = require('uuid/v4');
const Cache = require('./cache.js');
// var dba = require('./dba.js');
var UdpServerAdapter = require('./udp-server-adapter.js');
const MongoDbaAdapter = require('./mongo-dba-adapter.js')

const server = new UdpServerAdapter();
const cache = new Cache();
const dba = new MongoDbaAdapter();
dba.open(db.url);
const client = dgram.createSocket('udp4');
client.bind(() => {
    client.setBroadcast(true);
});
// client.setBroadcast(true);

const process = async function (message) {
    const signal = {
        receivedOn : Date.now(),
        signalId : uuidv4(),
        parsedOn : 0,
        finishedOn : 0,
        signalistId : '',
        processError : {},
        inboundMessage : message,
        outboundMessage : {}
    }
    try {
        signal.outboundMessage = JSON.parse(message);
        const signalist = cache.signalists[signal.outboundMessage.logints];
        if (signalist && signalist.password == signal.outboundMessage.passts) {
            signal.outboundMessage.signalistId = signalist.id;
            signal.outboundMessage.signalId = signal.signalId;
            signal.outboundMessage.receivedOn = signal.receivedOn;
            const datagram = Buffer.from(JSON.stringify(signal.outboundMessage));
            const address = config.broadcast.address;
            const port = config.broadcast.port;
            signal.parsedOn = Date.now();
            client.send(datagram, port, address, (error) => { 
                if (error) {console.log(error);}
            });
        }
        else {
            throw new Error('invalid credentials');
        }
    } catch (error) {
        signal.processError = error;
    }
    console.debug(signal)
    dba.insertSignal(signal)
};

server.onMessage((message) => {
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