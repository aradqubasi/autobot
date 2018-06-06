const MongoClient = require('mongodb').MongoClient;
const bots = [
    'd8f3e120-ba1c-4553-9f64-f9e8c48528eb',
    '',
    ''
]
const start = new Date('2018-06-04T22:20:00+03:00')
const end = new Date('2018-06-04T22:20:59+03:00') 

MongoClient.connect('mongodb://localhost:27017/mongotest', { useNewUrlParser: true }).then( connection => {
    const db = connection.db();
    db.collection('Signals').distinct('signalId', {receivedOn: {$gt: start.getTime(), $lt: end.getTime()}}).then(result => {
        var i = 0
        result.forEach(function(signal) {
            i++
        }, this);
        console.log(`ttl ${i}`)
    }).catch(error => { 
        console.debug(error)
    })

    db.collection('ClientRequests').distinct('_id').then(result => {
        console.log(`ttl requests ${result.length}`)
    }).catch(error => {
        console.debug(error)
    })


    var report = []
    db.collection('Signals').find({receivedOn: {$gt: start.getTime(), $lt: end.getTime()}}, {signalId: 1, receivedOn: 1}).toArray((error, signals) => {
        var i = 0
        signals.forEach(async signal => {
            const stat = {
                avgBroadcastTime: 0,
                avgSendTime: 0,
                avgTotalTime: 0,
                requests: {},
                responses: {}
            }
            const receptionServerReceivedOn = signal.receivedOn
            let r = await (async () => {
                for (var index = 0; index < bots.length; index++) {
                    var bot = array[index];
                    const findByBotIdAndSignalId = { 'outboundMessage.passthrough.botId': botId, 'outboundMessage.passthrough.signalId': signal.signalId }                
                    const selectReceivedOnParsedOn = {receivedOn: 1, parsedOn: 1 }

                    let request = await db.collection('ClientRequests').findOne(findByBotIdAndSignalId, selectReceivedOnParsedOn)
                    console.debug(request)
                    if (request) {
                        const clientBotReceivedOn = request.receivedOn
                        const clientBotSentOn = request.parsedOn
                        stat.requests[botId] = {
                            broadcastTime: clientBotReceivedOn - receptionServerReceivedOn,
                            sendTime: clientBotSentOn - receptionServerReceivedOn
                        }
                    }

                    // db.collection('ClientRequests').findOne(findByBotIdAndSignalId, selectReceivedOnParsedOn).then(request => {
                    //     if (request) {
                    //         const clientBotReceivedOn = request.receivedOn
                    //         const clientBotSentOn = request.parsedOn
                    //         //stuff
                    //         stat.requests[botId] = {
                    //             broadcastTime: clientBotReceivedOn - receptionServerReceivedOn,
                    //             sendTime: clientBotSentOn - receptionServerReceivedOn
                    //         }
                    //     }
                    //     else {
                    //         //stuff
                    //     }
                    // }).catch(error => { 
                    //     console.debug(error) 
                    // })
                    const selectReturnedFromBinaryOn = {returnedFromBinaryOn: 1}
                    db.collection('BinaryResponse').findOne(findByBotIdAndSignalId, selectReturnedFromBinaryOn).then(response => {
                        if (response) {
                            const returnedFromBinaryOn = response.returnedFromBinaryOn
                            //stuff
                            stat.responses[botId] = {
                                totalTime: returnedFromBinaryOn - receptionServerReceivedOn
                            }
                        }
                        else {
                            //stuff
                        }
                    }).catch(error => { console.debug(error) })
                    i++    
                }
                return 1
            })
            console.debug(r)
            var requests = 0
            var responses = 0
            bots.forEach(botId => {
                if (stat.requests[botId]) {
                    stat.avgBroadcastTime += stat.requests[botId].broadcastTime
                    stat.avgSendTime += stat.requests[botId].sendTime
                    requests++
                }
                if (stat.responses[botId]) {
                    stat.avgTotalTime += stat.responses[botId].totalTime
                    responses++
                }
            }, this)
            stat.avgBroadcastTime /= Math.max(1, requests)
            stat.avgSendTime /= Math.max(1, requests)
            stat.avgTotalTime /= Math.max(1, responses)
            console.log(`${signal.signalId} avgBroadcastTime: ${stat.avgBroadcastTime}; avgSendTime: ${stat.avgSendTime}; avgTotalTime: ${stat.avgTotalTime}`)
        }, this)
        console.log(`signals * bots = ${i}`)
    })
    // .then(signals => {

    // }).catch(error => {
    //     error.alarm = 'no signals, bro'
    //     console.debug(error)
    // })
}).catch(error => {
    console.debug(error)
});

setTimeout(() => {process.exit()}, 2000)