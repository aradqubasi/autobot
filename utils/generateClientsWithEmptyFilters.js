var Db = require('mongodb').Db,
MongoClient = require('mongodb').MongoClient,
Server = require('mongodb').Server,
ReplSetServers = require('mongodb').ReplSetServers,
ObjectID = require('mongodb').ObjectID,
Binary = require('mongodb').Binary,
GridStore = require('mongodb').GridStore,
Grid = require('mongodb').Grid,
Code = require('mongodb').Code

var Time = require('../model/Time'),
Minute = require('../model/Minute'),
HourInterval = require('../model/HourInterval'),
InHourInterval = require('../model/InHourInterval'),
Filter = require('../model/Filter'),
Client = require('../model/Client')

var uuidv4 = require('uuid/v4')
/**
 * @param {String} dburl url to mongo database
 * @param {String[]} tokens client tokens with trade privilege
 * @returns {Promise<Client[]>}
 */
async function generateClientsWithEmptyFilters(dburl, tokens) {
    /** @typedef {Object} Counter
     * @property {Number} count - number of finished tasks
     * @property {Number} expected - number of tasks we expect to compelte
     */
    var counter = {
        count: 0,
        expected: 0
    }
    const connection = await MongoClient.connect(dburl)

    return new Promise((resolve, reject) => {
        for (var index = 0; index < tokens.length; index++) {
            var token = tokens[index]
            setImmediate(
                /**
                 * @param {MongoClient} connection
                 * @param {String} token
                 * @param {Counter} counter
                 */
                async (connection, token, counter) => {
                    try {
                        let db = connection.db()
                        let client = new Client()
                        client._id = uuidv4()
                        client.amount = Math.floor(Math.random() * 9 + 1)
                        client.currency = 'USD'
                        client.filters = []
                        client.token = token
                        await db.collection('Clients').insertOne(client)
                        counter.count++
                        if (counter.count >= counter) {
                            resolve()
                        }
                    }
                    catch (error) {
                        reject(error)
                    }
                }
            , connection, token, counter)
        }
    })
}

module.exports = generateClientsWithEmptyFilters