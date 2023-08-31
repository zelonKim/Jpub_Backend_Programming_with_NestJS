import { Controller, Get, HostParam } from '@nestjs/common';


@Controller({ host: 'api.localhost' }) 
export class ApiController {
  @Get()
  index(): string {
    return 'Hello, API';
  }
}
// http://api.localhost:3000/로 접속할 경우, 화면에 'Hello, API'가 출력됨.
// http://localhost:3000/로 접속할 경우, 'Hello World'가 출력됨. (기존 도메인으로 요청이 처리됨.)



/* 
@Controller({ host: ':version.api.localhost' }) 
export class ApiController {
  @Get() 
  index(@HostParam('version') version: string): string {
    return `Hello, API ${version}`;
  }
}
// http://v1.api.localhost:3000/로 접속할 경우, 화면에 'Hello, API v1'이 출력됨.
// http://v2.api.localhost:3000/로 접속할 경우, 화면에 'Hello, API v2'이 출력됨.
// http://api.localhost:3000/로 접속할 경우, 화면에 'Hello World'가 출력됨. (기존 도메인으로 요청이 처리됨.)
// http://localhost:3000/로 접속할 경우, 'Hello World'가 출력됨. (기존 도메인으로 요청이 처리됨.)
*/