// src/logger/my-logger.service.ts

import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MyLogger implements LoggerService {
  private logFilePath = path.join(__dirname, '@logs/app.log');

  log(message: any, ...optionalParams: any[]) {
    this.writeLog('LOG', message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.writeLog('ERROR', message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.writeLog('WARN', message, ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.writeLog('DEBUG', message, ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.writeLog('VERBOSE', message, ...optionalParams);
  }

  fatal(message: any, ...optionalParams: any[]) {
    this.writeLog('FATAL', message, ...optionalParams);
  }

  private writeLog(level: string, message: any, ...optionalParams: any[]) {
    const formattedMessage = this.formatLog(level, message, ...optionalParams);

    console.log(formattedMessage);

    this.appendLogToFile(formattedMessage);
  }

  private formatLog(
    level: string,
    message: any,
    ...optionalParams: any[]
  ): string {
    const timestamp = new Date().toISOString();
    return `${timestamp} [${level}] ${message} ${optionalParams.join(' ')}`;
  }

  private appendLogToFile(message: string) {
    fs.appendFile(this.logFilePath, message + '\n', (err) => {
      if (err) {
        console.error('Failed to write log to file:', err);
      }
    });
  }
}
