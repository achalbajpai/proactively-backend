import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject,
            html,
        });
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}; 