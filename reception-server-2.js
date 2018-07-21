const dgram = require('dgram')
const cluster = require('cluster')
var UdpServerAdapter = require('./udp-server-adapter.js')
const numCPUs = require('os').cpus().length;
const uuidv4 = require('uuid/v4')
const WebSocket = require('ws')

var Db = require('mongodb').Db,
MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
ReplSetServers = require('mongodb').ReplSetServers,
ObjectID = require('mongodb').ObjectID,
Binary = require('mongodb').Binary,
GridStore = require('mongodb').GridStore,
Grid = require('mongodb').Grid,
Code = require('mongodb').Code,
// BSON = require('mongodb').pure().BSON,
assert = require('assert');

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

class ClientSignalPassthrough {
    constructor() {
         /** @type {String} */
         this.clientSignalId = ''    
    }
}

class ClientSignalParameters {
    constructor() {
        /** @type {String} */
        this.basis = 'stake'
        /** @type {String} */
        this.contract_type = ''
        /** @type {String} */
        this.currency = ''
        /** @type {String} */
        this.symbol = ''
        /** @type {Date} */
        this.date_expiry = undefined
        /** @type {Number} */
        this.duration = undefined
        /** @type {String} */
        this.duration_unit = undefined
        /** @type {Number} */
        this.amount = 0
    }
}

class ClientSignal {
    constructor() {
        /** @type {Number} */
        this.buy = 1
        /** @type {Number} */
        this.price = 0
        /** @type {ClientSignalParameters} */
        this.parameters = undefined
        /** @type {ClientSignalPassthrough} */
        this.passthrough = undefined
    }
}

class ClientGroup {
    constructor() {
        /** @type {String} */
        this.symbol = ''
        /** @type {Number} */
        this.amount = 0
        /** @type {String} */
        this.currency = ''
        /** @type {Client[]} */
        this.clients = []
    }
}

class MulticlientSignalPassthrough {
    constructor() {
         /** @type {String} */
         this.multiclientSignalId = ''    
    }
}

class MulticlientSignal {
    constructor() {
        /** @type {Number} */
        this.buy_contract_for_multiple_accounts = 1
        /** @type {Number} */
        this.price = 0
        /** @type {String[]} */
        this.tokens = []
        /** @type {ClientSignalParameters} */
        this.parameters = undefined
        /** @type {MulticlientSignalPassthrough} */
        this.passthrough = undefined
    }
}

class ClientRequest {
    constructor() {
        /** @type {String} */
        this._id = ''
        /** @type {Number} */
        this.requested = 0
        /** @type {String} */
        this.signalId = ''
        /** @type {String} */
        this.signalistId = ''
        /** @type {String} */
        this.subscriberId = ''
        /** @type {Error} */
        this.error = undefined
        /** @type {ClientSignal} */
        this.clientSignal = undefined
    }
}

class MulticlientRequest {
    constructor() {
        /** @type {String} */
        this._id = ''
        /** @type {Number} */
        this.requested = 0
        /** @type {String} */
        this.signalId = ''
        /** @type {String} */
        this.signalistId = ''
        /** @type {ClientGroup} */
        this.clients = undefined
        /** @type {Error} */
        this.error = undefined
        /** @type {MulticlientSignal} */
        this.multiclientSignal = undefined
    }
}

class Signal {
    constructor() {
        /** @type {String} signal*/
        this.notify_type = ''
        /** @type {String} CALL*/
        this.callput = ''
        /** @type {String} EURUSD*/
        this.symbol = ''
        /** @type {Number} */
        this.tfdigi = 0
        /** @type {String} 'm' */
        this.tfdur = '' 
        /** @type {Number} 15000000*/
        this.date_expiry = 0
        /** @type {String} 'user'*/
        this.logints = '' 
        /** @type {String} 'p@$$word'*/
        this.passts = '' 
        /** @type {Number} */
        this.martin = 0
    }
}

