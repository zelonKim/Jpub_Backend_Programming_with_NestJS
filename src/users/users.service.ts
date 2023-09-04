import * as uuid from 'uuid';
import { EmailService } from '../email/email.service';
import { Injectable, Scope } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';

@Injectable() 
export class UsersService {
  constructor(private emailService: EmailService,
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>, // @InjectRespository()를 통해 레포지토리를 주입함.
    ) {}


  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if(userExist) {
      throw new UnprocessableEntityException('이미 존재하는 이메일 입니다.')
    }
    const signupVerifyToken = uuid.v1();
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }



  private checkUserExists(emailAddress: string): Promise<boolean>  {
  const user = await this.usersRepository.findOne({
    where: { email: emailAddress }
  }) 
    return user !== undefined;
  }



  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity(); // 새로운 엔티티 객체를 생성함.
    user.id = ulid(); // 랜덤한 문자열을 생성함.
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user) // 레포지토리를 통해 데이터베이스에 저장함.
  }



  

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    // 회원가입 인증 메일을 발송함.
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    throw new Error('not implemented yet.');
  }

  async login(email: string, password: string): Promise<string> {
    throw new Error('not implemented yet.');
  }

/*   async getUserInfo(userId: string): Promise<UserInfo> {
    throw new Error('not implemented yet.');
  } */
}
