const dgram = require('dgram');

function UdpServerAdapter() {
    this.connections = {};
    this.onmessage = function() { console.log('you got a message') }
    this.onerror = function() { console.log('you got an error') }
};

UdpServerAdapter.prototype.open = function (port) {
    const server = dgram.createSocket('udp4');

    server.on('error', (error) => { 
        this.onerror(error);
    });

    server.on('message', (message) => {
        this.onmessage(message);
    });

    server.bind(port); 
    
    this.connections[port] = server;
}

UdpServerAdapter.prototype.close = function (port) {
    const server = this.connections[port];

    server.close();
}

UdpServerAdapter.prototype.onMessage = function (callback) {
    this.onmessage = callback;
}

UdpServerAdapter.prototype.onError = function (callback) {
    this.onerror = callback;
}

module.exports = UdpServerAdapter;