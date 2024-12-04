import { Request, Response } from 'express';
import { pool } from '../config/database';
import { sendEmail } from '../config/mailer';
import { createCalendarEvent } from '../services/calendarService';

const AVAILABLE_SLOTS = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];

export const getAvailableSlots = async (req: Request, res: Response) => {
    try {
        const { speakerId, date } = req.query;

        if (!speakerId || !date) {
            return res.status(400).json({ message: 'Speaker ID and date are required' });
        }

        // Get booked slots for the speaker on the given date
        const bookedSlots = await pool.query(
            'SELECT time_slot FROM bookings WHERE speaker_id = $1 AND booking_date = $2',
            [speakerId, date]
        );

        const bookedTimes = bookedSlots.rows.map(slot => slot.time_slot.slice(0, 5));
        const availableSlots = AVAILABLE_SLOTS.filter(slot => !bookedTimes.includes(slot));

        res.json({ availableSlots });
    } catch (error) {
        console.error('Get available slots error:', error);
        res.status(500).json({ message: 'Error fetching available slots' });
    }
};

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { speakerId, date, timeSlot } = req.body;
        const userId = req.user!.userId;

        // Validate time slot
        if (!AVAILABLE_SLOTS.includes(timeSlot)) {
            return res.status(400).json({ message: 'Invalid time slot' });
        }

        // Check if slot is already booked
        const existingBooking = await pool.query(
            'SELECT * FROM bookings WHERE speaker_id = $1 AND booking_date = $2 AND time_slot = $3',
            [speakerId, date, timeSlot]
        );

        if (existingBooking.rows.length > 0) {
            return res.status(400).json({ message: 'Time slot already booked' });
        }

        // Create booking
        const booking = await pool.query(
            'INSERT INTO bookings (user_id, speaker_id, booking_date, time_slot, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, speakerId, date, timeSlot, 'confirmed']
        );

        // Get user and speaker details for notifications
        const userResult = await pool.query(
            'SELECT email, first_name, last_name FROM users WHERE id = $1',
            [userId]
        );

        const speakerResult = await pool.query(`
            SELECT u.email, u.first_name, u.last_name, sp.expertise
            FROM users u
            JOIN speaker_profiles sp ON u.id = sp.user_id
            WHERE sp.id = $1
        `, [speakerId]);

        const user = userResult.rows[0];
        const speaker = speakerResult.rows[0];

        // Calculate event times
        const [hours, minutes] = timeSlot.split(':');
        const startTime = new Date(`${date}T${timeSlot}:00`);
        const endTime = new Date(startTime.getTime() + 60 * 60 * 1000); // 1 hour later

        // Create calendar event
        await createCalendarEvent(
            user.email,
            speaker.email,
            `Speaker Session: ${speaker.first_name} ${speaker.last_name}`,
            `Session with ${speaker.first_name} ${speaker.last_name} (${speaker.expertise})`,
            startTime,
            endTime
        );

        // Send confirmation emails
        await sendEmail(
            user.email,
            'Booking Confirmation',
            `Your session with ${speaker.first_name} ${speaker.last_name} is confirmed for ${date} at ${timeSlot}.`
        );

        await sendEmail(
            speaker.email,
            'New Session Booking',
            `You have a new session booked with ${user.first_name} ${user.last_name} for ${date} at ${timeSlot}.`
        );

        res.status(201).json({
            message: 'Booking created successfully',
            booking: booking.rows[0]
        });
    } catch (error) {
        console.error('Create booking error:', error);
        res.status(500).json({ message: 'Error creating booking' });
    }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;

        const result = await pool.query(`
            SELECT b.*, 
                   u.first_name as speaker_first_name, 
                   u.last_name as speaker_last_name,
                   sp.expertise
            FROM bookings b
            JOIN speaker_profiles sp ON b.speaker_id = sp.id
            JOIN users u ON sp.user_id = u.id
            WHERE b.user_id = $1
            ORDER BY b.booking_date DESC, b.time_slot DESC
        `, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Get user bookings error:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
};

export const getSpeakerBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.userId;

        const result = await pool.query(`
            SELECT b.*, 
                   u.first_name as user_first_name, 
                   u.last_name as user_last_name
            FROM bookings b
            JOIN users u ON b.user_id = u.id
            JOIN speaker_profiles sp ON b.speaker_id = sp.id
            WHERE sp.user_id = $1
            ORDER BY b.booking_date DESC, b.time_slot DESC
        `, [userId]);

        res.json(result.rows);
    } catch (error) {
        console.error('Get speaker bookings error:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
}; 