const instance = process.argv[2]//slowpoke
const dburl = process.argv[3]//'mongodb://178.128.12.94:27017/mongotest'
const {transports, createLogger, format} = require('winston')
require('winston-mongodb')
const logger = createLogger({
    format: format.combine(
        format.label({label: `${instance}`}),
        format.timestamp(),
        format.json()
    ),
    transports: [
        new transports.Console({
            handleExceptions: true
        }),
        new transports.File({ 
            filename: 'error.log'//, 
            // level: 'error' 
        }),
        new transports.MongoDB({
            db: dburl
        })
    ]
})

// transports: [
//     new transports.Console(),
//     new transports.File({filename: 'logs/error/error.log', level: 'error'}),
//     new transports.File({filename: 'logs/activity/activity.log', level:'info'})
// ]

// try {
//     const a = a.dfd.fdsfd
// }
// catch (error) {
//     logger.error(error.stack)
// }
var boo = { foo: "boo"}
logger.info(`${boo}`)