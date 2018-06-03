const WebSocket = require('ws');
const uuidv4 = require('uuid/v4');
var id = 1;

function WebSocketAdapter(url, token) {
    console.log('instantiating');
    this.url = url;
    console.log(this.url);
    this.isAuthorized = false;
    this.isAlive = false;
    // this.id = uuidv4();
    this.id = id;
    id++;
    this.token = token;
    this.onbinaryresponse = () => { }
}

WebSocketAdapter.prototype.authorize = function(token) {
    this.instance.send(JSON.stringify({
        authorize: token,
        passthrough: {
            client: this.id
        }
    }));
}
WebSocketAdapter.prototype.ping = function() {
    this.instance.send(JSON.stringify({
        ping: 1
    }));
}
WebSocketAdapter.prototype.heartbeat = function() {
    if (this.instance && this.instance.readyState == WebSocket.OPEN) {
        console.log(`${this.id} is beating`)
        this.ping();
        if (!this.isAuthorized) {
            this.authorize(this.token);
        }
    }
    else {
        console.log(`${this.id} is not beating`)
    }
}
WebSocketAdapter.prototype.open = function() {
    this.isAuthorized = false;
    this.isAlive = false;
    this.instance = new WebSocket(this.url);
    
    this.instance.on('open', () => {
        console.log(`#${this.id} opened`);
        this.timer = setInterval(() => {this.heartbeat()}, 1000);
        this.heartbeat();
    });
        
    this.instance.on('message', (message) => {
        // console.log(`#${this.id} got message`);
        try {
            var response = JSON.parse(message);
            switch (response.msg_type) {
                case 'authorize':
                    if (response.error) {
                        console.log(`#${this.id} was not authorized`);
                        console.debug(error);
                        this.isAuthorized = false;
                    }
                    else {
                        console.log(`#${this.id} was authorized`);
                        this.isAuthorized = true;
                    }
                    break;
                case 'ping': 
                    if (response.ping == 'pong') {
                        // console.log(`#${this.id} got pong`);
                        this.isAlive = true;
                    }
                    else {
                        // console.log(`#${this.id} got invalid response from server`);
                        this.isAlive = false;
                    }
                    break;
                case 'buy': 
                    // console.log(`#${this.id} buy`);
                    message.returnedFromBinaryOn = Date.now();
                    if (response.error) {
                        // console.log(`${this.id} got error response`);
                        console.log(`${this.id} failed to follow advice of signalist`);
                        console.debug(error);
                    }
                    else {
                        if (response.passthrough && response.passthrough.receivedByAutobotOn && response.passthrough.sentToBinaryOn) {
                            const time = response.passthrough.sentToBinaryOn - response.passthrough.receivedByAutobotOn;
                            console.log(`${this.id} brought lot by advice of signalist in ${time} ms`);
                        }
                        else {
                            console.log(`${this.id} brought lot by advice of signalist`);
                        }
                    }
                    this.onbinaryresponse(message)
                    break;
                default:
                    console.log(`#${this.id} message unhandled - ${message}`);
                    break;
            }
        }
        catch (error) {
            console.log(`#${this.id} got unparseble message - ${message}`);
        }
    });
    this.instance.on('error', (error) => {
        console.log(`#${this.id} have error`);
        console.debug(error);
    });
    this.instance.on('close', (code, reason) => {
        console.log(`#${this.id} closed with ${code} ${reason}`);
        if (this.timer) {
            clearTimeout(this.timer);
        }
        this.isAuthorized = false;
        this.isAlive = false;
        if (code == 1000) {
            //an expected close cod
        }
        else {
            this.open();
        }
    });
}
WebSocketAdapter.prototype.buy = function(enrichedSignal) {
    this.instance.send(JSON.stringify(enrichedSignal));
}

WebSocketAdapter.prototype.close = function() {
    this.instance.close(1000);
}

WebSocketAdapter.prototype.onBinaryResponce = function(callback) {
    this.onbinaryresponse = callback
}
module.exports = WebSocketAdapter;
