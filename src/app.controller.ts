import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller() // 해당 클래스를 컨트롤러로 만들어줌.
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get() // GET 요청을 처리함.
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/req')
  getReq(@Req() req: Request): any {
    console.log(req);
  }
}

