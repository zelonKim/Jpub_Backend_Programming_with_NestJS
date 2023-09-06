import {
  isString,
  MinLength,
  MaxLength,
  IsEmail,
  Matches,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/) // 영문 대소문자와 숫자 혹은 특수문자로 이뤄진 8자 이상 30자 이하
  readonly password: string;
}
