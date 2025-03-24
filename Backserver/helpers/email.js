const nodemailer = require('nodemailer');

class EmailHelper {
    constructor() {
        this.transporter = nodemailer.createTransport({
            service: process.env.MAIL_HOST, 
            port: process.env.MAIL_PORT,
            secure: true,
            auth: {
                user: 'your-email@gmail.com', // Replace with your email
                pass: 'your-email-password', // Replace with your email password
            },
        });
    }

    async sendEmail(to, subject, text, html = null) {
        const mailOptions = {
            from: 'your-email@gmail.com', // Replace with your email
            to,
            subject,
            text,
            html,
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            return info;
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    }
}

module.exports = EmailHelper;