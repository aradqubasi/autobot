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
    db: {
        url: 'mongodb://localhost:27017/mongotest',
        host: '192.168.1.6',
        port: 27017,
        name: 'autobot256',
        collections: {
            inbound: 'inbound',
            signalists: 'signalists'
        }
    },
    cache: {
        generateDebugValues: false,
        useConfigAsInitialValues: true,
        initial: {
            token: 'eHlqUl1lXl1Efm5',
            botId: 'd8f3e120-ba1c-4553-9f64-f9e8c48528eb',
            signalists: {
                "user": {
                    id: 'a3e25c6a-7416-46b2-a377-643404b4249f',
                    user: 'user',
                    password: 'p@$$word'
                },
                "user2": {
                    id: '8a912335-f16a-4cfa-9899-062cb8f32a3a',
                    user: 'user2',
                    password: 'Aa@11111'
                }
            },
            subscriptions: {
                "a3e25c6a-7416-46b2-a377-643404b4249f": {
                    signalistId: 'a3e25c6a-7416-46b2-a377-643404b4249f'
                }
            },
            currency: 'USD',
            lot: 1
        }
    }
};

module.exports = config;