class SignalistRequest {
    constructor() {
        /** @type {String} */
        this._id = ''
        /** @type {Date} */
        this.received = 0
        /** @type {Error} */
        this.error = undefined
        /** @type {String} */
        this.message = undefined
        /** @type {Signal} */
        this.signal = undefined
        /** @type {String} */
        this.signalistId = undefined
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

class Cache {
    /**
     * @param {string} [url] Url to connect to database
     * @param {String} [name] Name of the instance of reception server
     */
    constructor(url, name) {
        /** @type {Signalist[]} */
        this.signalists = []

        /** @type {Number[]} */
        this.ports = []

        /** @type {String} */
        this.urlOfBinary = ''

        /** @type {String[]} */
        this.tokens = []

        /** @param {Number[]} [ports] new set of ports to listen*/
        this.onportschange = (ports) => { }

        /** 
         * @typedef {function(String[])} onServiceTokensChangeCallback
         * @type {onServiceTokensChangeCallback}
        */
        this.onservicetokenschange = (tokens) => { }

        /** @type {Db} */
        this.db = undefined

        if (arguments.length < 2) {
            //initialize from predefined collection
            console.log(`worker ${process.pid} instatiate ${typeof(this)} from test data`)

            this.urlOfBinary = 'wss://ws.binaryws.com/websockets/v3?app_id=1'

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

            this.signalists.push(signalist1)
            this.signalists.push(signalist2)

            var self = this

            setTimeout(() => { 
                self.ports = [40000, 40001]
                self.onportschange(self.ports)
            }, 1000)

            setTimeout(() => { 
                self.tokens = ['J7SAn5qeKTpZt33']
                self.onservicetokenschange(self.tokens)
            }, 1500)
        }
        else {
            //initialize from mongo database collection
            console.log(`worker ${process.pid} instatiate ${typeof(this)} from db ${url}`)
            MongoClient.connect(url, {
                useNewUrlParser: true
            }).then(client => {
                this.db = client.db()
                this.db.collection('ReceptionServers').watch({ 
                    fullDocument: "updateLookup" 
                }).on('change', data => {
                    if (data && data.fullDocument && data.fullDocument.name == name) {
                        /** @type {ReceptionServer} */
                        var config = data.fullDocument
                        this.ports = config.ports
                        this.tokens = config.serviceTokens
                        this.signalists = config.signalists
                        this.urlOfBinary = config.urlOfBinary
                        this.onportschange(this.ports)
                        this.onservicetokenschange(this.tokens)
                    }
                })
                this.db.collection('ReceptionServers').findOne({ 
                    name: name 
                }).then(data => {
                    if (data) {
                        /** @type {ReceptionServer} */
                        var config = data
                        this.ports = config.ports
                        this.tokens = config.serviceTokens
                        this.signalists = config.signalists
                        this.urlOfBinary = config.urlOfBinary
                        this.onportschange(this.ports)
                        this.onservicetokenschange(this.tokens)
                    } 
                }).catch(error => {
                    console.log(`worker ${process.pid} error while extracting initial value`)
                    console.debug(error)
                })
            }).catch(error => {
                console.log(`worker ${process.pid} error while connecting ${url}`)
                console.debug(error)
            })
        }

    }

    /**
     * 
     * @param {(SignalistRequest|MulticlientRequest)} value 
     */
    push(value) {
        try {
            if (SignalistRequest.prototype.isPrototypeOf(value)) {
                /** @type {SignalistRequest} */
                var signalistRequest = value
                this.db.collection('SignalistRequests').insertOne(signalistRequest).then(() => {
                    console.log(`Worker ${process.pid} pushed SignalistRequest`)
                }).catch(error => {
                    console.log(`Worker ${process.pid} error while pushing SignalistRequest`)
                    console.debug(error)
                })
            }
            else if (MulticlientRequest.prototype.isPrototypeOf(value)) {
                /** @type {MulticlientRequest} */
                var multiclientRequest = value
                this.db.collection('MulticlientRequests').insertOne(multiclientRequest).then(() => {
                    console.log(`Worker ${process.pid} pushed MulticlientRequest`)
                }).catch(error => {
                    console.log(`Worker ${process.pid} error while pushing MulticlientRequest`)
                    console.debug(error)
                })
            }
            else {
                console.log(`Worker ${process.pid} can not push ${typeof(value)}`)
                console.debug(value)
            }
        }
        catch (error) {
            console.log(`Worker ${process.pid} error while pushing ${typeof(value)}`)
            console.debug(error)
        }
    }
}

/**
 * @typedef {function(Number[])} newPortsCallback
 * @param {newPortsCallback} callback new set of ports
 */
Cache.prototype.onPortsChange = function(callback) {
    this.onportschange = callback
}

/** 
 * @typedef {function(String[])} onServiceTokensChangeCallback
 * @param {onServiceTokensChangeCallback} callback
 */
Cache.prototype.onServiceTokensChange = function(callback) {
    this.onservicetokenschange = callback
}



/** 
 * @param {Signalist[]} [signalists] signalists collection
 * @param {Buffer} [buffer] buffer object containing signal
 * @returns {SignalistRequest} 
 */
function processSignal(signalists, buffer) {
    const signalistRequest = new SignalistRequest()
    try {
        signalistRequest.received = Date.now()
        signalistRequest._id = uuidv4()
        signalistRequest.message = buffer
        signalistRequest.message = JSON.parse(buffer)

        signalistRequest.signal = new Signal()
        signalistRequest.signal.logints = signalistRequest.message.logints
        signalistRequest.signal.callput = signalistRequest.message.callput
        signalistRequest.signal.date_expiry = signalistRequest.message.date_expiry
        signalistRequest.signal.martin = signalistRequest.message.martin
        signalistRequest.signal.notify_type = signalistRequest.message.notify_type
        signalistRequest.signal.passts = signalistRequest.message.passts
        signalistRequest.signal.symbol = signalistRequest.message.symbol
        signalistRequest.signal.tfdigi = signalistRequest.message.tfdigi
        signalistRequest.signal.tfdur = signalistRequest.message.tfdur

        const signalist = signalists.find(signalist => { return signalist.login == signalistRequest.signal.logints })
        signalistRequest.signalistId = signalist._id

        if (signalist && signalist.password == signalistRequest.signal.passts) {
            //proceed
        }
        else {
            throw new Error('invalid credentials');
        }
    }
    catch (error) {
        signalistRequest.error = error
    }
    return signalistRequest
}

/** 
 * @param {Client} client
 * @param {SignalistRequest} request
 * @returns {ClientRequest} 
 */
function processSignalistRequestPerClient(client, request) {
    const clientRequest = new ClientRequest()
    try {
        clientRequest._id = uuidv4()
        clientRequest.signalId = request._id
        clientRequest.signalistId = request.signalistId
        clientRequest.subscriberId = client._id
        clientRequest.clientSignal = new ClientRequest()
        clientRequest.clientSignal.price = client.amount
        clientRequest.clientSignal.parameters = new ClientSignalParameters()
        clientRequest.clientSignal.parameters.amount = client.amount
        clientRequest.clientSignal.parameters.contract_type = request.signal.callput
        clientRequest.clientSignal.parameters.currency = client.currency
        if (request.signal.date_expiry) {
            clientRequest.clientSignal.parameters.date_expiry = request.signal.date_expiry
        }
        else {
            clientRequest.clientSignal.parameters.duration = request.signal.duration
            clientRequest.clientSignal.parameters.duration_unit = request.signal.duration_unit
        }
        clientRequest.clientSignal.parameters.symbol = 'frx' + request.signal.symbol
        clientRequest.clientSignal.passthrough = new ClientSignalPassthrough()
        clientRequest.clientSignal.passthrough.clientSignalId = clientRequest._id
    }
    catch (error) {
        clientRequest.error = error
    }
    return clientRequest
}

/** 
 * @param {ClientGroup} clients
 * @param {SignalistRequest} request
 * @returns {MulticlientRequest} 
 */
function processSignalistRequestPerClientGroup(clients, request) {
    console.log(`Worker ${process.pid} processSignalistRequestPerClientGroup`)
    console.debug(clients)
    const multiclientRequest = new MulticlientRequest()
    try {
        multiclientRequest._id = uuidv4()
        multiclientRequest.signalId = request._id
        multiclientRequest.signalistId = request.signalistId
        multiclientRequest.clients = clients
        multiclientRequest.multiclientSignal = new MulticlientSignal()
        multiclientRequest.multiclientSignal.price = clients.amount
        clients.clients.forEach(client => {
            multiclientRequest.multiclientSignal.tokens.push(client.token)
        })
        multiclientRequest.multiclientSignal.parameters = new ClientSignalParameters()
        multiclientRequest.multiclientSignal.parameters.amount = clients.amount
        multiclientRequest.multiclientSignal.parameters.contract_type = request.signal.callput
        multiclientRequest.multiclientSignal.parameters.currency = clients.currency
        if (request.signal.date_expiry && request.signal.date_expiry != "") {
            multiclientRequest.multiclientSignal.parameters.date_expiry = request.signal.date_expiry
        }
        else {
            multiclientRequest.multiclientSignal.parameters.duration = request.signal.tfdigi
            multiclientRequest.multiclientSignal.parameters.duration_unit = request.signal.tfdur
        }
        multiclientRequest.multiclientSignal.parameters.symbol = 'frx' + request.signal.symbol
        multiclientRequest.multiclientSignal.passthrough = new MulticlientSignalPassthrough()
        multiclientRequest.multiclientSignal.passthrough.multiclientSignalId = multiclientRequest._id
    }
    catch (error) {
        multiclientRequest.error = error
    }
    // console.log('multiclientRequest')
    // console.debug(multiclientRequest)
    return multiclientRequest
}

class PingRequest {
    constructor () {
        /** @type {Number} */
        this.ping = 1
    }
}

class AuthorizeRequest {
    constructor () {
        /** @type {String} */
        this.authorize = ''
    }
}

class WebSocketAdapter {
    constructor () {
        /** @type {String} */
        this.token = ''
        /** @type {WebSocket} */
        this.adaptee = {}
        /** @type {Boolean} */
        this.didExist = false
        /** @type {Boolean} */
        this.willExist = false
        /** @type {Number} */
        this.heartbeating = 0
        /** @type {Boolean} */
        this.authorized = false
    }

    /**
     * @description send ping request to existing, opened web socket
     */
    heartbeat() {
        if (this.adaptee && this.adaptee.readyState == WebSocket.prototype.OPEN) {
            const pingRequest = new PingRequest()
            this.adaptee.send(JSON.stringify(pingRequest))
        }
    }

    /**
     * @description checks whether web scoket coneection is exist, opened and authorized
     * @returns {Boolean} 
     */
    get isReady() {
        if (this.adaptee && this.adaptee.readyState == WebSocket.OPEN) {
            return true
        }
        else {
            return false
        }
    }

    /**
     * @description authorize requst using service token
     */
    authorize() {
        const authorizeRequest = new AuthorizeRequest()
        authorizeRequest.authorize = this.token
        this.adaptee.send(JSON.stringify(authorizeRequest))
    }

    /** 
     * @description perform multibuy request 
     * @param {MulticlientRequest} request
     */
    multibuy(request) {
        const multibuyRequst = request.multiclientSignal
        this.adaptee.send(JSON.stringify(multibuyRequst))
    }
}

/** @param {MulticlientRequest}*/
WebSocketAdapter.prototype.send = function(request) {

}

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`)
        cluster.fork()
    })

    // setTimeout(() => { cluster.disconnect() }, 10000)

} else {
    console.log(`Worker ${process.pid} started`)
    const cache = new Cache('mongodb://178.128.12.94:27017/mongotest', 'slowpoke')

    /** @type {WebSocketAdapter[]} */
    var wsClients = []
    cache.onServiceTokensChange(newTokens => {

        wsClients.forEach(ws => {
            ws.didExist = true
            ws.willExist = false
        })

        newTokens.forEach(tkn => {
            var wsClient = wsClients.find(ws => tkn == ws.token)
            if (wsClient) {
                wsClient.willExist = true
            }
            else {
                wsClient = new WebSocketAdapter()
                wsClient.token = tkn
                wsClient.willExist = true
                wsClientdidExist = false
                wsClients.push(wsClient)
            }
        })

        wsClients.forEach(wsClient => {
            if (wsClient.didExist && !wsClient.willExist) {
                //close
                wsClient.adaptee.close(1000)
            }
            else if (!wsClient.didExist && wsClient.willExist) {
                //open
                wsClient.adaptee = new WebSocket(cache.urlOfBinary)
                wsClient.adaptee.on('close', (code, reason) => {
                    console.log(`Worker ${process.pid} ws ${wsClient.token} closed with ${code} ${reason}`)
                    if (this.heartbeating) {
                        clearTimeout(this.heartbeating);
                    }
                    if (code == 1000) {
                        //expected close code
                    }
                    else {
                        // this.open();
                    }
                })
                wsClient.adaptee.on('error', error => {
                    console.log(`Worker ${process.pid} ws ${wsClient.token} error`)
                    console.debug(error)
                })
                wsClient.adaptee.on('upgrade', request => {
                    console.log(`Worker ${process.pid} ws ${wsClient.token} upgrade`)
                    // console.debug(request)
                })
                wsClient.adaptee.on('message', buffer => {
                    console.log(`Worker ${process.pid} ws ${wsClient.token} message`)
                    console.debug(buffer)
                })
                wsClient.adaptee.on('open', () => {
                    console.log(`Worker ${process.pid} ws ${wsClient.token} open`)
                    wsClient.heartbeat()
                    wsClient.heartbeating = setInterval(() => wsClient.heartbeat(), 15000)
                    wsClient.authorize()
                })
                wsClient.adaptee.on('unexpected-response', (request, response) => {
                    console.log(`Worker ${process.pid} ws ${wsClient.token} unexpected-response`)
                    console.debug(request)
                    console.debug(response)
                })
                wsClient.adaptee.on('ping', buffer => {
                    console.log(`Worker ${process.pid} ws ${wsClient.token} ping`)
                })
                wsClient.adaptee.on('pong', buffer => {
                    console.log(`Worker ${process.pid} ws ${wsClient.token} pong`)
                })
            }
        })

        wsClients = wsClients.filter(wsClient => wsClient.willExist)
    })

    var ports = []
    var servers = {}
    var prevSocketIndex = 0
    cache.onPortsChange(newPorts => {
        // open new ports
        for (var index = 0; index < newPorts.length; index++) {
            let port = newPorts[index]
            if (servers[port]) {
                //if its exists - skip
            }
            else {
                //if not exists - open
                const server = dgram.createSocket({type: 'udp4', reuseAddr: true})
                server.on('message', buffer => {
                    console.log(`Worker ${process.pid} received message`)
                    const signalistRequest = processSignal(cache.signalists, buffer)
                    cache.push(signalistRequest)
                    if (signalistRequest.error) {
                        console.log(`Worker ${process.pid} error during message parsing`)
                        console.debug(signalistRequest)
                    }
                    else {
                        console.log(`Worker ${process.pid} parsing successful`)
                        const signalist = cache.signalists.find(signalist => { return signalist._id == signalistRequest.signalistId })

                        /** @type {ClientGroup[]} */
                        var groups = []

                        console.log(`Worker ${process.pid} grouping clients`)
                        console.debug(signalist)
                        for (var j = 0; j < signalist.clients.length; j++) {
                            var client = signalist.clients[j]
                            var group = groups.find(g => { g.amount == client.amount && g.currency == client.currency && g.symbol == signalistRequest.signal.symbol })
                            if (group) {
                                group.clients.push(client)                                
                            }
                            else {
                                group = new ClientGroup()
                                group.amount = client.amount
                                group.currency = client.currency
                                group.symbol = signalistRequest.signal.symbol
                                group.clients = [client]
                                groups.push(group)
                            }
                        }

                        for (var k = 0; k < groups.length; k++) {
                            var group = groups[k];

                            const multiclientRequest = processSignalistRequestPerClientGroup(group, signalistRequest)
                            cache.push(multiclientRequest)
                            if (multiclientRequest.error) {
                                console.log(`Worker ${process.pid} error during creating of multiclient request`)
                                console.debug(multiclientRequest)
                            }
                            else {
                                console.log(`Worker ${process.pid} created multiclient request`)
                                var index = Math.min(prevSocketIndex, wsClients.length - 1)
                                var isSent = false
                                for (index = prevSocketIndex + 1; index < wsClients.length; index++) {
                                    var wsClient = wsClients[index]
                                    if (wsClient && wsClient.isReady) {
                                        prevSocketIndex = index
                                        wsClients[index].multibuy(multiclientRequest)
                                        isSent = true
                                        break
                                    }
                                }
                                if (!isSent) {
                                    for (index = 0; index <= prevSocketIndex; index++) {
                                        var wsClient = wsClients[index]
                                        if (wsClient && wsClient.isReady) {
                                            prevSocketIndex = index
                                            wsClients[index].multibuy(multiclientRequest)
                                            isSent = true
                                            break
                                        }
                                    }
                                }
                                if (isSent) {
                                    console.log(`Worker ${process.pid} ws ${wsClients[prevSocketIndex].token} sent request for client ${client._id}`)
                                }
                                else {
                                    console.log(`Worker ${process.pid} cannot sent request all web sockets are not ready`)
                                }
                            }
                        }
                        
                    }
                })
                server.on('listening', () => {
                    console.log(`Worker ${process.pid} start listening ${port}`)
                })
                server.bind(port)
                servers[port] = server
            }
        }
        // close absent ports
        for (var index = 0; index < ports.length; index++) {
            var oldPort = ports[index]
            if (newPorts.find(port => { return port == oldPort })) {
                //if its exists - skip
            }
            else {
                //if not exists - close
                servers[oldPort].close(() => {
                    console.log(`Worker ${process.pid} stop listening ${oldPort}`)
                })
                servers[oldPort] = undefined
            }
        }
        // save ports
        ports = Object.keys(servers).filter(server => servers[server])
    })

}