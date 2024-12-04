import express, { Request, Response } from 'express';
import { getAvailableSlots, createBooking, getUserBookings, getSpeakerBookings } from '../controllers/bookingController';
import { authenticateToken, checkRole } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/bookings/slots:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get available time slots
 *     description: Get available time slots for a specific speaker on a given date (Protected)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: speakerId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the speaker
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date for slot availability (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Available time slots retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 availableSlots:
 *                   type: array
 *                   items:
 *                     type: string
 *                     example: "09:00"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Speaker not found
 */
router.get('/slots', 
    authenticateToken,
    (req: Request, res: Response) => {
        getAvailableSlots(req, res).catch(err => {
            console.error('Get slots error:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
    }
);

/**
 * @swagger
 * /api/bookings:
 *   post:
 *     tags:
 *       - Bookings
 *     summary: Create a new booking
 *     description: Book a session with a speaker (Protected - Users only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - speakerId
 *               - date
 *               - timeSlot
 *             properties:
 *               speakerId:
 *                 type: integer
 *                 description: ID of the speaker to book
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the session (YYYY-MM-DD)
 *               timeSlot:
 *                 type: string
 *                 description: Time slot for the session (HH:mm)
 *     responses:
 *       201:
 *         description: Booking created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 booking:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     speakerId:
 *                       type: integer
 *                     date:
 *                       type: string
 *                     timeSlot:
 *                       type: string
 *                     status:
 *                       type: string
 *       400:
 *         description: Invalid input or slot already booked
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not authorized to book
 */
router.post('/',
    authenticateToken,
    checkRole(['user']),
    (req: Request, res: Response) => {
        createBooking(req, res).catch(err => {
            console.error('Create booking error:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
    }
);

/**
 * @swagger
 * /api/bookings/user:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get user's bookings
 *     description: Get all bookings for the authenticated user (Protected - Users only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   speakerId:
 *                     type: integer
 *                   speakerName:
 *                     type: string
 *                   date:
 *                     type: string
 *                   timeSlot:
 *                     type: string
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not authorized
 */
router.get('/user',
    authenticateToken,
    checkRole(['user']),
    (req: Request, res: Response) => {
        getUserBookings(req, res).catch(err => {
            console.error('Get user bookings error:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
    }
);

/**
 * @swagger
 * /api/bookings/speaker:
 *   get:
 *     tags:
 *       - Bookings
 *     summary: Get speaker's bookings
 *     description: Get all bookings for the authenticated speaker (Protected - Speakers only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Speaker bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   userName:
 *                     type: string
 *                   date:
 *                     type: string
 *                   timeSlot:
 *                     type: string
 *                   status:
 *                     type: string
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not a speaker
 */
router.get('/speaker',
    authenticateToken,
    checkRole(['speaker']),
    (req: Request, res: Response) => {
        getSpeakerBookings(req, res).catch(err => {
            console.error('Get speaker bookings error:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
    }
);

export default router; 