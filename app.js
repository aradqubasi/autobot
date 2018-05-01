const dgram = require('dgram');
var servers = [];
//const server = dgram.createSocket('udp4');
const config = require('./config.js');

config.app.ports.forEach(function(port) {

  const server = dgram.createSocket('udp4');

  server.on('error', (err) => {
    console.log(`server ${port} error:\n${err.stack}`);
    server.close();
  });

  server.on('message', (msg, rinfo) => {
    console.log(`server ${port} got: ${msg} from ${rinfo.address}:${rinfo.port}`);
  });

  server.on('listening', () => {
    const address = server.address();
    console.log(`server ${port} listening ${address.address}:${address.port}`);
  });
  
  server.bind(port); 

  servers.push(server);

}, this);