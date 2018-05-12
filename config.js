const config = {
    app: {
        ports: [4568]
    },
    db: {
        host: 'localhost',
        port: 27017,
        name: 'autobot2',
        collections: {
            inbound: 'inbound',
            signalists: 'signalists'
        },
        testing: {
            signalists: [
                {
                    logints: 'user',
                    passts: 'p@$$word',
                    subscriptions: [
                        {
                            address: '127.0.0.1',
                            port: 41234
                        },
                        {
                            address: '127.0.0.1',
                            port: 41235
                        },
                        {
                            address: '127.0.0.1',
                            port: 41236
                        }
                    ]
                }
            ]
        }
    }
};

module.exports = config;