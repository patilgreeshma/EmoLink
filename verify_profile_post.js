import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const API_URL = 'http://localhost:5000/api';
let token;
let userId;

async function run() {
    try {
        console.log('--- Starting Profile & Post Verification ---');

        // 1. Create User & Login
        const email = `testuser_${Date.now()}@example.com`;
        const password = 'password123';

        console.log(`Creating user: ${email}...`);
        await axios.post(`${API_URL}/auth/register`, {
            name: 'Test Profile User',
            email,
            password,
            lifeStage: 'Early Career'
        });

        console.log('Logging in...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email,
            password
        });
        token = loginRes.data.token;
        userId = loginRes.data._id;
        console.log('Logged in as:', loginRes.data.name);

        // 2. Create Post with Image
        console.log('Creating post with image...');
        const form = new FormData();
        form.append('content', 'This is a test post with an image');
        form.append('image', fs.createReadStream('test_image.jpg'));

        // Axios with FormData
        const postRes = await axios.post(`${API_URL}/posts`, form, {
            headers: {
                ...form.getHeaders(),
                Authorization: `Bearer ${token}`
            }
        });
        console.log('Post created:', postRes.data._id);
        if (!postRes.data.image || !postRes.data.image.includes('uploads')) {
            throw new Error('Image path missing in post response');
        }
        console.log('Image path verified:', postRes.data.image);

        // 3. Update Profile
        console.log('Updating profile...');
        const updateRes = await axios.put(`${API_URL}/users/profile`, {
            growthStatement: 'I am growing every day!',
            strengths: ['Coding', 'Debugging']
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile updated:', updateRes.data.growthStatement);
        if (updateRes.data.growthStatement !== 'I am growing every day!') {
            throw new Error('Profile update failed');
        }

        // 4. Get Profile (Check populate)
        console.log('Fetching profile to check lists...');
        const profileRes = await axios.get(`${API_URL}/users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Followers count:', profileRes.data.followers.length);
        console.log('Following count:', profileRes.data.following.length);

        // Check if populated (should be objects, not just strings)
        if (profileRes.data.followers.length > 0 && typeof profileRes.data.followers[0] === 'string') {
            console.warn('Warning: Followers might not be populated (seen as strings)');
        } else if (profileRes.data.followers.length > 0) {
            console.log('Followers populated correctly (User objects)');
        }

        console.log('--- Verification Success ---');

    } catch (error) {
        console.error('Verification Failed:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
        process.exit(1);
    }
}

run();
