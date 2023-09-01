import * as uuid from 'uuid';
import { EmailService } from '../email/email.service';
import { Injectable, Scope } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';

@Injectable() // 다른 Nest컴포넌트에 주입할 수 있는 프로바이더로 만들어줌.
export class UsersService {
  constructor(private emailService: EmailService) {}

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    throw new Error('not implemented yet.');
  }

  async login(email: string, password: string): Promise<string> {
    throw new Error('not implemented yet.');
  }

/*   async getUserInfo(userId: string): Promise<UserInfo> {
    throw new Error('not implemented yet.');
  } */

  async createUser(name: string, email: string, password: string) {
    await this.checkUserExists(email);
    const signupVerifyToken = uuid.v1();
    await this.saveUser(name, email, password, signupVerifyToken);
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }

  private checkUserExists(email: string) {
    // 가입하려는 유저가 존재하는지 검사함.
    return false;
  }

  private saveUser(
    // 유저를 데이터베이스에 저장함.
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    return;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    // 회원가입 인증 메일을 발송함.
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
