import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import emailConfig from './config/emailConfig';
import { validationSchema } from './config/validationSchema';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      envFilePath: ['${__dirname}/config/env/.${process.env.NODE_ENV}.env'], // 환경변수 파일의 경로를 지정함.
      load: [emailConfig], // 앞에서 구성해둔 ConfigFactory를 지정함.
      isGlobal: true, // 전역 모듈로 동작하게 함으로써 어느 모듈에서나 사용할 수 있도록 해줌.
      validationSchema, // 환경변수에 대한 유효성 검사 객체를 지정함.
    }),

    TypeOrmModule.forRoot({
      type: 'mysql', // type 속성에 '이용하려는 데이터베이스'를 지정함.
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'test',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts, .js}'], // entities속성에 'TypeORM이 구동될때 인식할 엔티티의 경로' 혹은 '엔티티명'을 지정함.
      synchronize: true, // synchronize속성에 '소스 코드 기반으로 데이터베이스 스키마를 동기화할지 여부'를 지정함.
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
