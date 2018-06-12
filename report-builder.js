const MongoClient = require('mongodb').MongoClient;
const WebSocket = require('ws')
const fs = require('fs')

const url = {
    binary: 'wss://ws.binaryws.com/websockets/v3?app_id=1',
    mongo: 'mongodb://195.201.98.20:27017/mongotest'
}

const bots = {}
bots['bot1'] = {
    botId: 'bot1',
    token: 'y64zivPOMCOK4vB'
}
bots['bot2'] = {
    botId: 'bot2',
    token: 'texSaMIEYAQ9VtH'
}
bots['bot3'] = {
    botId: 'bot3',
    token: '4v7SjpBVS5LaGvi'
}
bots['bot4'] = {
    botId: 'bot4',
    token: '3wC8enZlKXdY89c'
}
bots['bot5'] = {
    botId: 'bot5',
    token: 'nfhDA6K47pTiUrI'
}
bots['bot6'] = {
    botId: 'bot6',
    token: '6l3bHYYUUIz5ABQ'
}
bots['bot7'] = {
    botId: 'bot7',
    token: 'xGI0OANbngry3Ca'
}
bots['bot8'] = {
    botId: 'bot8',
    token: 'YQmlRBTYAXAs83h'
}
bots['bot9'] = {
    botId: 'bot9',
    token: 'lbWymdYoEKSrA9X'
}
bots['bot10'] = {
    botId: 'bot10',
    token: 'z6272FfCB9YOoq9'
}
// bots['bot11'] = {
//     botId: 'bot11',
//     token: '4OwrbE3Fuge7WHe'
// }
// bots['bot12'] = {
//     botId: 'bot12',
//     token: 'Gqxlpueb2Ac184V'
// }
// bots['bot13'] = {
//     botId: 'bot13',
//     token: 'U2UbkkUGFpNWmPc'
// }
// bots['bot14'] = {
//     botId: 'bot14',
//     token: 'eHlqUl1lXl1Efm5'
// }
// bots['bot15'] = {
//     botId: 'bot15',
//     token: '3hKz4vhnvUJXk63'
// }
// bots['bot16'] = {
//     botId: 'bot16',
//     token: 'AfkNKAb7wUlPaL6'
// }
// bots['bot17'] = {
//     botId: 'bot17',
//     token: 'RUdoFBNdkCE0h6d'
// }
// bots['bot18'] = {
//     botId: 'bot18',
//     token: 'Q8UlTFNG8p8ZtaZ'
// }
// bots['bot19'] = {
//     botId: 'bot19',
//     token: 'fRTNU7vUlnbt0Hg'
// }
// bots['bot20'] = {
//     botId: 'bot20',
//     token: 'QTmMfEaoZjt4KoW'
// }
// const start = 1528378200000//(new Date('2018-06-07T16:30:00.000+03:00')).getTime()
// const end = 1528399800000//(new Date('2018-06-07T22:30:00.000+03:00')).getTime()

const start = (new Date('2018-06-07T16:30:00.000+03:00')).getTime()
const end = (new Date('2018-06-08T20:30:00.000+03:00')).getTime()

