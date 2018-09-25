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

//signalist
//timeframe
//symbol
//day
//hour
//inhour


/**
 * @description get random signalist
 * @param {String[]} signalistIds 
 * @returns {String}
 */
function getRandomSignalist(signalistIds) {
    let signalistId = signalistIds[Math.floor(Math.random() * signalistIds.length)]
    return signalistId
}


/**
 * @description generates random symbol
 * @returns {String}
 */
function getRandomSymbol() {
    let symbols = ['', '' , '']
    let symbol = symbols[Math.floor(Math.random() * symbols.length)]
    return symbol
}

/**
 * @description generates random timeframe
 * @returns {String}
 */
function getRandomTimeframe() {
    let timeframes = ['M5', 'M15' , 'H1']
    let timeframe = timeframes[Math.floor(Math.random() * timeframes.length)]
    return timeframe
}


/**
 * @description generates random day of the week
 * @returns {Number}
 */
function getRandomDay() {
    let day = Math.floor(Math.random() * 7)
    return day
}

/**
 * @description generates random HourInterval
 * @returns {HourInterval}
 */
function getRandomHourInterval() {
    /** @type {HourInterval} */
    let interval = new HourInterval()

    interval.begin = new Time()
    interval.begin.hours = Math.floor(Math.random() * 24)
    interval.begin.minutes = Math.floor(Math.random() * 60)
    interval.begin.seconds = Math.floor(Math.random() * 60)

    interval.end = new Time()
    interval.end.hours = Math.floor(Math.random() * 24)
    interval.end.minutes = Math.floor(Math.random() * 60)
    interval.end.seconds = Math.floor(Math.random() * 60)

    return interval
}


/**
 * @description generates random InHourInterval
 * @returns {InHourInterval}
 */
function getRandomInHourInterval() {
    /** @type {InHourInterval} */
    let interval = new InHourInterval()

    interval.begin = new Minute()
    interval.begin.minutes = Math.floor(Math.random() * 60)
    interval.begin.seconds = Math.floor(Math.random() * 60)

    interval.end = new Minute()
    interval.end.minutes = Math.floor(Math.random() * 60)
    interval.end.seconds = Math.floor(Math.random() * 60)

    return interval
}

module.exports = getRandomSignalist
module.exports = getRandomSymbol
module.exports = getRandomTimeframe
module.exports = getRandomDay
module.exports = getRandomHourInterval
module.exports = getRandomInHourInterval