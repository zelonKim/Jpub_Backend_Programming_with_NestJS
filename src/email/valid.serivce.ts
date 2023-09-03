import { ArgumentMetadata, PipeTransform } from "@nestjs/common";
import { plainToClass } from 'class-transformer'
import { validate } from 'class-validator'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if(!metatype || !this.toValidate(metatype)) { // metatype이 파이프가 지원하는 타입인지 검사함.
      return value;
    }
    const object = plainToClass(metatype, value) // plainToClass()함수를 통해 순수 자바스크립트 객체를 클래스의 객체로 바꿔줌. (타입 지정) 
    const errors = await validate(object); 
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed')
    }
    return value; // 유효성 검사에 통과할 경우 원래의 값을 그대로 전달함.
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}

@Post()
create(@Body(ValidationPipe) createUserDto: CreateUserDto) { // ValidationPipe를 적용함.
  return this.usersService.create(createUserDto);
}

