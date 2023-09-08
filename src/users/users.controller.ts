import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Headers,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserInfo } from './UserInfo';
import { createUserHandler } from './users.service';
import { ICommand } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs'
import { IEvent } from '@nestjs/cqrs';
import { CqrsEvent } from './cqrs-event'
import { EventBus } from '@nestjs/cqrs';
import { QueryBus } from '@nestjs/cqrs/dist/query-bus';



export class CreateUserCommand implements ICommand {
  constructor(
    readonly name: string,
    readonly email: string,
    readonly password: string,
  ){}
}


export class UserCreatedEvent extends CqrsEvent implements IEvent {
  constructor(
    readonly email: string,
    readonly signupVerifyToken: string,
  ) {
    super(UserCreatedEvent.name)
  }
}


export class TestEvent extends CqrsEvent implements IEvent {
  constructor(
  ) {
    super(TestEvent.name)
  }
}



@Controller('users')
export class UsersController {
  constructor( private commandBus: CommandBus, // CommandBus를 주입함.
    private eventBus: EventBus ) {} 

  @Post()
  async creatUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    const command = new CreateUserCommand(name, email, password)  
    return this.commandBus.execute(command) 
  }

    


  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;

    this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken))
    this.eventBus.publish(new TestEvent())
  }





  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  } */



  // @Get(':id')
  // async getUserInfo(@Headers() headers: any, @Param('id') userId: string): Promise<UserInfo> {
  //   const jwtString = headers.authorization.split('Bearer ')[1];

  //   this.authService.verify(jwtString);

  //   return this.usersService.getUserInfo(userId);
  // }

  @UseGuards(AuthGuard) // 가드를 회원 조회 엔드포인트에만 적용함.
  @Get(':id')
  async getUserInfo(
    @Headers() headers: any, // 헤더를 가져옴.
    @Param('id') userId: string,
  ): Promise<UserInfo> {
    return this.usersService.getUserInfo(userId); // 유저 정보를 가져와서 응답으로 돌려줌.
  }
 
  @Controller()
  export class AppController {

    @Get(':id')
    findOne(@Param(id) id: string) {
      if( +id < 1 ) {
        throw new BadRequestException('id는 0보다 큰 정수여야 합니다')
      }
      return this.usersService.findOne(+id);
    }
    
  }



  export class GetUserInfoQuery implements IQuery {
    constructor(
      readonly userId: String
    ) {}
  }

  @Controller('users')
  export class UsersController{
    constructor(
      private queryBus: QueryBus
    ) {}
  
  
  @UseGuards(AuthGuard)
  @Get(':id')
  async getUserInfo(@Param('id') userId: string): Promise<UserInfo> {
    const getUserInfoQuery = new GetUserInfoQuery(userId);
    return this.queryBus.execute(getUserInfoQuery) // 쿼리 핸들러로 쿼리를 실어보냄.
  }
  }



}

import { Logger as WinstonLogger } from 'winston'
import { WINSTON_MODULE_PROVIDER } from 'nest-winston'

export class UsersController {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private reaonly logger: WinstonLogger) {}

    @Post()
    async createUser(@Body() dto: CreateUserDto): Promise<void> {
      this.printWinstonLog(dto);
    }

    private printWinstonLog(dto) {
      this.logger.error('error', dto)
      this.logger.warn('warn', dto)
      this.logger.info('info', dto)
      this.logger.http('http', dto)
      this.logger.verbose('verbose', dto)
      this.logger.debug('debug', dto)
      this.logger.silly('silly', dto)
    }
  }
