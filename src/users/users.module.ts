import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]) // forFeature()메서드로 해당 모듈내에서 사용할 엔티티를 등록함.
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
