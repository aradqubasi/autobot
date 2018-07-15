const MongoClient = require('mongodb').MongoClient
const readline = require('readline')
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});
const url = 'mongodb://Cain:1vision1purpose@192.241.150.201:27017/mongotest?authMechanism=DEFAULT&authSource=admin'
const expected = {
    ReceptionServers: [
        { 
            name: 'Development',
            ports: [4568]
        }
    ],
    Signalists: [
        {
            user: 'user2',
            password: 'Aa@11111'
        },
        {
            user: 'user',
            password: 'p@$$word'
        }
    ],
    ClientBots: [
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
var operations = []
var db

function makeUrl(user, password, address, port, db, authdb) {
    // return `mongodb://${user || 'Cain'}:${password || '1vision1purpose'}@${address || '192.241.150.201'}:${port || '27017'}/${db || 'mongotest'}?authMechanism=DEFAULT&authSource=${authdb || 'admin'}`
    return `mongodb://${user || 'Slavic'}:${password || '1vision1purpose'}@${address || '192.241.150.201'}:${port || '27017'}/${db || 'mongotest'}?authMechanism=DEFAULT&authSource=${authdb || 'mongotest'}`    
}

async function connect(url) {
    try {
        const connection = await MongoClient.connect(url, {useNewUrlParser: true})
        return connection
    }
    catch (error) {
        console.log(`error during connect {url: ${url}}`)
        console.debug(error)
    }
}

async function index(db, collection, key) {
    try {
        // const db = (await MongoClient.connect(url, {useNewUrlParser: true})).db()
        if (await db.collection(collection).indexExists(`${key}_1`)) {
            console.log(`${collection} have index on name... proceed`)
        }
        else {
            console.log(`${collection} miss index on name... creating`)
            await db.collection(collection).createIndex('name', {w: 1})
        }
    }
    catch (error) {
        console.log(`error during indexing {db: ${db}, collection: ${collection}, key: ${key}}`)
        console.debug(error)
    }
}

async function seed(db, collection, key, values) {
    try {
        // const db = (await MongoClient.connect(url, {useNewUrlParser: true})).db()
        for (var i = 0; i < values.length; i++) {
            const value = values[i]
            const filter = {}
            filter[key] = value[key]
            if ((await db.collection(collection).find(filter, {}).limit(1).toArray()).length) {
                console.log(`value ${value[key]} exists`)
            }
            else {
                console.log(`value ${value[key]} missing`)
                await db.collection(collection).insertOne(value)
            }
        }
    }
    catch (error) {
        console.log(`error during seeding {db: ${db}, collection: ${collection}, key: ${key}}`)
        console.debug(error)
    }
}

async function select(db, collection, fields) {
    try {
        // const db = (await (MongoClient.connect(url, {useNewUrlParser: true}))).db()
        var projection = {}
        for (var i = 0; i < fields.length; i++) {
            var field = fields[i];
            projection[field] = 1
        }
        if (!(fields.find(field => field == '_id'))) {
            projection['_id'] = 0
        }
        var cursor = db.collection(collection).find({})
        cursor.project(projection)
        cursor.forEach(
            function(doc) {
                console.debug(doc)
            },
            function(error) {
                if (error) {
                    const exception = new Error('Cursor error')
                    exception.innerError = error
                    throw exception
                }
            }
        )
    }
    catch (error) {
        console.log(`error during select {db: ${db}, collection: ${collection}, key: ${fields}}`)
        console.debug(error)
    }
}


async function addUser(db, user, password) {
    try {
        // const db = (await (MongoClient.connect(url, {useNewUrlParser: true}))).db()
        await db.addUser(user, password, {
            roles: [
                {
                    role: 'readWrite',
                    db: db.databaseName
                }
            ]
        })
    }
    catch (error) {
        console.log(`error during addUser {db: ${db}, user: ${user}, password: ${password}}`)
        console.debug(error)
    }
}

async function removeUser(db, user) {
    try {
        // const db = (await (MongoClient.connect(url, {useNewUrlParser: true}))).db()
        await db.removeUser(user)
    }
    catch (error) {
        console.log(`error during removeUser {db: ${db}, user: ${user}}`)
        console.debug(error)
    }   
}

async function authenticate(db, user, password) {
    try {
        // console.debug(db)
        // console.debug(db.admin())
        await db.admin().authenticate(user, password)
    }
    catch (error) {
        console.log(`error during authenticate {db: ${db}, user: ${user}}, password ${password}`)
        console.debug(error)
    }
}

function Command(command) {

    this.operation = 'unknown'
    this.user = ''
    this.address = ''
    this.port = ''
    this.datadb = ''
    this.authdb = ''
    this.collection = ''
    this.query = {}
    this.projection = {}
    this.modifier = {}

    const args = command.split(' ')
    const isKey = new RegExp('-{2}.+')
    var key, value, field, operation, count, newvalue = {}, type = 0

    for (var index = 0; index < args.length; index++) {
        const element = args[index]

        const r = isKey.test(element)
        if (isKey.test(element)) {
            key = element
            count = 0
            if (index == 0) {
                this.operation = element
            }
            switch (key) {
                case '--select':
                    this.projection['_id'] = 0
                    break
                case '--set':
                    this.modifier['$set'] = {}
            }
        }
        else {
            value = element
            switch (key) {
                case '--u':
                case '--user':
                    this.user = value
                    break
                case '--p':
                case '--password':
                    this.password = value
                    break
                case '--a':
                case '--address':
                    this.address = value
                    break
                case '--port':
                    this.port = value
                    break
                case '--datadb':
                    this.datadb = value
                    break
                case '--authdb':
                    this.authdb = value
                    break
                case '--from':
                    this.collection = value
                    break
                case '--seed':
                    this.collection = value
                    break
                case '--select':
                    if (value == '*') {
                        this.projection = {}
                        key = 'closed'
                    }
                    else {
                        this.projection[value] = 1
                    }
                    break
                case '--and':
                case '--where':
                    switch (count) {
                        case 0:
                            field = value
                            break
                        case 1:
                            operation = value
                            break
                        case 2:
                            if (!this.query[field]) {
                                this.query[field] = {}
                            }
                            (this.query[field])[operation] = value
                            count = -1
                            break
                    }
                    break
                case '--update':
                    this.collection = value
                    break
                case '--set':
                    switch (count) {
                        case 0:
                            field = value
                            break
                        case 1:
                            break
                        case 2:
                            newvalue['value'] = value
                            this.modifier['$set'][field] = newvalue.value
                            break
                    }
                    break
                case '--as':
                    switch (value) {
                        case 'int': 
                        newvalue.value = Number(newvalue.value)
                        break
                    }
                    (this.modifier['$set'])[field] = newvalue.value
            }
            count++
        }
    }
}

Command.prototype.execute = function () {
    switch (this.operation) {
        case '--connect':
            connect(makeUrl(this.user, this.password, this.address, this.port, this.datadb, this.authdb)).then(connection => {
                db = connection.db()
                console.log('connected')
            }).catch(error => { 
                console.log(`connection error {user: ${user}, password: ${password}, address: ${address}, port: ${port}, db: ${db}, authdb: ${authdb}}`)
                console.debug(error) 
            })
            break
        case '--seed':
            if (this.collection == '*') {
                (async (db, values) => {
                    await seed(db, 'ReceptionServers', 'name', values['ReceptionServers'])
                    await seed(db, 'Signalists', 'user', values['Signalists'])
                    await seed(db, 'ClientBots', 'name', values['ClientBots'])
                })(db, expected)
            }
            else {
                seed(db, this.collection, this.collection == 'Signalists' ? 'user' : 'name', expected[this.collection])
            }
            break
        case '--select':
            var cursor = db.collection(this.collection).find(this.query)
            cursor.project(this.projection)
            cursor.forEach(
                function(doc) {
                    console.debug(doc)
                },
                function(error) {
                    if (error) {
                        const exception = new Error('Cursor error')
                        exception.innerError = error
                        throw exception
                    }
                }
            )         
            break
        case '--addUser':
            addUser(db, this.user, this.password).then(() => { console.log('added')})
            break
        case '--removeUser':
            removeUser(db, this.user).then(() => { console.log('removed') })
            break
        case '--exit':
            process.exit()
            break
        case '--update':
            db.collection(this.collection).update(this.query, this.modifier).then(() => { console.log('updated') })
            break
        default:
            break
    }
}

rl.on('line', function(line) {
    try {
        var command = new Command(line)
        console.debug(command)
        command.execute()
    }
    catch (error) {
        console.log(`error during ${(command || { operation: 'parsing'}).operation}`)
        console.debug(command)
        console.debug(error)
    }
    
})

// console.debug(new Command('--select * --from Signalists --where _id $gt 14'))
// console.debug(new Command('--update Signalists --set user = 1 --as int --where _id $eq 4'))