const dgram = require('dgram');
var servers = [];
const config = require('./config.js').reception;
var dba = require('./dba.js');

const process = async function (message, server, remote) {
    console.log(`processing ${message} from ${remote.address}:${remote.port}`);

    var request = { 
        receivedOn: Date.now(),
        body: JSON.parse(message),
        result: {
            status: '',
            messages: []
        }
    }

    dba.signalists().findOne({user: request.logints}).then((result) => {
        if (result == null) {
            request.result.status = 'failure';
            request.result.messages.append({message: 'signalist not found'});
        }
        else if (result.passts != request.body.passts) {
            request.result.status = 'failure';
            request.result.messages.append({message: `password missmatch: ${result.logints} - ${result.passts} != ${request.body.passts}`});
        }
        else {
            request.result.status = 'success';
            result.subscriptions.forEach(function(client) {
                server.send(Buffer.from(JSON.stringify(request.body)), client.port, client.address, function (error) {
                    if (error) {
                        request.result.status = 'failure';
                        request.result.messages.append({
                            message: `error during sending to ${client.address}:${client.port}`,
                            error: error
                        });
                    }
                });
            });
            
        };
    }).catch((error) => {
        request.result.status = 'failure';
        request.result.messages.append({
            message: 'can not find signalist',
            error: error
        });
    }).then(() => {
        request.forwardedOn = Date.now();
        dba.inbounds().insertOne(request).then((result) => {
            console.log('processing finished');
        }).catch((error) => {
            console.log(error);
        });
    });
};

config.ports.forEach(function(port) {

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