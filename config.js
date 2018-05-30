const config = {
    client: {
        broadcast: {
            address: '0.0.0.0',
            port: 40001
        },
        user: 'first',
        port: 41234,
        url: 'wss://ws.binaryws.com/websockets/v3?app_id=1',
        count: 4
    },
    reception: {
        broadcast: {
            address: '255.255.255.255',
            port: 40001
        }
    },
    cache: {
        generateDebugValues: false
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: 'autobot256',
        collections: {
            inbound: 'inbound',
            signalists: 'signalists'
        }
    }
};

module.exports = config;