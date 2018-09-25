const Time = require('./model/Time')
const Minute = require('./model/Minute')
const HourInterval = require('./model/HourInterval')
const InHourInterval = require('./model/InHourInterval')
const Filter = require('./model/Filter')
const Client = require('./model/Client')
const Signalist = require('./model/Signalist')
const ClientSignalPassthrough = require('./model/ClientSignalPassthrough')
const ClientSignalParameters = require('./model/ClientSignalParameters')
const ClientSignal = require('./model/ClientSignal')
const ClientGroup = require('./model/ClientGroup')
const MulticlientSignalPassthrough = require('./model/MulticlientSignalPassthrough')
const MulticlientSignal = require('./model/MulticlientSignal')
const ClientRequest = require('./model/ClientRequest')
const MulticlientRequest = require('./model/MulticlientRequest')
const Signal = require('./model/Signal')
const SignalistRequest = require('./model/SignalistRequest')
const ReceptionServer = require('./model/ReceptionServer')

const instance = process.argv[2]//slowpoke
const dburl = process.argv[3]//'mongodb://178.128.12.94:27017/mongotest'
const {transports, createLogger, format} = require('winston')
require('winston-mongodb')
const logger = createLogger({
    format: format.combine(
        format.label({label: `${instance}`}),
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console({
            handleExceptions: true
        }),
        new transports.File({ 
            filename: 'error.log', 
            level: 'error' 
        }),
        new transports.MongoDB({
            db: dburl
        })
    ]
})

const dgram = require('dgram')
const cluster = require('cluster')
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
assert = require('assert');

const applyClientFilters = require('./logic/applyClientFilters')
const processSignal = require('./logic/processSignal')
const processSignalistRequestPerClient = require('./logic/processSignalistRequestPerClient')
const processSignalistRequestPerClientGroup = require('./logic/processSignalistRequestPerClientGroup')

class Cache {
    /**
     * @param {string} [url] Url to connect to database
     * @param {String} [name] Name of the instance of reception server
     */
    constructor(url, name) {
        ///** @type {Client[]} */
        // this.clients = []

        /** @type {Map<String,Client>} */
        this.clientsById = new Map()

        /** @type {Signalist[]} */
        // this.signalists = []

        /** @type {Map<String,Signalist>} */
        this.signalistsByLogin = new Map()

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

        logger.info(`worker ${process.pid} instatiate ${typeof(this)} from db ${url}`)
        MongoClient.connect(url, {
            useNewUrlParser: true
        }).then(client => {
            this.db = client.db()
            this.db.collection('ReceptionServers').watch({ 
                fullDocument: "updateLookup" 
            }).on('change', data => {
                if (data && data.fullDocument && data.fullDocument.name == name) {
                    this.handleReceptionServer(fullDocument)
                }
            })
            this.db.collection('Signalists').watch({ 
                fullDocument: "updateLookup" 
            }).on('change', data => {
                if (data && data.fullDocument) {
                    this.handleSignalist(fullDocument)
                }
            })
            this.db.collection('Clients').watch({ 
                fullDocument: "updateLookup" 
            }).on('change', data => {
                if (data && data.fullDocument) {
                    this.handleClient(fullDocument)
                }
            })
            this.db.collection('ReceptionServers').findOne({ 
                name: name 
            }).then(data => {
                logger.info(`worker ${process.pid} extracting initial value`)
                this.handleReceptionServer(data)
            }).catch(error => {
                logger.info(`worker ${process.pid} error while extracting initial value`)
                logger.error(error.stack)
            })
            
        }).catch(error => {
            logger.info(`worker ${process.pid} error while connecting ${url}`)
            logger.error(error.stack)
        })
    }

    /** @param {ReceptionServer} data - update state according */
    handleReceptionServer(data) {
        this.ports = data.ports
        this.tokens = data.serviceTokens
        this.urlOfBinary = config.urlOfBinary
        this.signalistsByLogin.clear()
        this.clientsById.clear()
        
        data.signalistIds.forEach(signalistId => {
            this.db.collection('Signalists').findOne({ _id: signalistId}).then(data => {
                this.handleSignalist(data)
            }).catch(error => {
                logger.error(`Error during extracting of signalist ${signalistId} ${error.stack}`)
            })
        })

        this.onportschange(this.ports)
        this.onservicetokenschange(this.tokens)
    }

    /** @param {Signalist} data - update state according */
    handleSignalist(data) {
        this.signalistsByLogin.set(signalist.login, signalist)
        data.clientIds.forEach(clientId => {
            this.db.collection('Clients').findOne({_id: clientId}).then(data => {
                this.handleClient(data)
            }).catch(error => {
                logger.error(`Error during extracting of client ${clientId} ${error.stack}`)
            })
        })
    }

