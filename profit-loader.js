const MongoClient = require('mongodb').MongoClient;
const WebSocket = require('ws')


// const db = (await MongoClient.connect('mongodb://195.201.98.20:27017/mongotest', {useNewUrlParser: true})).db()
// const db = (await MongoClient.connect('mongodb://195.201.98.20:27017/mongotest', {useNewUrlParser: true})).db()

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
bots['bot11'] = {
    botId: 'bot11',
    token: '4OwrbE3Fuge7WHe'
}
bots['bot12'] = {
    botId: 'bot12',
    token: 'Gqxlpueb2Ac184V'
}
bots['bot13'] = {
    botId: 'bot13',
    token: 'U2UbkkUGFpNWmPc'
}
bots['bot14'] = {
    botId: 'bot14',
    token: 'eHlqUl1lXl1Efm5'
}
bots['bot15'] = {
    botId: 'bot15',
    token: '3hKz4vhnvUJXk63'
}
bots['bot16'] = {
    botId: 'bot16',
    token: 'AfkNKAb7wUlPaL6'
}
bots['bot17'] = {
    botId: 'bot17',
    token: 'RUdoFBNdkCE0h6d'
}
bots['bot18'] = {
    botId: 'bot18',
    token: 'Q8UlTFNG8p8ZtaZ'
}
bots['bot19'] = {
    botId: 'bot19',
    token: 'fRTNU7vUlnbt0Hg'
}
bots['bot20'] = {
    botId: 'bot20',
    token: 'QTmMfEaoZjt4KoW'
}

async function loadProfitTable(binary, mongo, token, start, end) {
    var profits = []

    const ws = new WebSocket(binary)
    await (() => {
        return new Promise((resolve, reject) => {
            ws.onopen = () => {
                resolve()
            }
            ws.onerror = error => {
                console.debug(error)
                reject(error)
            }
        })
    })()

    await ((ws, token) => {
        return new Promise((resolve, reject) => {
            ws.onmessage = buffer => {
                try {
                    const message = JSON.parse(buffer.data)
                    if (message.msg_type == 'authorize' && message.error == null) {
                        resolve(message)
                    }
                    else {
                        console.debug(error)
                        reject(message)
                    }
                }
                catch (error) {
                    console.debug(buffer)
                    reject(error)
                }
            }
            ws.onerror = error => {
                reject(error)
            }
            ws.send(JSON.stringify({ authorize: token }))
        })
    })(ws, token)

    var offset = 0 
    const limit = 50 
    var profit
    var next = true
    do {
        console.log(`loading from ${offset} to ${offset + limit}`)
        profit = await ((ws, start, end, offset, limit) => {
            return new Promise((resolve, reject) => {
                ws.onmessage = buffer => {
                    try {
                        const message = JSON.parse(buffer.data)
                        if (message && message.error && message.error.code == 'RateLimit') {
                            resolve({code: 'RateLimit'})
                        }
                        else if (message && message.error) {
                            console.debug(message.error)
                            throw new Error(message.error)
                        }
                        else if (message && message.msg_type == 'profit_table') {
                            resolve(message)
                        }
                        else {
                            console.debug(message)
                            throw new Error('unregcognized message')
                        }
                    }
                    catch (error) {
                        console.debug(error)
                        reject(error)
                    }
                }
                ws.onerror = error => {
                    console.debug(error)
                    reject(error)
                }
                ws.send(JSON.stringify({
                    profit_table: 1,
                    description: 1,
                    limit: limit,
                    offset: offset,
                    date_from: start >= 10000000000 ? Math.floor(start / 1000) : start,
                    date_to: end >= 10000000000 ? Math.floor(end / 1000) : end,
                    sort: "DESC"
                }))
            })
        })(ws, start, end, offset, limit)

        if (profit && profit.code && profit.code == 'RateLimit') {
            console.log('rate limit reached, suspending')
            await (() => {
                return new Promise((resolve, reject ) => {
                    setTimeout(() => {
                        console.log('resuming')
                        resolve()
                    }, 60000)
                })
            })()
        }
        else {
            offset += limit
            if (profit && profit.profit_table && profit.profit_table.transactions) {
                console.log(`${profit.profit_table.transactions.length} records loaded`)
                for (var j = 0; j < profit.profit_table.transactions.length; j++) {
                    profits.push(profit.profit_table.transactions[j])
                }
            }
        }
        next = profit && ((profit.profit_table && profit.profit_table.count != 0) || (profit.code && profit.code == 'RateLimit'))
    }
    while (next)

    const db = (await MongoClient.connect(mongo, {useNewUrlParser: true})).db()

    var clientProfits = profits.map(value => { 
        return {
            token: token,
            profit_table: value
        }
    })

    await db.collection('ClientProfits').insertMany(clientProfits)

    return clientProfits
}

// loadProfitTable('wss://ws.binaryws.com/websockets/v3?app_id=1', 'mongodb://195.201.98.20:27017/mongotest', bots['bot1'].botId, bots['bot1'].token, start, end)

async function loadProfitTables(bots, start, end) {
    for (var i = 0; i < Object.keys(bots).length; i++) {
        try {
            const key = Object.keys(bots)[i];
            const bot = bots[key]
        
            console.log(`${bot.botId} ${bot.token} start`)
            
            const profits = await loadProfitTable('wss://ws.binaryws.com/websockets/v3?app_id=1', 'mongodb://178.128.12.94:27017/mongotest', bot.token, start, end)
            bots[key].profits = profits
            console.log(`${bot.botId} ${bot.token} loaded ${profits.length}`)
        }
        catch (error) {
            console.debug(error)
        }
    }
}

const start = (new Date('2018-07-25T00:30:00.000+03:00')).getTime()
const end = (new Date('2018-07-27T06:30:00.000+03:00')).getTime()
loadProfitTables(bots, start, end)