// email.service.ts
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { GOOGLE } from '../constants';

console.log('GOOGLE ', GOOGLE);

@Injectable()
export class EmailService {
  private transporter;


  constructor() {
      this.transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com', // Provide your SMTP server details
      port: 587, // Use the appropriate port for your SMTP server
      secure: false, // Set to true if using a secure connection (e.g., SSL/TLS)
      auth: {
        user: 'imad.mimouni.123@gmail.com',
        pass: GOOGLE,
      },
    });
}

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: 'imad.mimouni.123@gmail.com',
      to,
      subject,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully.');
    } catch (error : any) {
      console.error('Error sending email:', error.message);
      throw new Error('Failed to send email.');
    }
  }
}
