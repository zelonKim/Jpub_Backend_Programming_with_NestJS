import Mail = require('nodemailer/lib/mailer');
import * as nodemailer from 'nodemailer';

import { Injectable } from '@nestjs/common';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

@Injectable()
export class EmailService {
  private transporter: Mail;

  constructor() {
    this.transporter = nodemailer.createTransport({
      // createTransport를 통해 트랜스포터 객체를 생성함.
      service: 'Gmail',
      auth: {
        user: 'ksz18601@gmail.com',
        pass: 'prslgfnvrbsmfufc',
      },
    });
  }

  async sendMemberJoinVerification(
    emailAddress: string,
    signupVerifyToken: string,
  ) {
    const baseUrl = 'http://localhost:3000';

    const url = `${baseUrl}/users/email-verify?signupVerifyToken=${signupVerifyToken}`; // 해당 링크를 통해 다시 서비스로 이메일 인증요청이 들어옴.

    const mailOptions: EmailOptions = {
      to: emailAddress,
      subject: '가입 인증 메일',
      html: `
            가입 확인 버튼을 누르시면 가입 인증이 완료됩니다 <br/>
            <form action="${url}" method="POST">
                <button>가입 확인</button>
            </form>    
        `,
    };

    return await this.transporter.sendMail(mailOptions); // 트랜스포터 객체를 통해 메일을 전송함.
  }
}
