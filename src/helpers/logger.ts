import * as winston from 'winston';

const { combine, timestamp, printf } = winston.format;

// Define log format
const logFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${level}: ${message}`;
});

// Create logger instance
const logger = winston.createLogger({
  level: 'info',
  format: combine(winston.format.colorize({ all: true }), timestamp(), logFormat),
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'logs/app.log' }), new winston.transports.File({ filename: 'logs/error.log', level: 'error' })],
  exceptionHandlers: [new winston.transports.File({ filename: 'logs/exceptions.log' })],
  rejectionHandlers: [new winston.transports.File({ filename: 'logs/rejections.log' })],
  exitOnError: false, // Continue logging after uncaught exceptions
});

// Create logger instance for request errors
export const requestErrorLogger = winston.createLogger({
  level: 'error',
  format: combine(timestamp(), logFormat),
  transports: [new winston.transports.File({ filename: 'logs/request_errors.log' })],
});

export default logger;
