const winston = require('winston');
require('winston-daily-rotate-file');
var sanitizeHtml = require('sanitize-html');

// https://medium.com/@davidmcintosh/winston-a-better-way-to-log-793ac19044c5
//==============================
// Environment
//==============================
process.env.ENV = process.env.ENV || 'development'

// Logger Format definition
const logFormat = winston.format.combine(
    // Gives us access to a string which contains the current date and time
    winston.format.timestamp(),
    // Adds a '\t' delimiter (tab) to the beginning of each message
    winston.format.align(),
    // Allows us to define a structure for our log messages
    winston.format.printf(
        log => `${log.timestamp} \t ***${log.level.toUpperCase()}*** \t ${sanitizeHtml(log.message)}`
    )
);

// In PRODUCTION environment only register ERROR logs.
var level = 'debug';
if (process.env.ENV === 'production') {
    level = 'info';
}

var transport = new winston.transports.DailyRotateFile({
    filename: '../../logs/NIDS-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    // zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

transport.on('rotate', function(oldFilename, newFilename) {});


const logger = winston.createLogger({
    level,
    // Add the format to the custom logger.
    format: logFormat,
    defaultMeta: { service: 'user-service' },
    transports: [
        transport,
        new winston.transports.Console({
            format: logFormat
        }),
    ]
});

module.exports = logger;