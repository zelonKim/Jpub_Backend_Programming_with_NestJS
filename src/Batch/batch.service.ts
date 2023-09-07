import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(private schedulerRegistry: SchedulerRegistry) {
    // 서비스에 SchedulerRegistry를 주입함.
    this.addCronJob(); // 
  }

  addCronJob() {
    const name = 'cronSample';

    const job = new CronJob('* * * * * *', () => {
      this.logger.warn(`run ${name}`);
    });

    this.schedulerRegistry.addCronJob(name, job); // addCronJob(크론명, 크론 내용)을 통해 크론잡을 SchedulerRegistry에 추가함.

    this.logger.warn(`job ${name} added`);
  }
}
