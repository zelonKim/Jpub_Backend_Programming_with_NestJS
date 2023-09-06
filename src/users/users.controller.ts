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
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() dto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = dto;
    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() dto: UserLoginDto): Promise<string> {
    const { email, password } = dto;

    return await this.usersService.login(email, password);
  }

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






}
