import { Module } from '@nestjs/common';

@Module({
    providers: [MyLogger],
    exports: [MyLogger],
})
export class LoggerModule {}
