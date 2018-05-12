const MongoClient = require('mongodb').MongoClient;
const config = require('./config.js').db;

var dbo = {}

MongoClient.connect(`mongodb://${config.host}:${config.port}/${config.name}`, function(error, connection){
    if (error) {
        console.debug(error);
    }
    else if (connection) {
        console.log(`connecting to ${config.name}`)

        var instance = connection.db(config.name);
        dbo.inbounds = function () {
            return instance.collection(config.collections.inbound);
        };
        dbo.signalists = function () {
            return instance.collection(config.collections.signalists);
        };

        if (config.testing) {
            console.log('fetching test data...')
            dbo.signalists().deleteMany({}, function(error) {
                if (error) {
                    console.debug(error);
                }
                dbo.signalists().insertMany(config.testing.signalists, (error, result) => {
                    if (error) {
                      console.log(error);
                    }
                    else {
                      console.debug(result);
                    }
                });
            });
        }
    }
    else {
        console.log('Could not connect to mongodb instance');
    }
});
    
module.exports = dbo;