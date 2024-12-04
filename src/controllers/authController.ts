import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';
import { sendEmail } from '../config/mailer';

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const signup = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, password, userType } = req.body;

        // Check if user already exists
        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate OTP
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Create user
        const result = await pool.query(
            'INSERT INTO users (first_name, last_name, email, password_hash, user_type, otp, otp_expiry) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [firstName, lastName, email, hashedPassword, userType, otp, otpExpiry]
        );

        // Send OTP email
        await sendEmail(
            email,
            'Verify Your Account',
            `Your OTP is: ${otp}. It will expire in 10 minutes.`
        );

        res.status(201).json({
            message: 'User created successfully. Please verify your email with the OTP sent.',
            userId: result.rows[0].id
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error creating user' });
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1 AND otp = $2 AND otp_expiry > NOW()',
            [email, otp]
        );

        if (result.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Update user verification status
        await pool.query(
            'UPDATE users SET is_verified = true, otp = NULL, otp_expiry = NULL WHERE email = $1',
            [email]
        );

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ message: 'Error verifying OTP' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = result.rows[0];

        // Check if user is verified
        if (!user.is_verified) {
            return res.status(401).json({ message: 'Please verify your email first' });
        }

        // Verify password
        const validPassword = await bcrypt.compare(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user.id, userType: user.user_type },
            process.env.JWT_SECRET!,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({
            token,
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                userType: user.user_type
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
}; 