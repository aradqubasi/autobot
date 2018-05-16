const MongoClient = require('mongodb').MongoClient;
const config = require('./config.js').db;

var dba = {}

MongoClient.connect(`mongodb://${config.host}:${config.port}/${config.name}`).then((connection) => {

    //set collection getters
    console.log(`connecting to ${config.name}`)
    var instance = connection.db(config.name);
    dba.inbounds = function () {
        return instance.collection(config.collections.inbound);
    };
    dba.signalists = function () {
        return instance.collection(config.collections.signalists);
    };

    //fill collection with test data if required
    if (config.testing) {
        console.log('fetching test data...')
        dba.signalists().deleteMany({}).then(() => {
            dba.signalists().insertMany(config.testing.signalists, (error, result) => {
                if (error) {
                  console.log(error);
                }
                else {
                  console.debug(result);
                }
            });
        }).catch((error) => {
            console.debug(error);
        });
    }        
    
}).catch((error) => {
    console.debug(error);
});

    
module.exports = dba;