async function ProfitTable(binary, mongo, start, end, bots) {
    console.log('start')
    
    try {
        const db = (await MongoClient.connect(mongo, {useNewUrlParser: true})).db()

        const signals = await ((db, start, end) => {
            return new Promise((resolve, reject) => {
                console.debug(start)
                console.debug(end)
                db.collection('Signals')
                .find({receivedOn: {$gt:start, $lt: end}})
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
        })(db, start, end)

        const requests = await ((db, start, end) => {
            return new Promise((resolve, reject) => {
                db.collection('ClientRequests')
                .find({receivedOn: {$gt: start, $lt: end}})
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
        })(db, start, end)

        const responses = await ((db, start, end) => {
            return new Promise((resolve, reject) => {
                db.collection('BinaryResponses')
                .find({returnedFromBinaryOn: {$gt: start, $lt: end}})
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
        })(db, start, end)

        // const ws = new WebSocket(url.binary)
        // await (() => {
        //     return new Promise((resolve, reject) => {
        //         ws.onopen = () => {
        //             resolve()
        //         }
        //         ws.onerror = error => {
        //             console.debug(error)
        //             reject(error)
        //         }
        //     })
        // })()

        var profits = []

        profits = await ((db) => {
            return new Promise((resolve, reject) => {
                db.collection('Profits')
                .find()
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
        })(db)

        console.log(`profits count is ${profits.length}`)

        // const botIds = Object.keys(bots)
        // for (var i = 0; i < botIds.length; i++) {
        //     var bot = bots[botIds[i]]

        //     await ((ws, token) => {
        //         return new Promise((resolve, reject) => {
        //             ws.onmessage = buffer => {
        //                 try {
        //                     const message = JSON.parse(buffer.data)
        //                     if (message.msg_type == 'authorize' && message.error == null) {
        //                         resolve(message)
        //                     }
        //                     else {
        //                         console.debug(error)
        //                         reject(message)
        //                     }
        //                 }
        //                 catch (error) {
        //                     console.debug(buffer)
        //                     reject(error)
        //                 }
        //             }
        //             ws.onerror = error => {
        //                 reject(error)
        //             }
        //             ws.send(JSON.stringify({ authorize: token }))
        //         })
        //     })(ws, bot.token)
            
        //     var offset = 0 
        //     const limit = 50 
        //     var profit
        //     do {
        //         profit = await ((ws, start, end, offset, limit) => {
        //             return new Promise((resolve, reject) => {
        //                 ws.onmessage = buffer => {
        //                     try {
        //                         const message = JSON.parse(buffer.data)
        //                         if (message && message.error) {
        //                             console.debug(message.error)
        //                             throw new Error(message.error)
        //                         }
        //                         else if (message && message.msg_type == 'profit_table') {
        //                             resolve(message)
        //                         }
        //                         else {
        //                             console.debug(message)
        //                             throw new Error('unregcognized message')
        //                         }
        //                     }
        //                     catch (error) {
        //                         console.debug(error)
        //                         reject(error)
        //                     }
        //                 }
        //                 ws.onerror = error => {
        //                     console.debug(error)
        //                     reject(error)
        //                 }
        //                 ws.send(JSON.stringify({
        //                     profit_table: 1,
        //                     description: 1,
        //                     limit: limit,
        //                     offset: offset,
        //                     date_from: start >= 10000000000 ? Math.floor(start / 1000) : start,
        //                     date_to: end >= 10000000000 ? Math.floor(end / 1000) : end,
        //                     sort: "DESC"
        //                 }))
        //             })
        //         })(ws, start, end, offset, limit)
        //         offset += limit
        //         if (profit && profit.profit_table && profit.profit_table.transactions) {
        //             for (var j = 0; j < profit.profit_table.transactions.length; j++) {
        //                 profits.push(profit.profit_table.transactions[j])
        //             }
        //         }
        //     }
        //     while (profit && profit.profit_table && profit.profit_table.count != 0)
        // }
        const tuples = []
        signals.forEach(function(signal) {
            Object.keys(bots).forEach(function(key) {
                const bot = bots[key]
                // console.debug(bot)
                const request = requests.find(request => 
                    request.outboundMessage
                    && request.outboundMessage.passthrough
                    && request.outboundMessage.passthrough.botId == bot.botId 
                    && request.outboundMessage.passthrough.signalId == signal.signalId
                )
                const response = responses.find(response => 
                    response.passthrough
                    && response.passthrough.botId == bot.botId 
                    && response.passthrough.signalId == signal.signalId
                )
                const tuple = {
                    signalId: '',
                    botId: '',
                    token: '',
                    receivedOn: 0,
                    transmittedOn: 0,
                    sendOn: 0,
                    transmitting: 0,
                    parsing: 0,
                    haveRequest: false,
                    confirmedOn: 0,
                    contract_id: 0,
                    transaction_id: 0,
                    confirming: 0,
                    haveResponse: false,
                    actualStartTime: 0,
                    actualEndTime: 0,
                    purchasingByBinaryClock: 0,
                    purchasingByAutobotClock: 0,
                    haveProfit: false
                }
                tuple.signalId = signal.signalId
                tuple.botId = bot.botId
                tuple.token = bot.token
                tuple.receivedOn = signal.receivedOn
                if (request) {
                    tuple.transmittedOn = request.receivedOn
                    tuple.sendOn = request.parsedOn
                    tuple.haveRequest = true
                    tuple.transmitting = request.receivedOn - signal.receivedOn
                    tuple.parsing = request.parsedOn - request.receivedOn
                }
                if (response) {
                    tuple.confirmedOn = response.returnedFromBinaryOn
                    tuple.contract_id = response.buy.contract_id
                    tuple.transaction_id = response.buy.transaction_id
                    tuple.haveResponse = true
                    tuple.confirming = tuple.haveRequest ? response.returnedFromBinaryOn - request.parsedOn : 0
                    tuple.purchasingByAutobotClock = Math.floor((response.returnedFromBinaryOn - signal.receivedOn) / 1000)
                }
                const profit = profits.find(profit => profit.contract_id == tuple.contract_id)
                if (profit) {
                    tuple.actualStartTime = profit.purchase_time
                    tuple.actualEndTime = profit.sell_time
                    tuple.haveProfit = true
                    tuple.purchasingByBinaryClock = profit.purchase_time - Math.floor(signal.receivedOn / 1000)
                }

                tuples.push(tuple)
            }, this);
        }, this);
        console.log(`${tuples.length}`)

        const now = new Date()
        const MM = now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : '' + (now.getMonth() + 1)
        const dd = now.getDate() < 10 ? '0' + now.getDate() : '' + now.getDate()
        const hh = now.getHours() < 10 ? '0' + now.getHours() : '' + now.getHours()
        const mm = now.getMinutes() < 10 ? '0' + now.getMinutes() : '' + now.getMinutes()
        const ss = now.getSeconds() < 10 ? '0' + now.getSeconds() : '' + now.getSeconds()
        const path = `profit_${now.getFullYear()}${MM}${dd}_${hh}${mm}${ss}.csv`
        console.log(path)
        var header1 = ',,,,,'
        var header2 = 'Сигнал,Т получения на сервере приема,avgTransmittingTime,avgParsingTime,avgConfirmingTime,avgDelay'
        for (var j = 0; j < Object.keys(bots).length; j++) {
            var botId = Object.keys(bots)[j]
            header1 += ',' + botId + ',,,,,,,,'
            header2 += ',T отправки на бинари,T начала,T окончания,t пересылки по ноду,t фильтров ноды,t обработки бинари,t сигнала по автоботу,t сигнала по бинари,t задержки'
        }
        await (() => new Promise((resolve, reject) => {
            fs.writeFile(path, `${header1}\n${header2}\n`, function (error) {
                if (error) {
                    reject(error)
                } 
                else {
                    resolve(true)
                }
            })
        }))()

        for (i = 0; i < signals.length; i++) {
            var signal = signals[i];
            var line = ''
            var avgTransmittingTime = 0
            var avgTransmittingQty = 0
            var avgParsingTime = 0
            var avgParsingQty = 0
            var avgConfirmingTime = 0
            var avgConfirmingQty = 0
            var avgDelayTime = 0.0
            var avgDelayQty = 0
            // var a = tuples.filter(tuple => tuple.signalId == signal.signalId && bots[tuple.botId])
            var minPurchaseByBinaryClock = tuples.filter(tuple => tuple.signalId == signal.signalId && bots[tuple.botId]).reduce((min, current) => { 
                return current.actualStartTime ? Math.min(min, current.actualStartTime) : min
            }, Number.MAX_SAFE_INTEGER)
            for (var j = 0; j < Object.keys(bots).length; j++) {
                var bot = bots[Object.keys(bots)[j]]
                const tuple = tuples.find(tuple => tuple.signalId == signal.signalId && tuple.botId == bot.botId)
                var send = ''
                var start = ''
                var end = ''
                var transmitting = ''
                var parsing = ''
                var confirming = ''
                var purchasingByAutobotClock = ''
                var purchasingByBinaryClock = ''
                var delay = ''

                if (tuple.haveRequest) {
                    send = (new Date(tuple.sendOn)).toISOString().split('T')[1]

                    transmitting = tuple.transmitting
                    avgTransmittingTime += tuple.transmitting
                    avgTransmittingQty++

                    parsing = tuple.sendOn - tuple.transmittedOn
                    avgParsingTime += tuple.sendOn - tuple.transmittedOn
                    avgParsingQty++
                }
                else {
                    send = 'n/a'
                    transmitting = 'n/a'
                    parsing = 'n/a'
                }

                if (tuple.haveResponse) {
                    purchasingByAutobotClock = Math.floor((tuple.confirmedOn - tuple.receivedOn) / 1000)
                }
                else {
                    purchasingByAutobotClock = 'n/a'
                }

                if (tuple.haveProfit) {
                    start = (new Date(tuple.actualStartTime * 1000)).toISOString().split('T')[1]
                    end = (new Date(tuple.actualEndTime * 1000)).toISOString().split('T')[1]
                    purchasingByBinaryClock = tuple.actualStartTime - Math.floor(tuple.receivedOn / 1000)
                    delay = tuple.actualStartTime - minPurchaseByBinaryClock
                    avgDelayTime += delay
                    avgDelayQty++
                }
                else {
                    start = 'n/a'
                    end = 'n/a'
                    purchasingByBinaryClock = 'n/a'
                    delay = 'n/a'
                }

                if (tuple.haveRequest && tuple.haveResponse) {
                    confirming = tuple.confirmedOn - tuple.sendOn
                    avgConfirmingTime += tuple.confirmedOn - tuple.sendOn
                    avgConfirmingQty++
                }
                else {
                    confirming = 'n/a'
                }

                // line += ',' + (tuple.haveRequest ? (new Date(tuple.sendOn)).toISOString().split('T')[1] : 'n/a')
                // line += ',' + (tuple.haveResponse ? (new Date(tuple.actualStartTime * 1000)).toISOString().split('T')[1] : 'n/a')
                // line += ',' + (tuple.haveProfit ? (new Date(tuple.actualEndTime * 1000)).toISOString().split('T')[1] : 'n/a')


                // line += ',' + (tuple.haveRequest && tuple.haveResponse ? tuple.confirming : 'n/a')
                // line += ',' + (tuple.haveResponse ? tuple.purchasingByAutobotClock : 'n/a')
                // line += ',' + (tuple.haveProfit ? tuple.purchasingByBinaryClock : 'n/a')

                line += `,${send},${start},${end},${transmitting},${parsing},${confirming},${purchasingByAutobotClock},${purchasingByBinaryClock},${delay}`
            }
            avgTransmittingTime = avgTransmittingQty != 0 ? Math.floor(avgTransmittingTime / avgTransmittingQty) : 'n/a'
            avgParsingTime = avgParsingQty != 0 ? Math.floor(avgParsingTime / avgParsingQty) : 'n/a'
            avgConfirmingTime = avgConfirmingQty != 0 ? Math.floor(avgConfirmingTime / avgConfirmingQty) : 'n/a'
            avgDelayTime = avgDelayQty != 0 ? avgDelayTime / avgDelayQty : 'n/a'
            line = `${signal.signalId},${(new Date(signal.receivedOn)).toISOString()},${avgTransmittingTime},${avgParsingTime},${avgConfirmingTime},${avgDelayTime}` + line + '\n'
            await (() => {
                return new Promise((resolve, reject) => {
                    fs.appendFile(path, line, function (error) {
                        if (error) {
                            reject(error)
                        }
                        else {
                            resolve(true)
                        }
                    })             
                })
            })()
        }
        // console.debug(tuples[0])
        // console.debug(profits[0])
        // console.debug(responses.filter(response => 
        //     response.passthrough
        //     && response.passthrough.signalId == 'd5b44d3e-277f-44ee-8fd4-fe5236dd5723'
        //     && response.passthrough.botId == 'bot1'
        // ))
        // console.debug(responses.find(response => 
        //     response.passthrough
        //     && response.passthrough.signalId == 'd5b44d3e-277f-44ee-8fd4-fe5236dd5723'
        //     && response.passthrough.botId == 'bot1'
        // ))
    }
    catch (error) {
        console.debug(error)
    }

    console.log('done')
    process.exit()
}

// async function ProfitTable(binary, mongo, start, finish) {
//     console.log('start')
    
//     try {
//         const db = (await MongoClient.connect(mongo, {useNewUrlParser: true})).db()
        
//         // const signals = await db.collection('Signals').find({ receivedOn: { $gt: Date.parse('2018-06-07T16:30:00.000+03:00') } })

//         const signals = await ((start, end) => {
//             return new Promise((resolve, reject) => {
//                 db.collection('Signals').find({receivedOn: {$gt: start, $lt: end}}).toArray((error, result) => {
//                     if (error) {
//                         reject(error)
//                     }
//                     else {
//                         resolve(result)
//                     }
//                 })
//             })
//         })(Date.parse('2018-06-07T16:30:00.000+03:00'), Date.parse('2018-06-07T17:30:00.000+03:00'))

//         var tuples = []

//         for (var i = 0; i < signals.length; i++) {
//             var signal = signals[i];
            
//             const botIds = Object.keys(bots)
//             for (var j = 0; j < botIds.length; j++) {
//                 var bot = bots[botIds[j]]
//                 const tuple = {
//                     signalId: '',
//                     botId: '',
//                     token: '',
//                     receivedOn: 0,
//                     transmittedOn: 0,
//                     sendOn: 0,
//                     confirmedOn: 0,
//                     actualStartTime: 0,
//                     actualEndTime: 0,
//                     contract_id: 0,
//                     transaction_id: 0
//                 }
//                 tuple.signalId = signal.signalId
//                 tuple.botId = bot.botId
//                 tuple.receivedOn = signal.receivedOn
//                 tuple.token = bot.token
                
//                 const request = await ((db, signalId, botId) => {
//                     return db
//                     .collection('ClientRequests')
//                     .findOne({ 
//                         'outboundMessage.passthrough.botId': botId, 
//                         'outboundMessage.passthrough.signalId': signalId 
//                     }, {
//                         receivedOn: 1, 
//                         parsedOn: 1
//                     })
//                 })(db, tuple.signalId, tuple.botId)
//                 if (request) {
//                     tuple.transmittedOn = request.receivedOn
//                     tuple.sendOn = request.parsedOn
//                 }

//                 const response = await((db, signalId, botId) => {
//                     return db
//                     .collection('BinaryResponses')
//                     .findOne({
//                         'passthrough.botId': botId,
//                         'passthrough.signalId': signalId
//                     })
//                 })(db, tuple.signalId, tuple.botId)
//                 if (response) {
//                     tuple.confirmedOn = response.returnedFromBinaryOn
//                     tuple.contract_id = response.buy.contract_id
//                     tuple.transaction_id = response.buy.transaction_id
//                 }

//                 console.debug(tuple)
//                 tuples.push(tuple)
//             }
//         }

//         // console.log(`${signals.length}`)

//         const ws = new WebSocket(url.binary)
//         await (() => {
//             return new Promise((resolve, reject) => {
//                 ws.onopen = () => {
//                     resolve()
//                 }
//                 ws.onerror = error => {
//                     reject(error)
//                 }
//             })
//         })()

//         var prev
//         for (var k = 0; k < tuples.length; k++) {
//             var tuple = tuples[k];
//             if ((prev == null) || (prev && prev.token != tuple.token)) {
//                 await ((ws, token) => {
//                     return new Promise((resolve, reject) => {
//                         ws.onmessage = buffer => {
//                             try {
//                                 const message = JSON.parse(buffer.data)
//                                 if (message.msg_type == 'authorize' && message.error == null) {
//                                     resolve(message)
//                                 }
//                                 else {
//                                     reject(message)
//                                 }
//                             }
//                             catch (error) {
//                                 console.debug(buffer)
//                                 reject(error)
//                             }
//                         }
//                         ws.onerror = error => {
//                             reject(error)
//                         }
//                         ws.send(JSON.stringify({ authorize: token }))
//                     })
//                 })(ws, tuple.token)
//             }

//             //do stuff
//         }

//     }
//     catch (error) {
//         console.debug(error)
//     }

//     console.log('done')
//     process.exit()
// }

ProfitTable(url.binary, url.mongo, start, end, bots)
