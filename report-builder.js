const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://192.168.1.6:27017/mongotest', { useNewUrlParser: true }).then(connection => {
    const db = connection.db();
    db.collection('')
}).catch(error => {
    console.debug(error)
});