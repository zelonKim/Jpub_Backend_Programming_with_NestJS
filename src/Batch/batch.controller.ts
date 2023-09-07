import { Controller, Post } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule'

@Controller('batch')
export class BatchController {
  constructor(private scheduler: SchedulerRegistry) {} // 컨트롤러에 SchedulerRegistry를 주입함.

  @Post('/start-sample')
  start() {
    const job = this.scheduler.getCronJob('cronSample'); // getCronJob(크론명)을 통해 SchedulerRegistry에 추가된 크론잡을 등록함.
    job.start(); // 크론잡을 실행함.
    console.log('started', job.lastDate());
  }

  @Post('/stop-sample')
  stop() {
    const job = this.scheduler.getCronJob('cronSample');
    job.stop(); // 크론잡을 중지함.
    console.log('stopped', job.lastDate());
  }
}
