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

// initSlowpoke().catch()

// updateSlowpokePorts([40000, 40001]).then(() => { 
//     console.log('done!') 
// }).catch(() => { 
//     console.log('nope') 
// })

updateSlowpokeTokens(['JGOFj01TAgjrJTO', 'J7SAn5qeKTpZt33']).then(() => { 
    console.log('done!') 
}).catch(() => { 
    console.log('nope') 
})

setTimeout(() => {
    updateSlowpokeTokens(['iaEbCcQdKAyxG2Y', 'J7SAn5qeKTpZt33']).then(() => { 
        console.log('done!') 
    }).catch(() => { 
        console.log('nope') 
    })
}, 10000)

setTimeout(() => {
    updateSlowpokeTokens(['J7SAn5qeKTpZt33']).then(() => { 
        console.log('done!') 
    }).catch(() => { 
        console.log('nope') 
    })
}, 15000)
