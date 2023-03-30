import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.SERVER_EMAIL,
      pass: process.env.SERVER_APP_PASSWORD
    }
});

const mailer = (recipient, title, context) => {
    const mailOptions = {
        from: 'playreminder2023@gmail.com',
        to: recipient,
        subject: title,
        html: context
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

export default mailer;
