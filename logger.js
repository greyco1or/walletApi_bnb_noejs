const winston       = require('winston');
const winstonDaily  = require('winston-daily-rotate-file');
const moment        = require('moment');
const MESSAGE       = Symbol.for('message');

const logDir = 'logs';

const fs = require('fs');
if (!fs.existsSync(logDir))
{
    fs.mkdirSync(logDir);
}

function timeStampFormat() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
};
console.log(timeStampFormat());

const jsonFormatter = (logEntry) => {
    const base = { timestamp: new Date() };
    const json = Object.assign(base, logEntry)
    logEntry[MESSAGE] = JSON.stringify(json);
    return logEntry;
}

var withLog = winston.createLogger({
    transports: [
        new (winstonDaily)({
            name: 'info-file',
            dirname: logDir,
            filename: 'withDraw-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            maxsize: '50m',
            maxFiles: '14d',
            level: 'debug',
            format: winston.format(jsonFormatter)()
        }),
        new (winston.transports.Console)({
            name: 'info-console',
            colorize: true,
            level: 'info',
            format: winston.format(jsonFormatter)()
        })
    ],
    exceptionHandlers: [
        new (winstonDaily)({
            name: 'exception-file',
            dirname: logDir,
            filename: 'exception-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            colorize: false,
            maxsize: '50m',
            maxFiles: '14d',
            level: 'error',
            format: winston.format(jsonFormatter)()
        }),
        new (winston.transports.Console)({
            name: 'exception-console',
            colorize: true,
            level: 'error',
            format: winston.format(jsonFormatter)()
        })
    ]
});

module.exports = {
    withLog: withLog
}


//{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }
//logger.debug('디버그 로깅');
//logger.info('인포 로깅');
//logger.error('에러 로깅');
