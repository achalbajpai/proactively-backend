import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface AuthResponse {
    token: string;
    message: string;
}

const API_URL = 'http://localhost:3000/api';

const testAuthFlow = async () => {
    try {
        console.log('1. Testing User Signup...');
        const signupResponse = await axios.post(`${API_URL}/auth/signup`, {
            firstName: 'John',
            lastName: 'Doe',
            email: 'axhalb05@gmail.com',
            password: 'Test123!@#',
            userType: 'user'
        });
        console.log('✓ Signup Response:', signupResponse.data);

        // Wait for OTP input
        console.log('\nPlease check your email for OTP and enter it below:');
        const otp = await new Promise<string>((resolve) => {
            process.stdin.once('data', (data) => {
                resolve(data.toString().trim());
            });
        });

        console.log('\n2. Testing OTP Verification...');
        const otpResponse = await axios.post(`${API_URL}/auth/verify-otp`, {
            email: 'axhalb05@gmail.com',
            otp
        });
        console.log('✓ OTP Verification Response:', otpResponse.data);

        console.log('\n3. Testing Login...');
        const loginResponse = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
            email: 'axhalb05@gmail.com',
            password: 'Test123!@#'
        });
        console.log('✓ Login Response:', loginResponse.data);

        // Test protected route with token
        const token = loginResponse.data.token;
        console.log('\n4. Testing Protected Route Access...');
        const protectedResponse = await axios.get(`${API_URL}/speakers`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('✓ Protected Route Response:', protectedResponse.data);

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

testAuthFlow(); 