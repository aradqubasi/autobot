const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://195.201.98.20:27017/mongotest'




async function initialize(url) {
    try {
        const db = (await MongoClient.connect(url, {useNewUrlParser: true})).db()
        const expected = {
            receptionServers: [
                { 
                    name: 'Development',
                    ports: [4568]
                }
            ],
            signalists: [
                {
                    user: 'user2',
                    password: 'Aa@11111'
                },
                {
                    user: 'user',
                    password: 'p@$$word'
                }
            ],
            clientBots: [
                {
                    name: '',
                    token: '',
                    connections: 1,
                    subscriptions: [
                        ''
                    ]
                }
            ]
        }
        var i = 0
        if (await !db.collection('Signalists').indexExists('nane_1')) {
            await db.collection('Signalists').createIndex('name', {w: 1})
        }
        for (i = 0; i < expected.signalists.length; i++) {
            if (!(await db.collection('Signalists').find({user: expected.signalists[i].user}, {}).limit(1))) {
                await db.collection('Signalists').insertOne(expected[i])
            }
        }
        for (i = 0; i < expected.receptionServers.length; i++) {
            if (await db.collection('ReceptionServers').find({port: expected.receptionServers[i].port})) {

            }
            await db.collection('ReceptionServers').insertOne(expected.receptionServers[i])
        }
    }
    catch (exception) {
        console.debug(exception)
    }
    process.exit()
}

initialize(url)


