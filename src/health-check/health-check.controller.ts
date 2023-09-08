import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, HealthCheck, TypeOrmHealthIndicator } from '@nestjs/terminus'
import { DogHealthIndicator } from './DogHealthIndicator';

@Controller('health-check')
export class HealthCheckController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator,
        private db: TypeOrmHealthIndicator,
        private dogHealthIndicator: DogHealthIndicator,
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
          () => this.http.pingCheck('hello', 'https://docs.nestjs.com'), // https://docs.nestjs.com에 요청을 보내서 응답을 제대로 받으면 hello로 응답을 줌.
          () => this.db.pingCheck('database') // 체크 리스트에 DB 헬스 체크를 추가함.
          () => this.dogHealthIndicator.isHealthy('dog')
        ]);
    }
}

