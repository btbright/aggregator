var winston = require('winston');

var logger = new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: './logs/debug.log', maxsize: 1024 * 1024 * 10 })
    ],
    exceptionHandlers: [
      new (winston.transports.File)({ filename: './logs/exceptions.log', maxsize: 1024 * 1024 * 10 })
    ],
    exitOnError: true
  });

module.exports = logger;