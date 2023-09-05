import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config/dist';
import { Transform } from 'class-transformer';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get('/db-host-from-config')
  getDatabaseHostFromConfigService(): string {
    return this.configService.get('DATABASE_HOST');
  }
}



