import { isString, MinLength, MaxLength, IsEmail } from 'class-validator';

export class CreateUserDto {
    @isString()
    @MinLength(1)
    @MaxLength(20)
    name: string;

    @IsEmail()
    email: string;
}