import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck } from '@nestjs/terminus'

@Controller('health-check')
export class HealthCheckController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
          () => this.http.pingCheck('hello', 'https://docs.nestjs.com'), // https://docs.nestjs.com에 요청을 보내서 응답을 제대로 받으면 hello로 응답을 줌.
        ]);
    }
}
