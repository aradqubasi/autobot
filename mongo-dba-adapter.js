const MongoClient = require('mongodb').MongoClient;

function MongoDbaAdapter() {
    this.db = undefined
    this.onreceptionserverconfigupdate = () => { }
    this.onclientbotconfigupdate = () => { }
}

MongoDbaAdapter.prototype.open = function (url) {
    MongoClient.connect(url, { useNewUrlParser: true }).then(connection => {
        // this.db = connection.db('mongotester');
        this.db = connection.db();
    }).catch(error => {
        error.note = 'MongoDbaAdapter.open(url)'
        console.debug(error)
    });
}

MongoDbaAdapter.prototype.insertSignal = function (signal) {
    if (this.db) {
        this.db.collection('Signals').insertOne(signal).then(result => { 
            console.log('MongoDbaAdapter.insertInbound inserted')
            // console.debug(result)
        }).catch(error => {
            error.note = 'MongoDbaAdapter.insertInbound(signal)'
            console.debug(error)
        })
    }
    else {
        console.log('MongoDbaAdapter.insertInbound ignored')
    }
}

MongoDbaAdapter.prototype.insertClientRequest = function (request) {
    if (this.db) {
        this.db.collection('ClientRequests').insertOne(request).then(result => { 
            console.log('MongoDbaAdapter.insertClientRequest inserted')
        }).catch(error => {
            error.note = 'MongoDbaAdapter.insertClientRequest(request)'
            console.debug(error)
        })
    }
    else {
        console.log('MongoDbaAdapter.insertClientRequest ignored')
    }
}

MongoDbaAdapter.prototype.insertBinaryResponse = function (response) {
    if (this.db) {
        this.db.collection('BinaryResponses').insertOne(request).then(result => { 
            console.log('MongoDbaAdapter.insertBinaryResponse inserted')
        }).catch(error => {
            error.note = 'MongoDbaAdapter.insertBinaryResponse(response)'
            console.debug(error)
        })
    }
    else {
        console.log('MongoDbaAdapter.insertBinaryResponse ignored')
    }
}

MongoDbaAdapter.prototype.getReceptionServerConfig = function (serverId) {

}

MongoDbaAdapter.prototype.onReceptionServerConfigUpdate = function (serverId, callback) {
    this.onreceptionserverconfigupdate = callback
}

MongoDbaAdapter.prototype.getClientBotConfig = function (botId) {
    
}

MongoDbaAdapter.prototype.onClientBotConfigUpdate = function (botId, callback) {
    this.onclientbotconfigupdate = callback
}

module.exports = MongoDbaAdapter;