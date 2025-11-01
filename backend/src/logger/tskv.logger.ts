import { Injectable, LoggerService } from "@nestjs/common";

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    let msg = `level=${level}\tmessage=${message}`;
    if (optionalParams.length !== 0) {
      msg += `\tparams=${JSON.stringify(optionalParams)}`;
    }
    return msg; 
  }
  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('INFO', message, ...optionalParams));
  }

  fatal(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('FATAL', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('ERROR', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('WARN', message, ...optionalParams));
  }

  debug?(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('DEBUG', message, ...optionalParams));
  }

  verbose?(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('VERBOSE', message, ...optionalParams));
  }
}