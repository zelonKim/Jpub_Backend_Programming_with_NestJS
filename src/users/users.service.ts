import * as uuid from 'uuid';
import { ulid } from 'ulid';
import { DataSource, Repository } from 'typeorm';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInfo } from './UserInfo';
import { UserEntity } from './entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class UsersService {
  constructor(
    private emailService: EmailService,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private dataSource: DataSource,
    private authService: AuthService,
  ) {}



  async createUser(name: string, email: string, password: string) {
    const userExist = await this.checkUserExists(email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }
    const signupVerifyToken = uuid.v1();
    // await this.saveUser(name, email, password, signupVerifyToken);
    // await this.saveUserUsingQueryRunner(name, email, password, signupVerifyToken);
    await this.saveUserUsingTransaction(
      name,
      email,
      password,
      signupVerifyToken,
    );
    await this.sendMemberJoinEmail(email, signupVerifyToken);
  }



  private async checkUserExists(emailAddress: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({
      where: {
        email: emailAddress,
      },
    });
    return user !== null;
  }



  private async saveUser(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const user = new UserEntity();
    user.id = ulid();
    user.name = name;
    user.email = email;
    user.password = password;
    user.signupVerifyToken = signupVerifyToken;
    await this.usersRepository.save(user);
  }


  private async saveUserUsingQueryRunner(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;
      await queryRunner.manager.save(user);
      // throw new InternalServerErrorException(); 
      await queryRunner.commitTransaction();
    } catch (e) {
      // 에러가 발생하면 롤백
      await queryRunner.rollbackTransaction();
    } finally {
      // 직접 생성한 QueryRunner는 해제시켜 주어야 함
      await queryRunner.release();
    }
  }



  private async saveUserUsingTransaction(
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) {
    await this.dataSource.transaction(async (manager) => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }



  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }



  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      // signupVerifyToken으로 회원가입 중인 유저를 찾음.
      where: { signupVerifyToken },
    });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    return this.authService.login({ // 로그인 처리를 요청함.
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }


  async login(email: string, password: string): Promise<string> {
    const user = await this.usersRepository.findOne({
      where: { email, password }, // 전달받은 이메일과 패스워드로 유저를 찾음.
    });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    return this.authService.login({ 
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }


  async getUserInfo(userId: string): Promise<UserInfo> { // 매개변수로 전달된 id를 이용하여 유저를 검색함.
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다');
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}


