const MongoClient = require('mongodb').MongoClient;
const Db = require('mongodb').Db
const uuidv4 = require('uuid/v4')

// (async () => {
//     const db = (await MongoClient.connect('mongodb://178.128.12.94:27017/mongotest', {useNewUrlParser: true})).db()
//     // await db.collection('test').insertOne({ foo: "bar" })
//     // const r = (await db.collection('test').findOne({}))
//     // console.debug(r)
//     setTimeout(() => { db.collection('test').insertOne({ foo: "Bar", num: 2}) }, 5000)
//     const  c = db.collection('test').watch()
//     const n = await c.next()
//     console.debug(n)
// })()

// const id = uuidv4()
// console.debug(id)

class Client {
    constructor() {
       /** @type {String} */
        this._id = ''
        /** @type {String} */
        this.token = ''
        /** @type {String} */
        this.currency = ''
        /** @type {Number} */
        this.amount = 0
    }
}

class Signalist {
    constructor() {
        /** @type {String} */
        this._id = ''
        /** @type {String} */
        this.login = ''
        /** @type {String} */
        this.password = ''
        /** @type {Client[]} */
        this.clients = []
    }
}

class ReceptionServer {
    constructor () {
        /** @type {String} */
        this.name = ''
        /** @type {Signalists[]} */
        this.signalists = []
        /** @type {Number[]} */
        this.ports = []
        /** @type {String[]} */
        this.serviceTokens = []
        /** @type {String} */
        this.urlOfBinary = ''
    }
}

/**
 * @description Create slowpoke out of thin air
 * @returns {ReceptionServer}
 */
function makeslowpoke () {
    const subscriber1 = new Client()
    subscriber1._id = 'sub1'
    subscriber1.token = 'eHlqUl1lXl1Efm5'
    subscriber1.currency = 'USD'
    subscriber1.amount = 1.33
    
    const subscriber2 = new Client()
    subscriber2._id = 'sub2'
    subscriber2.token = 'KDi2DBguCkqczU1'
    subscriber2.currency = 'USD'
    subscriber2.amount = 1.33
    
    const subscriber3 = new Client()
    subscriber3._id = 'sub3'
    subscriber3.token = 'JPEtlwUO5ED165D'
    subscriber3.currency = 'USD'
    subscriber3.amount = 1.66
    
    const subscriber4 = new Client()
    subscriber4._id = 'sub4'
    subscriber4.token = 'QVZdAAH3y55ElE6'
    subscriber4.currency = 'USD'
    subscriber4.amount = 1.66
    
    const signalist1 = new Signalist()
    signalist1._id = 'sig1'
    signalist1.login = 'signalist1'
    signalist1.password = 'Aa@11111'
    signalist1.clients.push(subscriber1)
    signalist1.clients.push(subscriber2)
    
    const signalist2 = new Signalist()
    signalist2._id = 'sig2'
    signalist2.login = 'user'
    signalist2.password = 'p@$$word'
    signalist2.clients.push(subscriber1)
    signalist2.clients.push(subscriber3)
    signalist2.clients.push(subscriber4)

    const slowpoke = new ReceptionServer()
    slowpoke.name = 'slowpoke'
    slowpoke.signalists.push(signalist1)
    slowpoke.signalists.push(signalist2)
    slowpoke.ports.push(40000)
    slowpoke.ports.push(40001)
    slowpoke.serviceTokens.push('J7SAn5qeKTpZt33')
    slowpoke.urlOfBinary = 'wss://ws.binaryws.com/websockets/v3?app_id=1'
    return slowpoke
}



async function initSlowpoke() {
    try {
        /** @type {ReceptionServer} */
        const slowpoke = makeslowpoke()
        /** @type {MongoClient} */
        const client = await MongoClient.connect('mongodb://178.128.12.94:27017/mongotest', {useNewUrlParser: true})
        /** @type {Db} */
        const db = client.db()
        db.collection('ReceptionServers').updateOne({ 
            name: 'slowpoke' 
        }, {
            $set: {
                name: slowpoke.name,
                signalists: slowpoke.signalists,
                ports: slowpoke.ports,
                serviceTokens: slowpoke.serviceTokens,
                urlOfBinary: slowpoke.urlOfBinary
            }
        }, {
            upsert: true
        })
    }
    catch (error) {
        console.debug(error)
    }

}

