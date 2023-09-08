import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  getHello(): string {
    this.logger.error('error level');
    this.logger.warn('warn level');
    this.logger.log('log level');
    this.logger.verbose('verbose level');
    this.logger.debug('debug level');

    return 'hello';
  }
}
