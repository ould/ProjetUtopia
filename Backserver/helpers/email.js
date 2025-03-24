import nodemailer from 'nodemailer';

module.exports = {

    envoyerMail: async (to, subject, text) => {
        sendEmail(to, subject, text);
    },
};

async function sendEmail(to, subject, text, html = null) {
    let transporter = nodemailer.createTransport({
        service: process.env.MAIL_HOST, 
        port: process.env.MAIL_PORT,
        secure: true,
        auth: {
            user:  process.env.MAIL_USER, 
            pass:  process.env.MAIL_MDP,
        },
    });
    const mailOptions = {
        from:  process.env.MAIL_EXP, 
        to: "denishellal@gmail.com",
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}