/**
 * @description Update ports for slowpoke
 * @param {Number[]} ports 
 */
async function updateSlowpokePorts(ports) {
    try {
        /** @type {MongoClient} */
        const client = await MongoClient.connect('mongodb://178.128.12.94:27017/mongotest', {useNewUrlParser: true})
        /** @type {Db} */
        const db = client.db()
        db.collection('ReceptionServers').updateOne({ 
            name: 'slowpoke' 
        }, {
            $set: {
                ports: ports
            }
        })
    }
    catch (error) {
        console.log('Error while updating slowpoke ports, it is sad')
        console.debug(error)
    }
}

/**
 * @description Update service tokens for slowpoke
 * @param {String[]} tokens 
 */
async function updateSlowpokeTokens(tokens) {
    try {
        /** @type {MongoClient} */
        const client = await MongoClient.connect('mongodb://178.128.12.94:27017/mongotest', {useNewUrlParser: true})
        /** @type {Db} */
        const db = client.db()
        db.collection('ReceptionServers').updateOne({ 
            name: 'slowpoke' 
        }, {
            $set: {
                serviceTokens: tokens
            }
        })
    }
    catch (error) {
        console.log('Error while updating slowpoke tokens, it is sad')
        console.debug(error)
    }
}

async function setClients() {
    try {
        var clients = []

        const subscriber1 = new Client()
        subscriber1._id = 'sub1'
        subscriber1.token = 'y64zivPOMCOK4vB'
        subscriber1.currency = 'USD'
        subscriber1.amount = 1.33
        clients.push(subscriber1)
        
        const subscriber2 = new Client()
        subscriber2._id = 'sub2'
        subscriber2.token = 'texSaMIEYAQ9VtH'
        subscriber2.currency = 'USD'
        subscriber2.amount = 1.33
        clients.push(subscriber2)
        
        const subscriber3 = new Client()
        subscriber3._id = 'sub3'
        subscriber3.token = '4v7SjpBVS5LaGvi'
        subscriber3.currency = 'USD'
        subscriber3.amount = 1.33
        clients.push(subscriber3)
        
        const subscriber4 = new Client()
        subscriber4._id = 'sub4'
        subscriber4.token = '3wC8enZlKXdY89c'
        subscriber4.currency = 'USD'
        subscriber4.amount = 1.33
        clients.push(subscriber4)

        const subscriber5 = new Client()
        subscriber5._id = 'sub5'
        subscriber5.token = 'nfhDA6K47pTiUrI'
        subscriber5.currency = 'USD'
        subscriber5.amount = 1.33
        clients.push(subscriber5)

        const subscriber6 = new Client()
        subscriber6._id = 'sub6'
        subscriber6.token = '6l3bHYYUUIz5ABQ'
        subscriber6.currency = 'USD'
        subscriber6.amount = 1.33
        clients.push(subscriber6)

        const subscriber7 = new Client()
        subscriber7._id = 'sub7'
        subscriber7.token = 'xGI0OANbngry3Ca'
        subscriber7.currency = 'USD'
        subscriber7.amount = 1.33
        clients.push(subscriber7)

        const subscriber8 = new Client()
        subscriber8._id = 'sub8'
        subscriber8.token = 'YQmlRBTYAXAs83h'
        subscriber8.currency = 'USD'
        subscriber8.amount = 1.33
        clients.push(subscriber8)

        const subscriber9 = new Client()
        subscriber9._id = 'sub9'
        subscriber9.token = 'lbWymdYoEKSrA9X'
        subscriber9.currency = 'USD'
        subscriber9.amount = 1.33
        clients.push(subscriber9)

        const subscriber10 = new Client()
        subscriber10._id = 'sub10'
        subscriber10.token = 'z6272FfCB9YOoq9'
        subscriber10.currency = 'USD'
        subscriber10.amount = 1.33
        clients.push(subscriber10)

        const subscriber11 = new Client()
        subscriber11._id = 'sub11'
        subscriber11.token = '4OwrbE3Fuge7WHe'
        subscriber11.currency = 'USD'
        subscriber11.amount = 1.33
        clients.push(subscriber11)

        const subscriber12 = new Client()
        subscriber12._id = 'sub12'
        subscriber12.token = 'Gqxlpueb2Ac184V'
        subscriber12.currency = 'USD'
        subscriber12.amount = 1.33
        clients.push(subscriber12)

        const subscriber13 = new Client()
        subscriber13._id = 'sub13'
        subscriber13.token = 'U2UbkkUGFpNWmPc'
        subscriber13.currency = 'USD'
        subscriber13.amount = 1.33
        clients.push(subscriber13)

        const subscriber14 = new Client()
        subscriber14._id = 'sub14'
        subscriber14.token = 'eHlqUl1lXl1Efm5'
        subscriber14.currency = 'USD'
        subscriber14.amount = 1.33
        clients.push(subscriber14)

        const subscriber15 = new Client()
        subscriber15._id = 'sub15'
        subscriber15.token = '3hKz4vhnvUJXk63'
        subscriber15.currency = 'USD'
        subscriber15.amount = 1.33
        clients.push(subscriber15)

        const subscriber16 = new Client()
        subscriber16._id = 'sub16'
        subscriber16.token = 'AfkNKAb7wUlPaL6'
        subscriber16.currency = 'USD'
        subscriber16.amount = 1.33
        clients.push(subscriber16)

        const subscriber17 = new Client()
        subscriber17._id = 'sub17'
        subscriber17.token = 'RUdoFBNdkCE0h6d'
        subscriber17.currency = 'USD'
        subscriber17.amount = 1.33
        clients.push(subscriber17)

        const subscriber18 = new Client()
        subscriber18._id = 'sub18'
        subscriber18.token = 'Q8UlTFNG8p8ZtaZ'
        subscriber18.currency = 'USD'
        subscriber18.amount = 1.33
        clients.push(subscriber18)

        const subscriber19 = new Client()
        subscriber19._id = 'sub19'
        subscriber19.token = 'fRTNU7vUlnbt0Hg'
        subscriber19.currency = 'USD'
        subscriber19.amount = 1.33
        clients.push(subscriber19)

        const subscriber20 = new Client()
        subscriber20._id = 'sub20'
        subscriber20.token = 'QTmMfEaoZjt4KoW'
        subscriber20.currency = 'USD'
        subscriber20.amount = 1.33
        clients.push(subscriber20)

        const signalist1 = new Signalist()
        signalist1._id = 'sig1'
        signalist1.login = 'signalist1'
        signalist1.password = 'Aa@11111'
        signalist1.clients = clients

        /** @type {MongoClient} */
        const client = await MongoClient.connect('mongodb://178.128.12.94:27017/mongotest', {useNewUrlParser: true})
        /** @type {Db} */
        const db = client.db()
        db.collection('ReceptionServers').updateOne({ 
            name: 'slowpoke' 
        }, {
            $set: {
                signalists: [signalist1]
            }
        })
    }
    catch (error) {
        console.log('Error while updating slowpoke tokens, it is sad')
        console.debug(error)
    }
}

// initSlowpoke().catch()

// updateSlowpokePorts([40000, 40001]).then(() => { 
//     console.log('done!') 
// }).catch(() => { 
//     console.log('nope') 
// })

// updateSlowpokeTokens(['JGOFj01TAgjrJTO', 'J7SAn5qeKTpZt33']).then(() => { 
//     console.log('done!') 
// }).catch(() => { 
//     console.log('nope') 
// })

// setTimeout(() => {
//     updateSlowpokeTokens(['iaEbCcQdKAyxG2Y', 'J7SAn5qeKTpZt33']).then(() => { 
//         console.log('done!') 
//     }).catch(() => { 
//         console.log('nope') 
//     })
// }, 10000)

// setTimeout(() => {
//     updateSlowpokeTokens(['J7SAn5qeKTpZt33']).then(() => { 
//         console.log('done!') 
//     }).catch(() => { 
//         console.log('nope') 
//     })
// }, 15000)

setClients().then(() => { 
    console.log('done!') 
}).catch(() => { 
    console.log('nope') 
})