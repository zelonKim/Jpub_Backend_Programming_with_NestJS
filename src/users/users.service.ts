import * as uuid from 'uuid';
import { EmailService } from '../email/email.service';
import { Injectable, Scope } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { DataSource } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { ulid } from 'ulid';

@Injectable() 
export class UsersService {
  constructor(private emailService: EmailService, private dataSource: DataSource,
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>, // @InjectRespository()를 통해 레포지토리를 주입함.
    ) {}

  private async saveUserUsingQueryRunner(name: string, email: string, password: string, signupVerifyToken: string) {
    const queryRunner = this.dataSource.createQueryRunner(); // QueryRunner를 생성함.
    await queryRunner.connect(); // QueryRunner를 데이터베이스에 연결함.
    await queryRunner.startTransaction(); // 트랜잭션을 시작함.

    try {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user); 

      await queryRunner.commitTransaction();  // 트랜잭션을 커밋함.
    } 
    catch (e) {
      await queryRunner.rollbackTransaction(); // 에러가 발생하면 롤백을 수행함.
    } 
    finally {
      await queryRunner.release(); // queryRunner객체를 해제함.
    }
  }

///////////////////

  private async saveUserUsingTransaction(name: string, email: string, password: string, signupVerifyToken: string) {
    await this.dataSource.transaction(async manager => {
      const user = new UserEntity();
      user.id = ulid();
      user.name = name;
      user.email = email;
      user.password = password;
      user.signupVerifyToken = signupVerifyToken;
      
      await manager.save(user);

    })
  }



















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
