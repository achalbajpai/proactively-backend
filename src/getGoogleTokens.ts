import { google } from 'googleapis';
import dotenv from 'dotenv';
import http from 'http';
import url from 'url';

dotenv.config();

const PORT = 3001;
const REDIRECT_URI = `http://localhost:${PORT}/auth/google/callback`;

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    REDIRECT_URI
);

const scopes = [
    'https://www.googleapis.com/auth/calendar.events'
];

async function getAccessToken() {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });

    console.log('Please visit this URL to authorize the application:', authUrl);

    // Create local server to receive the OAuth2 callback
    const server = http.createServer(async (req, res) => {
        try {
            const queryObject = url.parse(req.url!, true).query;
            const code = queryObject.code as string;

            if (code) {
                // Get tokens
                const { tokens } = await oauth2Client.getToken(code);
                console.log('\nOAuth2 tokens received:', tokens);
                console.log('\nAdd these tokens to your calendarService.ts file:');
                console.log(`access_token: '${tokens.access_token}'`);
                console.log(`refresh_token: '${tokens.refresh_token}'`);

                res.end('Authentication successful! You can close this window.');
                server.close();
            }
        } catch (error) {
            console.error('Error getting tokens:', error);
            res.end('Authentication failed! Please check the console.');
            server.close();
        }
    });

    server.listen(PORT, () => {
        console.log(`\nListening for OAuth2 callback on http://localhost:${PORT}`);
    });
}

getAccessToken(); 