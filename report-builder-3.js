var Db = require('mongodb').Db,
MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
ReplSetServers = require('mongodb').ReplSetServers,
ObjectID = require('mongodb').ObjectID,
Binary = require('mongodb').Binary,
GridStore = require('mongodb').GridStore,
Grid = require('mongodb').Grid,
Code = require('mongodb').Code,

Client = require('./model/Client'),
ClientGroup = require('./model/ClientGroup'),
ClientSignal = require('./model/ClientSignal'),
ClientSignalParameters = require('./model/ClientSignalParameters'),
ClientSignalPassthrough = require('./model/ClientSignalPassthrough'),
MulticlientRequest = require('./model/MulticlientRequest'),
MulticlientSignal = require('./model/MulticlientSignal'),
MulticlientSignalPassthrough = require('./model/MulticlientSignalPassthrough'),
ReceptionServer = require('./model/ReceptionServer'),
Signal = require('./model/Signal'),
Signalist = require('./model/Signalist'),
SignalistRequest = require('./model/SignalistRequest')

const WebSocket = require('ws')
const fs = require('fs')


/**
 * @description get signalists requests
 * @param {Db} db mongo db connection
 * @param {Number} start epoch start time
 * @param {Number} end epoch end time
 * @returns {Promise<SignalistRequest[]>}
 */
async function getSignalistRequests(db, start, end) {
    return new Promise((resolve, reject) => {
        console.log(`getSignalistRequests db: ${db.databaseName} start ${start} end ${end}`)
        db.collection('SignalistRequests')
        .find({received: {$gt:start, $lt: end}})
        .toArray((error, result) => {
            if (error) {
                console.debug(error)
                reject(error)
            }
            else {
                resolve(result)
            }
        })
    })
}


/**
 * @description get multiclient requests
 * @param {Db} db mongo db connection
 * @param {Number} start epoch start time
 * @param {Number} end epoch end time
 * @returns {Promise<MulticlientRequest[]>}
 */
async function getMulticlientRequests(db, start, end) {
    return new Promise((resolve, reject) => {
        console.log(`getMulticlientRequests db: ${db.databaseName} start ${start} end ${end}`)
        db.collection('MulticlientRequests')
        .find({requested: {$gt:start, $lt: end}})
        .toArray((error, result) => {
            if (error) {
                console.debug(error)
                reject(error)
            }
            else {
                resolve(result)
            }
        })
    })
}



/**
 * @typedef BinaryResponsesResult
 * @property {Number} purchase_time - Epoch time w/ milisends of purchase
 * @property {String} token - token which was used for transaction
 */
/**
 * @typedef BinaryResponsesResultWrap
 * @property {BinaryResponsesResult[]} result
 */
/**
 * @typedef BinaryResponsesPassthrough 
 * @property {String} multiclientSignalId - 1
 */
/**
 * @typedef BinaryResponseShort
 * @property {Number} timestamp - epoc time of confirmation by binary
 * @property {BinaryResponsesPassthrough} passthrough - 1
 * @property {BinaryResponsesResultWrap} buy_contract_for_multiple_accounts - wrapper of results collection
 */
/**
 * @description get clientprofit requests
 * @param {Db} db mongo db connection
 * @param {Number} start epoch start time
 * @param {Number} end epoch end time
 * @returns {Promise<BinaryResponseShort[]>}
 */
async function getBinaryResponses(db, start, end) {
    return new Promise((resolve, reject) => {
        console.log(`getBinaryResponses db: ${db.databaseName} start ${start} end ${end}`)
        db.collection('BinaryResponses')
        .find({timestamp: {$gt:start, $lt: end}, msg_type: 'buy_contract_for_multiple_accounts'})
        .toArray((error, result) => {
            if (error) {
                console.debug(error)
                reject(error)
            }
            else {
                resolve(result)
            }
        })
    })
}


/**
 * @typedef {Object} ClientProfitShort short version of profit table
 * @property {String} token - client token, used to get profit table
 * @property {Number} sell_time - epoch time of sell
 */
/**
 * @description get clientprofit requests
 * @param {Db} db mongo db connection
 * @param {Number} start epoch start time
 * @param {Number} end epoch end time
 * @returns {Promise<ClientProfitShort[]>}
 */
