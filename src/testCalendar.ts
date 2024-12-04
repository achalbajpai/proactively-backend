import { createCalendarEvent } from './services/calendarService';
import dotenv from 'dotenv';

dotenv.config();

const testCalendarIntegration = async () => {
    try {
        console.log('Testing Google Calendar Integration...');

        // Create a test event for tomorrow at 10 AM
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(10, 0, 0, 0);

        const endTime = new Date(tomorrow);
        endTime.setHours(11, 0, 0, 0); // 1-hour session

        const event = await createCalendarEvent(
            process.env.SMTP_USER!, // User email
            process.env.SMTP_USER!, // Speaker email (using same email for testing)
            'Test Speaker Session',
            'This is a test speaker session to verify calendar integration.',
            tomorrow,
            endTime
        );

        console.log('✓ Calendar event created successfully!');
        console.log('Event details:', {
            id: event.id,
            summary: event.summary,
            start: event.start?.dateTime,
            end: event.end?.dateTime,
            attendees: event.attendees
        });
    } catch (error) {
        console.error('Error testing calendar integration:', error);
    }
};

testCalendarIntegration(); 