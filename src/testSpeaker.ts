import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

interface AuthResponse {
    token: string;
    message: string;
}

interface SpeakerProfile {
    expertise: string;
    pricePerSession: number;
    bio: string;
}

const API_URL = 'http://localhost:3000/api';

const testSpeakerFlow = async () => {
    try {
        // 1. Create a speaker account
        console.log('1. Testing Speaker Signup...');
        const signupResponse = await axios.post(`${API_URL}/auth/signup`, {
            firstName: 'Jane',
            lastName: 'Smith',
            email: 'axhalb05+speaker@gmail.com',
            password: 'Test123!@#',
            userType: 'speaker'
        });
        console.log('✓ Speaker Signup Response:', signupResponse.data);

        // Wait for OTP input
        console.log('\nPlease check your email for OTP and enter it below:');
        const otp = await new Promise<string>((resolve) => {
            process.stdin.once('data', (data) => {
                resolve(data.toString().trim());
            });
        });

        console.log('\n2. Testing Speaker OTP Verification...');
        const otpResponse = await axios.post(`${API_URL}/auth/verify-otp`, {
            email: 'axhalb05+speaker@gmail.com',
            otp
        });
        console.log('✓ OTP Verification Response:', otpResponse.data);

        // 3. Login as speaker
        console.log('\n3. Testing Speaker Login...');
        const loginResponse = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
            email: 'axhalb05+speaker@gmail.com',
            password: 'Test123!@#'
        });
        console.log('✓ Login Response:', loginResponse.data);

        // Get token for protected routes
        const token = loginResponse.data.token;

        // 4. Create speaker profile
        console.log('\n4. Testing Speaker Profile Creation...');
        const profileResponse = await axios.post<SpeakerProfile>(
            `${API_URL}/speakers/profile`,
            {
                expertise: 'Web Development',
                pricePerSession: 100,
                bio: 'Experienced web developer with 10 years of experience'
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        console.log('✓ Profile Creation Response:', profileResponse.data);

        // 5. Update speaker profile
        console.log('\n5. Testing Speaker Profile Update...');
        const updateResponse = await axios.put(
            `${API_URL}/speakers/profile`,
            {
                expertise: 'Web Development & Cloud Computing',
                pricePerSession: 120,
                bio: 'Experienced web developer and cloud architect with 10 years of experience'
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        );
        console.log('✓ Profile Update Response:', updateResponse.data);

        // 6. Get all speakers (public route)
        console.log('\n6. Testing Get All Speakers...');
        const speakersResponse = await axios.get(`${API_URL}/speakers`);
        console.log('✓ Get Speakers Response:', speakersResponse.data);

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

testSpeakerFlow(); 