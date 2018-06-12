const MongoClient = require('mongodb').MongoClient;
const fs = require('fs')
const bots = [
    'bot1',
	'bot2',
	'bot3',
	'bot4',
	'bot5',
	'bot6',
	'bot7',
	'bot8'
]
const path = 'stats.csv'
const start = new Date('2018-06-06T21:19:00+03:00')
const end = new Date('2018-06-06T21:30:00+03:00') 
const url = 'mongodb://195.201.98.20:27017/mongotest'
var progress = 0
var report = {}
var lines = []
finalize = function () {
    var header1 = 'signalId,avgBroadcasting,avgSending,avgReturning'
    var header2 = ',,,'
    bots.forEach(botId => {
        header1 += `,${botId},${botId},${botId}`
        header2 += ',Broadcasting,Sending,Returning'
    }, this)
    fs.writeFile(path, `${header1}\n${header2}\n`, function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
    for (var signalId in report) {
        const tuple = {
            signalId: signalId,
            avgTransmition: 0,
            transmittedQty: 0,
            avgParsing: 0,
            parsedQty: 0,
            avgReturning: 0,
            returnedQty: 0
        }
        var suffix = ''
        const botStats = report[signalId].botStats
        for (var botId in botStats) {
            const botStat = botStats[botId]
            if (botStat && botStat.transmition != undefined) {
                tuple.avgTransmition += botStat.transmition
                tuple.transmittedQty++
                suffix += `,${botStat.transmition}`
            }
            else {
                suffix += ',n/a'
            }
            if (botStat && botStat.parsing != undefined) {
                tuple.avgParsing += botStat.parsing
                tuple.parsedQty++
                suffix += `,${botStat.parsing}`
            }
            else {
                suffix += ',n/a'
            }
            if (botStat && botStat.returning != undefined) {
                tuple.avgReturning += botStat.returning
                tuple.returnedQty++
                suffix += `,${botStat.returning}`
            }
            else {
                suffix += ',n/a'
            }
        }
        if (tuple.transmittedQty != 0) {
            tuple.avgTransmition /= tuple.transmittedQty
        }
        else {
            tuple.avgTransmition = 'n/a'
        }

        if (tuple.parsedQty != 0) {
            tuple.avgParsing /= tuple.parsedQty
        }
        else {
            tuple.avgParsing = 'n/a'
        }

        if (tuple.returnedQty != 0) {
            tuple.avgReturning /= tuple.returnedQty
        }
        else {
            tuple.avgReturning = 'n/a'
        }
        fs.appendFile(path, `${signalId},${tuple.avgTransmition},${tuple.avgParsing},${tuple.avgReturning}${suffix}\n`, function (err) {
            if (err) throw err
        })
    }
}

MongoClient.connect(url, { useNewUrlParser: true }).then( connection => {
    const db = connection.db();
    const whereReceivedOnBetween = {receivedOn: {$gt: start.getTime(), $lt: end.getTime()}}
    db.collection('Signals').count(whereReceivedOnBetween).then(count => {
        var processed = 0
        const expected = count * bots.length
		console.log(`expected ${expected}`)
        db.collection('Signals').find(whereReceivedOnBetween, {signalId: 1, receivedOn: 1}).toArray((error, signals) => {
            if (error) {
                console.debug(error)
            }
            else {
                signals.forEach(signal => {
                    report[signal.signalId] = {
                        signalId: signal.signalId,
                        botStats: {}
                    }
                    bots.forEach(function(botId) {
                        report[signal.signalId].botStats[botId] = {}
                        const whereSignalIdAndBotId = { 'outboundMessage.passthrough.botId': botId, 'outboundMessage.passthrough.signalId': signal.signalId }
                        // const whereSignalIdAndBotId = {'outboundMessage.passthrough.signalId': signal.signalId, 'outboundMessage.passthrough.botId': botId}
                        db.collection('ClientRequests').findOne(whereSignalIdAndBotId, {receivedOn: 1, parsedOn: 1 }).then(request => {
                            const whereSignalIdAndBotIdBinary = { 'passthrough.botId': botId, 'passthrough.signalId': signal.signalId }
                            db.collection('BinaryResponses').findOne(whereSignalIdAndBotIdBinary, {receptionServerReceivedOn: 1}).then(response => {
                                processed++
                                var tuple = {
                                    signalId: signal.signalId,
                                    botId: botId,
                                    started: signal.receivedOn,
                                    transmition: 0,
                                    parsing: 0,
                                    binary: 0
                                }
                                if (request && request.parsedOn) {
                                    tuple.transmitted = request.receivedOn
                                    tuple.parsed = request.parsedOn
                                    tuple.transmition = request.receivedOn - tuple.started
                                    tuple.parsing = tuple.parsed - tuple.transmitted
                                }
                                // else {
                                //     tuple.transmition = 'miss'
                                //     tuple.parsing = 'miss'
                                // }
                                if (response && response.returnedFromBinaryOn) {
                                    tuple.returned = response.returnedFromBinaryOn
                                    tuple.returning = tuple.returned - tuple.parsed
                                }
                                // else {
                                //     tuple.returning = 'miss'
                                // }
                                // console.debug(tuple)                                
                                console.log(`${tuple.transmition} ${tuple.parsing} ${tuple.binary}`)
                                report[tuple.signalId].botStats[tuple.botId] = {
                                    signalId: tuple.signalId,
                                    botId: tuple.botId,
                                    started: tuple.started,
                                    transmitted: tuple.transmitted,
                                    transmition: tuple.transmition,
                                    parsed: tuple.parsed,
                                    parsing: tuple.parsing,
                                    returned: tuple.returned,
                                    returning: tuple.returning
                                }
                                //console.debug(report[tuple.signalId].botStats[tuple.botId])
								//console.log(processed / expected)
                                if (processed == expected) {
                                    finalize()
                                    // console.debug(report['0ac842d4-99d8-47a0-8013-de22eb6d34a6'].botStats['d8f3e120-ba1c-4553-9f64-f9e8c48528eb'])
                                }
                            }).catch(error => { console.debug(error) })
                        }).catch(error => { console.debug(error) })
                    }, this)
                })
            }
        }, this);
    }).catch(error => { 
        console.debug(error)
    })

    // db.collection('Signals').find({receivedOn: {$gt: start.getTime(), $lt: end.getTime()}}, {signalId: 1, receivedOn: 1}).toArray((error, signals) => {
    //     var i = 0
    //     signals.forEach(signal => {
    //         report[signal.signalId] = {
    //             signalId = signal.signalId,
    //             receivedOn = signal.receivedOn
    //         } 

    //         bots.forEach((botId) => {
    //             const findByBotIdAndSignalId = { 'outboundMessage.passthrough.botId': botId, 'outboundMessage.passthrough.signalId': signal.signalId }                
    //             const selectReceivedOnParsedOn = {receivedOn: 1, parsedOn: 1 }
                
    //         }, this)
    //         i++
    //     }, this)
    //     console.log(`signals * bots = ${i}`)
    // })
}).catch(error => {
    console.debug(error)
});

//setTimeout(() => {process.exit()}, 5000)

