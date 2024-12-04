import { sendEmail } from './config/mailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmails = async () => {
    try {
        // Test 1: OTP Verification Email
        console.log('Testing OTP Verification Email...');
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        await sendEmail(
            process.env.SMTP_USER!,
            'Verify Your Account - Speaker Booking API',
            `
            <h1>Email Verification</h1>
            <p>Welcome to Speaker Booking Platform!</p>
            <p>Your OTP for account verification is: <strong>${otp}</strong></p>
            <p>This OTP will expire in 10 minutes.</p>
            <p>If you didn't request this verification, please ignore this email.</p>
            `
        );
        console.log('✓ OTP verification email sent successfully!\n');

        // Test 2: Booking Confirmation Email (User)
        console.log('Testing Booking Confirmation Email for User...');
        await sendEmail(
            process.env.SMTP_USER!,
            'Booking Confirmation - Speaker Session',
            `
            <h1>Booking Confirmation</h1>
            <h2>Your speaker session has been confirmed!</h2>
            <div style="margin: 20px 0; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
                <p><strong>Speaker:</strong> John Doe</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Time:</strong> 10:00 AM</p>
                <p><strong>Topic:</strong> Web Development</p>
            </div>
            <p>Please make sure to join the session on time.</p>
            <p>You will receive a calendar invitation separately.</p>
            `
        );
        console.log('✓ Booking confirmation email sent successfully!\n');

        // Test 3: Booking Notification Email (Speaker)
        console.log('Testing Booking Notification Email for Speaker...');
        await sendEmail(
            process.env.SMTP_USER!,
            'New Session Booking - Speaker Booking Platform',
            `
            <h1>New Session Booking</h1>
            <h2>You have a new session booked!</h2>
            <div style="margin: 20px 0; padding: 20px; background-color: #f5f5f5; border-radius: 5px;">
                <p><strong>Student:</strong> Jane Smith</p>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Time:</strong> 10:00 AM</p>
                <p><strong>Topic:</strong> Web Development</p>
            </div>
            <p>Please review the booking details and ensure your availability.</p>
            <p>A calendar invitation will be sent separately.</p>
            `
        );
        console.log('✓ Speaker notification email sent successfully!\n');

        console.log('All email tests completed successfully! ✨');
    } catch (error) {
        console.error('Error during email testing:', error);
    }
};

testEmails(); 