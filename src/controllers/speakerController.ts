import { Request, Response } from 'express';
import { pool } from '../config/database';

export const createProfile = async (req: Request, res: Response) => {
    try {
        const { expertise, pricePerSession, bio } = req.body;
        const userId = req.user!.userId;

        // Check if profile already exists
        const existingProfile = await pool.query(
            'SELECT * FROM speaker_profiles WHERE user_id = $1',
            [userId]
        );

        if (existingProfile.rows.length > 0) {
            return res.status(400).json({ message: 'Speaker profile already exists' });
        }

        // Create speaker profile
        const result = await pool.query(
            'INSERT INTO speaker_profiles (user_id, expertise, price_per_session, bio) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, expertise, pricePerSession, bio]
        );

        res.status(201).json({
            message: 'Speaker profile created successfully',
            profile: result.rows[0]
        });
    } catch (error) {
        console.error('Create profile error:', error);
        res.status(500).json({ message: 'Error creating speaker profile' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { expertise, pricePerSession, bio } = req.body;
        const userId = req.user!.userId;

        const result = await pool.query(
            'UPDATE speaker_profiles SET expertise = $1, price_per_session = $2, bio = $3 WHERE user_id = $4 RETURNING *',
            [expertise, pricePerSession, bio, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Speaker profile not found' });
        }

        res.json({
            message: 'Speaker profile updated successfully',
            profile: result.rows[0]
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Error updating speaker profile' });
    }
};

export const getAllSpeakers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query(`
            SELECT sp.*, u.first_name, u.last_name, u.email 
            FROM speaker_profiles sp
            JOIN users u ON sp.user_id = u.id
            WHERE u.is_verified = true
        `);

        res.json(result.rows);
    } catch (error) {
        console.error('Get speakers error:', error);
        res.status(500).json({ message: 'Error fetching speakers' });
    }
};

export const getSpeakerById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const result = await pool.query(`
            SELECT sp.*, u.first_name, u.last_name, u.email 
            FROM speaker_profiles sp
            JOIN users u ON sp.user_id = u.id
            WHERE sp.id = $1 AND u.is_verified = true
        `, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Speaker not found' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Get speaker error:', error);
        res.status(500).json({ message: 'Error fetching speaker details' });
    }
}; 