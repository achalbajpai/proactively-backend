import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface AuthResponse {
    token: string;
    message: string;
}

const API_URL = 'http://localhost:3000/api';

const testBookingFlow = async () => {
    try {
        // 1. Login as user
        console.log('1. Testing User Login...');
        const userLoginResponse = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
            email: 'axhalb05@gmail.com',
            password: 'Test123!@#'
        });
        console.log('✓ User Login Response:', userLoginResponse.data);
        const userToken = userLoginResponse.data.token;

        // 2. Get available time slots for a speaker
        console.log('\n2. Testing Get Available Slots...');
        const slotsResponse = await axios.get(
            `${API_URL}/bookings/slots?speakerId=1&date=2024-12-05`,
            {
                headers: { Authorization: `Bearer ${userToken}` }
            }
        );
        console.log('✓ Available Slots Response:', slotsResponse.data);

        // 3. Create a booking
        console.log('\n3. Testing Booking Creation...');
        const bookingResponse = await axios.post(
            `${API_URL}/bookings`,
            {
                speakerId: 1,
                date: '2024-12-05',
                timeSlot: '10:00'  // Updated format to match server
            },
            {
                headers: { Authorization: `Bearer ${userToken}` }
            }
        );
        console.log('✓ Booking Creation Response:', bookingResponse.data);

        // 4. Test double-booking prevention
        console.log('\n4. Testing Double-booking Prevention...');
        try {
            await axios.post(
                `${API_URL}/bookings`,
                {
                    speakerId: 1,
                    date: '2024-12-05',
                    timeSlot: '10:00'  // Updated format to match server
                },
                {
                    headers: { Authorization: `Bearer ${userToken}` }
                }
            );
        } catch (error: any) {
            if (error.response?.status === 400) {
                console.log('✓ Double-booking prevented successfully:', error.response.data);
            } else {
                throw error;
            }
        }

        // 5. View user's bookings
        console.log('\n5. Testing Get User Bookings...');
        const userBookingsResponse = await axios.get(
            `${API_URL}/bookings/user`,
            {
                headers: { Authorization: `Bearer ${userToken}` }
            }
        );
        console.log('✓ User Bookings Response:', userBookingsResponse.data);

        // 6. Login as speaker to view their bookings
        console.log('\n6. Testing Speaker Login...');
        const speakerLoginResponse = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
            email: 'axhalb05+speaker@gmail.com',
            password: 'Test123!@#'
        });
        console.log('✓ Speaker Login Response:', speakerLoginResponse.data);
        const speakerToken = speakerLoginResponse.data.token;

        // 7. View speaker's bookings
        console.log('\n7. Testing Get Speaker Bookings...');
        const speakerBookingsResponse = await axios.get(
            `${API_URL}/bookings/speaker`,
            {
                headers: { Authorization: `Bearer ${speakerToken}` }
            }
        );
        console.log('✓ Speaker Bookings Response:', speakerBookingsResponse.data);

    } catch (error: any) {
        console.error('Error during testing:');
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
            console.error('Headers:', error.response.headers);
        } else if (error.request) {
            console.error('No response received:', error.message);
        } else {
            console.error('Error:', error.message);
        }
    }
};

testBookingFlow(); 