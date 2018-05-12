const dgram = require('dgram');
var servers = [];
const config = require('./config.js');
var dbo = require('./dbo.js');

const process = function (message, server, remote) {
  console.log(`processing ${message} from ${remote.address}:${remote.port}`);
  dbo.instance.collection('inbound').insertOne({"request":JSON.parse(message)}, (error, result) => {
      if (error) {
        console.log(error);
      }
      else {
        console.debug(result);
      }
    });
  
};

config.app.ports.forEach(function(port) {

  const server = dgram.createSocket('udp4');

  server.on('error', (err) => {
    console.log(`server ${port} error:\n${err.stack}`);
    server.close();
  });

  server.on('message', (message, remote) => {
    console.log(`server ${port} got: ${message} from ${remote.address}:${remote.port}`);
    process(message, server, remote);
  });

  server.on('listening', () => {
    const address = server.address();
    console.log(`server ${port} listening ${address.address}:${address.port}`);
  });
  
  server.bind(port); 

  servers.push(server);

}, this);