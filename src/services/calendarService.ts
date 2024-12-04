import { google } from 'googleapis';
import dotenv from 'dotenv';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
    access_token: 'ya29.a0AeDClZCqte91zWPeqa4otecI_CsYYc9C8f3mbgeGVbTC9jSbbyCylsYs0zZhFHKVb1XNO32FCY7nkWb5awOTzvlOGQ9P0VreEnnns5MOwmSTKfoMPJ86HRdwNNstQBf3KTwzFUX3NcqZDsi17Wzeh70awL11tjOLUfxRrcxuaCgYKAcUSARASFQHGX2Mi9sC2rcdrkPW2GqmPSuOO3A0175',
    refresh_token: '1//0g3DFim6IY2FJCgYIARAAGBASNwF-L9Irn4qtORcq1C3K-wf1jkyiLwUuxy4yIE2vBVhWRoc0I0oArD6M2q19JhqyaPc-58EmndM',
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

export const createCalendarEvent = async (
    userEmail: string,
    speakerEmail: string,
    summary: string,
    description: string,
    startTime: Date,
    endTime: Date
) => {
    try {
        const event = {
            summary,
            description,
            start: {
                dateTime: startTime.toISOString(),
                timeZone: 'UTC',
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: 'UTC',
            },
            attendees: [
                { email: userEmail },
                { email: speakerEmail },
            ],
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 30 },
                ],
            },
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            requestBody: event,
            sendUpdates: 'all',
        });

        return response.data;
    } catch (error) {
        console.error('Error creating calendar event:', error);
        throw error;
    }
}; 