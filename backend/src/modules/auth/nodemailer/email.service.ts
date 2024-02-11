import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { GOOGLE } from '../constants';

@Injectable()
export class Email2FAService {
	private transporter;

	constructor() {
		this.transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com', // Provide your SMTP server details
			port: 587, // Use the appropriate port for your SMTP server
			secure: false, // Set to true if using a secure connection (e.g., SSL/TLS)
			auth: {
				user: 'transcendenceauthentification@gmail.com',
				pass: GOOGLE,
			},
		});
	}

	async sendMail(to: string, subject: string, text: string): Promise<void> {
		const mailOptions = {
			from: 'transcendenceauthentification@gmail.com',
			to,
			subject,
			html: text,
		};

		try {
			await this.transporter.sendMail(mailOptions);
			// // console.log('Email sent successfully.');
		} catch (error: any) {
			console.error('Error sending email:', error.message);
			// throw new Error('Failed to send email.');
		}
	}

	async sendEmail(mail: string, login: string, code: string): Promise<string> {
		const subject = 'Transcendance : 2FA Code';

		const text = `
<body style="font-family: Arial, sans-serif; color: #333;">

<p>   Dear ${login},</p>


<p style="margin-bottom: 10px;">
Thank you for signing up in Transcendance! To complete your registration, here is your verification code:
</p>

<p style="color: red; font-weight: bold; font-family: 'font-sans'; font-size: 2em;">
    ${code}
</p>

<p>
If you did not sign up for Transcendance, please ignore this email.
</p>


<p style="font-weight: bold;">
The Transcendance Team
</p>

</body>
    `;

		await this.sendMail(mail, subject, text);

		return 'Email sent!';
	}
}
