import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { Header } from '@nestjs/common';
import { Query, Redirect } from '@nestjs/common/decorators';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {} // UsersService를 컨트롤러에 주입함.

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<void> {
    const { name, email, password } = dto;
    await this.usersService.createUser(name, email, password); // body에서 얻은 정보를 UsersService에 전달함.
  }

 /*  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
 */


  
  /*  
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    const { name, email } = createUserDto;
    return `유저를 생성했습니다. 이름:${name}, 이메일:${email}`;
  } 
  */

  /*  @Get(':id')
  findOnee(@Param('id') id: string) {
    if (+id < 1) {
      throw new BadRequestException('id는 0보다 큰 값이어야 합니다.');
    }
    return this.usersService.findOne(+id);
  } */

  /*   
  @Header('Custom', 'Test Header')
  @Get(':id')
  findOneWithHeader(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }
*/

  /*   
  @Redirect('https://nestjs.com', 301)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  } // http://localhost:3000/users/1로 접속하면, https://nestjs.com/로 이동함.
 */

  /*  
  @Get('redirect/docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5' };
    }
  } // http://localhost:3000/users/redirect/docs?version=5로 접속하면 https://docs.nestjs.com/v5/로 이동함.
 */
}
