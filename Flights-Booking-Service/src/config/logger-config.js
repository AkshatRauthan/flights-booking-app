const winston = require('winston');

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        process.env.NODE_ENV === 'production'
            ? winston.format.json()
            : winston.format.combine(
                  winston.format.colorize(),
                  winston.format.printf(({ level, message, timestamp, stack, ...meta }) => {
                      let log = `${timestamp} [${level}]: ${message}`;
                      if (stack) log += `\n${stack}`;
                      if (Object.keys(meta).length) log += ` ${JSON.stringify(meta)}`;
                      return log;
                  })
              )
    ),
    defaultMeta: { service: 'booking-service' },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

module.exports = logger;