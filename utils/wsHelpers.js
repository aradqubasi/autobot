const WebSocket = require('ws')
const CodeReasonPair = require('../dto/codeReasonPair')

/**
 * @description return an empty promise after timeout expires
 * @param {Number} time 
 * @returns {Promise<void>}
 */
function wait(time) {
    return new Promise((resolve, reject) => {
        try {
            setTimeout(() => {
                resolve()
            }, time)
        }
        catch (error) {
            reject(error)
        }
    })
}


/**
 * @description return empty promise on open
 * @param {WebSocket} ws 
 * @returns {Promise<void>}
 */
function open(ws) {
    return new Promise((resolve, reject) => {
        ws.on('open', () => {
            resolve()
        })
        ws.on('error', error => {
            reject(error)
        })
    })
}

/**
 * @description return empty code/reason on close
 * @param {WebSocket} ws 
 * @param {Number?} code
 * @param {String?} reason
 * @returns {Promise<CodeReasonPair>}
 */
function close(ws, code, reason) {
    return new Promise((resolve, reject) => {
        ws.on('close', (code, reason) => {
            resolve(new CodeReasonPair(code, reason))
        })
        ws.on('error', error => {
            reject(new CodeReasonPair(1, error.stack))
        })
        if (code && reason) {
            ws.close(code, reason)
        }
        else {
            ws.close()
        }
    })
}

/**
 * @description return authorize promise
 * @param {WebSocket} ws websocket instance
 * @param {Object|String} message message to send
 * @param {?String} msg_type message type to filter responses
 * @returns {Promise<Any>} response object from web server
 */
function send(ws, message, msg_type) {
    return new Promise((resolve, reject) => {
        const exceptionHandler = function (error) {
            reject(error)
        }
        const messageHandler = function (event) {
            try {
                const message = JSON.parse(event.data)
                if (msg_type == null) {
                    ws.removeEventListener('message', this)
                    ws.removeEventListener('error', exceptionHandler)
                    resolve(message)
                }
                else if (message && message.msg_type == msg_type) {
                    ws.removeEventListener('message', this)
                    ws.removeEventListener('error', exceptionHandler)
                    resolve(message)
                }
                else {
                    throw new Error(`unexpected msg_type ${(message || {}).msg_type}`)
                }
            }
            catch (error) {
                ws.removeEventListener('message', this)
                ws.removeEventListener('error', exceptionHandler)
                reject(error.stack)
            }
        }
        ws.addEventListener('message', messageHandler)
        ws.addEventListener('error', exceptionHandler)
        ws.send(JSON.stringify(message))
    })
}

module.exports = { send: send, open: open, wait: wait, close: close }