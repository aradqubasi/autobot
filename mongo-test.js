var Db = require('mongodb').Db,
MongoClient = require('mongodb').MongoClient;
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

class DbAccess {
    /**
     * @param {String} url Url to Mongo database
     * @param {String} name Name of the reception server instance
     */
    constructor(url, name) {
        /** @type {String} */
        this.url = url
        /** @type {String} */
        this.name = name
        /** @type {Db} */
        this.db = undefined
    }

    async connect() {
        if (this.db === undefined || (this.db.serverConfig).isConnected() === false) {
            console.log("Connecting to database")
            this.db = (await MongoClient.connect(this.url, {
                useNewUrlParser: true
            })).db()
            // this.db.collection('ReceptionServers').watch({ fullDocument: "updateLookup" }).on('change', data => {
            //     console.debug(data)
            // })
            // setTimeout(() => {
            //     this.db.collection('ReceptionServers').insertOne({ name: 'test2' }).then(() => {
            //         console.log('then')
            //     }).catch(() => {
            //         console.log('catch')
            //     })
            // }, 1000)
            // setTimeout(() => {
            //     this.db.collection('ReceptionServers').updateMany({ name: 'test1' }, {$set: {name: 'test3'}})
            // }, 2000)
            // this.db.collection('ReceptionServers').find().toArray().then(array => console.debug(array))
            this.db.collection('ReceptionServers').deleteMany({}).then(() => {
                this.db.collection('ReceptionServers').find().toArray().then(array => console.debug(array))
            })
        } else {
            console.log(`Already connected to database: ${this.db.databaseName}`)
        }
    } 

}

const dba = new DbAccess('mongodb://178.128.12.94:27017/mongotest', 'slowpoke')
dba.connect().catch(error => { console.debug(error) })