import { sendEmail } from './config/mailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
    try {
        await sendEmail(
            process.env.SMTP_USER!, // Send to yourself as a test
            'Test Email from Speaker Booking API',
            `
            <h1>Test Email</h1>
            <p>This is a test email to verify SMTP configuration.</p>
            <p>If you receive this email, your SMTP settings are working correctly!</p>
            `
        );
        console.log('Test email sent successfully!');
    } catch (error) {
        console.error('Error sending test email:', error);
    }
};

testEmail(); 