    /** @param {Client} data - update state according */
    handleClient(data) {
        this.clientsById.set(data._id, data)
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
                    logger.info(`Worker ${process.pid} pushed SignalistRequest`)
                }).catch(error => {
                    logger.error(`Worker ${process.pid} error while pushing SignalistRequest`)
                    logger.error(error.stack)
                })
            }
            else if (MulticlientRequest.prototype.isPrototypeOf(value)) {
                /** @type {MulticlientRequest} */
                var multiclientRequest = value
                this.db.collection('MulticlientRequests').insertOne(multiclientRequest).then(() => {
                    logger.info(`Worker ${process.pid} pushed MulticlientRequest`)
                }).catch(error => {
                    logger.error(`Worker ${process.pid} error while pushing MulticlientRequest`)
                    logger.error(error.stack)
                })
            }
            else if (value.msg_type) {
                this.db.collection('BinaryResponses').insertOne(value).then(() => {
                    logger.info(`Worker ${process.pid} pushed BinaryResponse`)
                }).catch(error => {
                    logger.error(`Worker ${process.pid} error while pushing BinaryResponse`)
                    logger.error(error.stack)
                })
            }
            else {
                logger.error(`Worker ${process.pid} can not push ${typeof(value)}`)
                // logger.error(value)
            }
        }
        catch (error) {
            logger.error(`Worker ${process.pid} error while pushing ${typeof(value)}`)
            logger.error(error.stack)
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

    /**
     * @description create and open socket connection
     * @param {Cache} cache 
     */
    open(cache) {
        this.adaptee = new WebSocket(cache.urlOfBinary)
        this.adaptee.on('close', (code, reason) => {
            logger.info(`Worker ${process.pid} ws ${this.token} closed with ${code} ${reason}`)
            if (this.heartbeating) {
                clearTimeout(this.heartbeating);
            }
            if (code == 1000) {
                //expected close code
            }
            else {
                this.open(cache)
            }
        })
        this.adaptee.on('error', error => {
            logger.error(`Worker ${process.pid} ws ${this.token} error`)
            logger.error(error.stack)
        })
        this.adaptee.on('upgrade', request => {
            logger.info(`Worker ${process.pid} ws ${this.token} upgrade`)
        })
        this.adaptee.on('message', buffer => {
            try {
                logger.info(`Worker ${process.pid} ws ${this.token} message`)
                const echo = JSON.parse(buffer)
                echo.timestamp = Date.now()
                cache.push(echo)
            }
            catch (error) {
                logger.error(`Worker ${process.pid} ws ${this.token} cannot parse message`)
                logger.error(error.stack)
            }
        })
        this.adaptee.on('open', () => {
            logger.info(`Worker ${process.pid} ws ${this.token} open`)
            this.heartbeat()
            this.heartbeating = setInterval(() => this.heartbeat(), 15000)
            this.authorize()
        })
        this.adaptee.on('unexpected-response', (request, response) => {
            logger.info(`Worker ${process.pid} ws ${this.token} unexpected-response`)
            logger.info(JSON.stringify(request))
            logger.info(JSON.stringify(response))
        })
        this.adaptee.on('ping', buffer => {
            logger.info(`Worker ${process.pid} ws ${this.token} ping`)
        })
        this.adaptee.on('pong', buffer => {
            logger.info(`Worker ${process.pid} ws ${this.token} pong`)
        })
    }
}

if (cluster.isMaster) {
    logger.info(`Master ${process.pid} is running`);

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork()
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.info(`worker ${worker.process.pid} died`)
        cluster.fork()
    })

} else {
    logger.info(`Worker ${process.pid} started`)
    const cache = new Cache(dburl, instance)

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
                wsClient.open(cache)
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
                    logger.info(`Worker ${process.pid} received message`)
                    const signalistRequest = processSignal(cache.signalists, buffer)
                    cache.push(signalistRequest)
                    if (signalistRequest.error) {
                        logger.info(`Worker ${process.pid} error during message parsing`)
                        logger.info(signalistRequest)
                    }
                    else {
                        logger.info(`Worker ${process.pid} parsing successful`)
                        const signalist = cache.signalists.find(signalist => { return signalist._id == signalistRequest.signalistId })

                        /** @type {ClientGroup[]} */
                        var groups = []

                        logger.info(`Worker ${process.pid} grouping clients`)
                        // logger.info(JSON.stringify(signalist))
                        for (var j = 0; j < signalist.clientIds.length; j++) {
                            var clientId = signalist.clients[j]
                            var client = cache.clientsById.get(clientId)
                            if (applyClientFilters(client.filters, signalist._id))
                            var group = groups.find(g => { return g.amount === client.amount && g.currency === client.currency})
                            if (group) {
                                group.clients.push(client)                                
                            }
                            else {
                                group = new ClientGroup()
                                group.amount = client.amount
                                group.currency = client.currency
                                group.clients = [client]
                                groups.push(group)
                            }
                        }

                        for (var k = 0; k < groups.length; k++) {
                            var group = groups[k];

                            const multiclientRequest = processSignalistRequestPerClientGroup(group, signalistRequest)
                            multiclientRequest.requested = Date.now()
                            console.debug(multiclientRequest)
                            cache.push(multiclientRequest)
                            if (multiclientRequest.error) {
                                logger.info(`Worker ${process.pid} error during creating of multiclient request`)
                                // logger.info(JSON.stringify(multiclientRequest))
                            }
                            else {
                                logger.info(`Worker ${process.pid} created multiclient request`)
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
                                    logger.info(`Worker ${process.pid} ws ${wsClients[prevSocketIndex].token} sent request for client ${client._id}`)
                                }
                                else {
                                    logger.error(`Worker ${process.pid} cannot sent request all web sockets are not ready`)
                                }
                            }
                        }
                        
                    }
                })
                server.on('listening', () => {
                    logger.info(`Worker ${process.pid} start listening ${port}`)
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
                    logger.info(`Worker ${process.pid} stop listening ${oldPort}`)
                })
                servers[oldPort] = undefined
            }
        }
        // save ports
        ports = Object.keys(servers).filter(server => servers[server])
    })

}