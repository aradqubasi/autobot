const dgram = require('dgram');
var servers = [];
const config = require('./config.js');
var dbo = require('./dbo.js');

const process = function (message, server, remote) {
    console.log(`processing ${message} from ${remote.address}:${remote.port}`);

    var request = { 
        body: JSON.parse(message)
    }

    dbo.signalists().findOne({user: request.logints}, function(error, result) {
        if (error) {
            console.log(error);
            request.result = 'error';
        }
        else if (!(result)) {
            console.log('signalist not found');
            request.result = 'signalist not found';
        }
        else if (result.passts != request.body.passts) {
            console.log(`password missmatch: ${result.logints} - ${result.passts} != ${request.body.passts}`);
            request.result = `password missmatch: ${result.logints} - ${result.passts} != ${request.body.passts}`;
        }
        else {
            result.subscriptions.forEach(function(client) {
                server.send(Buffer.from(JSON.stringify(request.body)), client.port, client.address, function (error) {
                    if (error) {
                        console.log(`error during sending to ${client.address}:${client.port}`);
                        request.result = `error during sending to ${client.address}:${client.port}`;
                    }
                });
                dbo.inbounds().insertOne(request, (error, result) => {
                    if (error) {
                        console.log(error);
                    }
                    else {
                        console.log('processing finished');
                    }
                });
            });
            
        }
    });

    // dbo.inbounds().insertOne(, (error, result) => {
    //     if (error) {
    //         console.log(error);
    //     }
    //     else {
    //         console.debug(result);
    //     }
    // });


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