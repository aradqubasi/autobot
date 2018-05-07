const MongoClient = require('mongodb').MongoClient;
const config = require('./config.js').db;

var dbo = {}

MongoClient.connect(`mongodb://${config.host}:${config.port}/${config.name}`, function(error, connection){
    if (error) {
        console.debug(error);
    }
    else if (connection) {
        console.log(`connecting to ${config.name}`)
        dbo.instance = connection.db(config.name);
        // dbo.collection('inbound').find().toArray(function(error, items) {
        //     items.forEach(function (value) {
        //         console.debug(value);
        //     });
        // });
    }
    else {
        console.log('Could not connect to mongodb instance');
    }
});
    
module.exports = dbo;

// const MongoClient = require('mongodb').MongoClient;
// const config = require('./config.js').db;

// var dbo = {};

// MongoClient.connect(`mongodb://${config.host}:${config.port}/${config.name}`, function(error, connection){
//     if (error) {
//         console.debug(error);
//     }
//     else if (connection) {
//         console.log(`connecting to ${config.name}`)
//         dbo = connection.db(config.namse);
//         // dbo.collection('inbound').find().toArray(function(error, items) {
//         //     items.forEach(function (value) {
//         //         console.debug(value);
//         //     });
//         // });
//     }
//     else {
//         console.log('Could not connect to mongodb instance');
//     }
// });

// module.exports = dbo;