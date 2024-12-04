import express, { Request, Response } from 'express';
import { createProfile, updateProfile, getAllSpeakers, getSpeakerById } from '../controllers/speakerController';
import { authenticateToken, checkRole } from '../middleware/auth';

const router = express.Router();

/**
 * @swagger
 * /api/speakers:
 *   get:
 *     tags:
 *       - Speakers
 *     summary: Get all speakers
 *     description: Retrieve a list of all verified speakers with their profiles
 *     responses:
 *       200:
 *         description: List of speakers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   expertise:
 *                     type: string
 *                   pricePerSession:
 *                     type: number
 *                   bio:
 *                     type: string
 */
router.get('/', (req: Request, res: Response) => {
    getAllSpeakers(req, res).catch(err => {
        console.error('Get speakers error:', err);
        res.status(500).json({ message: 'Internal server error' });
    });
});

/**
 * @swagger
 * /api/speakers/{id}:
 *   get:
 *     tags:
 *       - Speakers
 *     summary: Get speaker by ID
 *     description: Retrieve detailed information about a specific speaker
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Speaker ID
 *     responses:
 *       200:
 *         description: Speaker details retrieved successfully
 *       404:
 *         description: Speaker not found
 */
router.get('/:id', (req: Request, res: Response) => {
    getSpeakerById(req, res).catch(err => {
        console.error('Get speaker error:', err);
        res.status(500).json({ message: 'Internal server error' });
    });
});

/**
 * @swagger
 * /api/speakers/profile:
 *   post:
 *     tags:
 *       - Speakers
 *     summary: Create speaker profile
 *     description: Create a new speaker profile (Protected - Speakers only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - expertise
 *               - pricePerSession
 *             properties:
 *               expertise:
 *                 type: string
 *                 description: Speaker's area of expertise
 *               pricePerSession:
 *                 type: number
 *                 description: Price per hour session
 *               bio:
 *                 type: string
 *                 description: Speaker's biography
 *     responses:
 *       201:
 *         description: Speaker profile created successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not a speaker
 */
router.post('/profile', 
    authenticateToken,
    checkRole(['speaker']),
    (req: Request, res: Response) => {
        createProfile(req, res).catch(err => {
            console.error('Create profile error:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
    }
);

/**
 * @swagger
 * /api/speakers/profile:
 *   put:
 *     tags:
 *       - Speakers
 *     summary: Update speaker profile
 *     description: Update existing speaker profile (Protected - Speakers only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               expertise:
 *                 type: string
 *                 description: Speaker's area of expertise
 *               pricePerSession:
 *                 type: number
 *                 description: Price per hour session
 *               bio:
 *                 type: string
 *                 description: Speaker's biography
 *     responses:
 *       200:
 *         description: Speaker profile updated successfully
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - User is not a speaker
 *       404:
 *         description: Profile not found
 */
router.put('/profile',
    authenticateToken,
    checkRole(['speaker']),
    (req: Request, res: Response) => {
        updateProfile(req, res).catch(err => {
            console.error('Update profile error:', err);
            res.status(500).json({ message: 'Internal server error' });
        });
    }
);

export default router; 