async function getClientProfitsShort(db, start, end) {
    return new Promise((resolve, reject) => {
        console.log(`getClientProfitsShort db: ${db.databaseName} start ${start} end ${end}`)
        db.collection('ClientProfits')
        .find({})
        .toArray((error, result) => {
            if (error) {
                console.debug(error)
                reject(error)
            }
            else {
                var shorty = result.map(value => {
                    if (value && value.token && value.profit_table && value.profit_table.sell_time && !isNaN(value.profit_table.sell_time)) {
                        return {
                            token: value.token,
                            sell_time: Number(value.profit_table.sell_time)
                        }
                    }
                })
                resolve(result)
            }
        })
    })
}

function GetPath() {
    const now = new Date()
    const MM = now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : '' + (now.getMonth() + 1)
    const dd = now.getDate() < 10 ? '0' + now.getDate() : '' + now.getDate()
    const hh = now.getHours() < 10 ? '0' + now.getHours() : '' + now.getHours()
    const mm = now.getMinutes() < 10 ? '0' + now.getMinutes() : '' + now.getMinutes()
    const ss = now.getSeconds() < 10 ? '0' + now.getSeconds() : '' + now.getSeconds()
    const path = `profit_${now.getFullYear()}${MM}${dd}_${hh}${mm}${ss}.csv`
    return path
}

async function Append(path, line) {
    return new Promise((resolve, reject) => {
        fs.appendFile(path, line + '\n', function (error) {
            if (error) {
                reject(error)
            }
            else {
                resolve(true)
            }
        })             
    })
}

