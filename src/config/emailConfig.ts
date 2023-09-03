import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  // email이라는 '토큰'을 이용하여 ConfigFactory를 등록함.
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_AUTH_USER,
    pass: process.env.EMAIL_AUTH_PASSWORD,
  },
  baseUrl: process.env.EMAIL_BASE_URL,
}));
