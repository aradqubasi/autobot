const dgram = require('dgram');
const client2 = dgram.createSocket({type: 'udp4', reuseAddr: true});
client2.bind(40001, '0.0.0.0', () => {
    // client2.setBroadcast(true);
});
client2.on('message', (message) => {
    console.log(`got broadcasted message ${JSON.parse(message).debug.number}`);
})
client2.on('error', (error) => {
    console.log('got broadcaste error');
    console.debug(error);
})