async function ProfitTable(binary, mongo, start, end, bots) {
    console.log('start')
    
    try {
        const db = (await MongoClient.connect(mongo, {useNewUrlParser: true})).db()

        const signalistRequests = await getSignalistRequests(db, start, end)

        const requests = await getMulticlientRequests(db, start, end)

        const responses = await getBinaryResponses(db, start, end)

        // const profits = await getClientProfitsShort(db, start, end)

        // console.log(`signalistRequests ${signalistRequests.length} requests ${requests.length} responses ${responses.length} profits ${profits.length}`)
        console.log(`signalistRequests ${signalistRequests.length} requests ${requests.length} responses ${responses.length} profits ${'n/a'}`)
        

        /**
         * @typedef {Object} ClientSignalStatistic
         * @property {String} Token - token
         * @property {Number} Sent - Epoc time of sending to binary
         * @property {Number} Confirmed - Epoc time of getting confirmation from binary
         * @property {Number} Selled - Epoc time of selling
         */
        /**
         * @typedef {Object} SignalStatistic
         * @property {String} SignalId - Id of SignalRequest
         * @property {Number} Received - Epoc time of reception on reception server
         * @property {Map<String,ClientSignalStatistic>} StatsByToken - statistics by token
         */
        /** @type {Map<String,SignalStatistic>} */
        var tuples = new Map()
        for (var i = 0; i < signalistRequests.length; i++) {
            var signalistRequest = signalistRequests[i]

            /** @type {SignalStatistic} */
            const tuple = {}

            tuple.SignalId = signalistRequest._id
            tuple.Received = new Date(signalistRequest.received).getTime()
            tuple.StatsByToken = new Map()
            
            for (var j = 0; j < bots.length; j++) {
                /** @type {String} */
                var token = bots[j];
                /** @type  {ClientSignalStatistic}*/
                var clientStat = {}
                clientStat.Token = token


                const request = requests.find(r => {
                    return r.signalId == tuple.SignalId && r.multiclientSignal.tokens.some(tkn => {
                        return tkn == clientStat.Token
                    })
                })
                clientStat.Sent = request && request.requested ? request.requested : -1


                if (request == null) {
                    clientStat.Confirmed = -1
                    clientStat.Selled = -1
                    tuple.StatsByToken.set(clientStat)
                    continue
                }
                const response = responses.find(r => {
                    return r.passthrough && r.passthrough.multiclientSignalId && r.passthrough.multiclientSignalId == request._id
                })
                clientStat.Confirmed = response && response.timestamp ? response.timestamp : -1


                if (response == null) {
                    clientStat.Selled = -1
                    tuple.StatsByToken.set(clientStat)
                    continue
                }
                const result = response.buy_contract_for_multiple_accounts.result.find(r => {
                    return r.token == clientStat.Token
                })
                clientStat.Selled = result && result.purchase_time ? result.purchase_time * 1000 : -1

                // const profit = profits.find(p => {
                //     return p.token == clientStat.Token && Math.abs(p.sell_time * 1000 - clientStat.Sent) < 5000
                // })
                // clientStat.Selled = profit && profit.sell_time ? profit.sell_time * 1000 : -1

                tuple.StatsByToken.set(token, clientStat)
            }

            // console.debug(tuple)
            tuples.set(tuple.SignalId, tuple)
        }

        const path = GetPath()
        var header1 = 'SignalId;Received;Average Sending;Average Confirming;Average Delay;'
        var header2 = ';;;;;'
        for (var j = 0; j < bots.length; j++) {
            header1 = header1 + bots[j] + ';;;'
            header2 = header2 + 'Sending;Confirmation;Purchase Time;'
        }
        await Append(path, header1)
        await Append(path, header2)

        for (var [signalId, signalStats] of tuples) {
            if (signalId == null) {
                console.log('signalId is null')
                console.debug(signalStats)
                continue
            }

            var minPurchaseTime = Number.MAX_SAFE_INTEGER
            var maxPurchaseTime = Number.MIN_SAFE_INTEGER
            var qtyPurchaseTime = 0
            var avgPurchaseTime = 0

            var avgSending = 0
            var qtySending = 0

            var avgConfirming = 0
            var qtyConfirming = 0

            var line = ''
            for (var [token, tokenStat] of signalStats.StatsByToken) {

                if (tokenStat == null) {
                    console.debug(signalStats)
                    continue
                }

                if (tokenStat.Sent == -1) {
                    line += `${'n/a'};`
                }
                else {
                    avgSending += tokenStat.Sent - signalStats.Received
                    qtySending++
                    line += `${tokenStat.Sent - signalStats.Received};`
                }

                if (tokenStat.Confirmed == -1) {
                    line += `${'n/a'};`
                }
                else {
                    avgConfirming += tokenStat.Confirmed - signalStats.Received
                    qtyConfirming++
                    line += `${tokenStat.Confirmed - signalStats.Received};`
                }

                if (tokenStat.Selled == -1) {
                    line += `${'n/a'};`
                }
                else {
                    minPurchaseTime = minPurchaseTime > tokenStat.Selled ? tokenStat.Selled : minPurchaseTime
                    maxPurchaseTime = maxPurchaseTime < tokenStat.Selled ? tokenStat.Selled : maxPurchaseTime
                    avgPurchaseTime += tokenStat.Selled
                    qtyPurchaseTime++
                    line += `${new Date(tokenStat.Selled).toISOString()};`
                }
            }
            avgSending = qtySending == 0 ? -1 : avgSending / qtySending
            avgConfirming = qtyConfirming == 0 ? -1 : avgConfirming / qtyConfirming
            avgPurchaseTime = qtyPurchaseTime == 0 ? -1 :avgPurchaseTime / qtyPurchaseTime
            const delay = minPurchaseTime != Number.MAX_SAFE_INTEGER && maxPurchaseTime != Number.MIN_SAFE_INTEGER ? maxPurchaseTime - minPurchaseTime : 'n/a'
            line = `${signalStats.SignalId};${new Date(signalStats.Received).toISOString()};${avgSending};${avgConfirming};${delay};` + line
            // console.log(line)
            await Append(path, line)
        }
    }
    catch (error) {
        console.debug(error)
    }

    console.log('done')
    process.exit()
}

const wsurl = 'wss://ws.binaryws.com/websockets/v3?app_id=1'
const dburl = 'mongodb://178.128.12.94:27017/mongotest'
const start = (new Date('2018-07-25T00:30:00.000+03:00')).getTime()
const end = (new Date('2018-07-27T06:30:00.000+03:00')).getTime()
const tokens = [
    'y64zivPOMCOK4vB', 'texSaMIEYAQ9VtH', '4v7SjpBVS5LaGvi', '3wC8enZlKXdY89c', 'nfhDA6K47pTiUrI',
    '6l3bHYYUUIz5ABQ', 'xGI0OANbngry3Ca', 'YQmlRBTYAXAs83h', 'lbWymdYoEKSrA9X', 'z6272FfCB9YOoq9',
    '4OwrbE3Fuge7WHe', 'Gqxlpueb2Ac184V', 'U2UbkkUGFpNWmPc', 'eHlqUl1lXl1Efm5', '3hKz4vhnvUJXk63',
    'AfkNKAb7wUlPaL6', 'RUdoFBNdkCE0h6d', 'Q8UlTFNG8p8ZtaZ', 'fRTNU7vUlnbt0Hg', 'QTmMfEaoZjt4KoW'
]
ProfitTable(wsurl, dburl, start, end, tokens)
