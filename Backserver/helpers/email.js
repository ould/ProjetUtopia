const nodemailer=  require('nodemailer');
const {logInfo, logErreur} = require('./logs');

module.exports ={

    envoyerMail: async (to, subject, text) => {
        await sendEmail(to, subject, text);
    },
};

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST, 
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user:  process.env.MAIL_USER, 
        pass:  process.env.MAIL_MDP,
    },
});

async function sendEmail(to, subject, text, html = null) {
   
    if(process.env.ENVIRONNEMENT !== 'production'){
        to = process.env.MAIL_BACKOFFICE;
    }

    const mailOptions = {
        from:  process.env.MAIL_EXP, 
        to,
        subject,
        text,
        html,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        logInfo('Email sent: ' + info.response);
        return info;
    } catch (error) {
        logErreur('Error sending email:' + error);
        throw error;
    }
}