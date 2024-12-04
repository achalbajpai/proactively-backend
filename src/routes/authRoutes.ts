import express, { Request, Response } from 'express';
import { signup, verifyOTP, login } from '../controllers/authController';

const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user or speaker
 *     description: Create a new user account with OTP verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *               - userType
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: User's first name
 *               lastName:
 *                 type: string
 *                 description: User's last name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password (min 6 characters)
 *               userType:
 *                 type: string
 *                 enum: [user, speaker]
 *                 description: Type of account
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully. Please verify your email with the OTP sent.
 *                 userId:
 *                   type: number
 *       400:
 *         description: Invalid input data
 *       409:
 *         description: Email already exists
 */
router.post('/signup', (req: Request, res: Response) => {
    signup(req, res).catch(err => {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Internal server error' });
    });
});

/**
 * @swagger
 * /api/auth/verify-otp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify email with OTP
 *     description: Verify user's email address using the OTP sent during registration
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - otp
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               otp:
 *                 type: string
 *                 description: 6-digit OTP received in email
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid OTP
 *       404:
 *         description: User not found
 */
router.post('/verify-otp', (req: Request, res: Response) => {
    verifyOTP(req, res).catch(err => {
        console.error('OTP verification error:', err);
        res.status(500).json({ message: 'Internal server error' });
    });
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticate user and get JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     userType:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 */
router.post('/login', (req: Request, res: Response) => {
    login(req, res).catch(err => {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Internal server error' });
    });
});

export default router; 