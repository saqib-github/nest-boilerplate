import { LoggerService } from '@nestjs/common';
import appLogger, { requestErrorLogger } from 'src/helpers/logger';

export class AppLogger implements LoggerService {
  /**
   * Write a 'log' level log.
   */
  log(message: any, ...optionalParams: any[]) {
    appLogger.info(message);
  }

  /**
   * Write a 'fatal' level log.
   */
  fatal(message: any, ...optionalParams: any[]) {
    appLogger.error(message);
  }

  /**
   * Write an 'error' level log.
   */
  error(message: any, ...optionalParams: any[]) {
    appLogger.error(message);
  }

  /**
   * Write a 'warn' level log.
   */
  warn(message: any, ...optionalParams: any[]) {
    appLogger.warn(message);
  }

  /**
   * Write a 'debug' level log.
   */
  debug?(message: any, ...optionalParams: any[]) {
    appLogger.debug(message);
  }

  /**
   * Write a 'verbose' level log.
   */
  verbose?(message: any, ...optionalParams: any[]) {
    appLogger.verbose(message);
  }

  requestError(message: any, ...optionalParams: any[]) {
    requestErrorLogger.error(message);
  }
}