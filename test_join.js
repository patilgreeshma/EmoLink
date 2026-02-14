
import mongoose from 'mongoose';
import User from './server/models/User.js';
import Community from './server/models/Community.js';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const API_URL = 'http://localhost:5000/api';

async function testJoinCommunity() {
    let connection;
    try {
        connection = await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // 0. Clean up existing test user to ensure fresh start with known password
        await User.findOneAndDelete({ email: 'testjoin@example.com' });
        console.log('Cleaned up existing test user');

        // 1. Register a test user via API to ensure password hashing
        try {
            await axios.post(`${API_URL}/auth/register`, {
                name: 'Test Join User',
                email: 'testjoin@example.com',
                password: 'password123',
                lifeStage: 'Early Career'
            });
            console.log('Registered test user');
        } catch (e) {
            // Ignore if already exists
            if (e.response?.status !== 400) {
                console.error('Registration failed:', e.message);
            } else {
                console.log('User already exists');
            }
        }

        let testUser = await User.findOne({ email: 'testjoin@example.com' });

        // 2. Login to get token
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'testjoin@example.com',
            password: 'password123'
        });
        const token = loginRes.data.token;
        console.log('Got auth token');

        // 3. Get or Create a community
        let community = await Community.findOne({ name: 'Test Community' });
        if (!community) {
            community = await Community.create({
                name: 'Test Community',
                description: 'A community for testing joins',
                createdBy: testUser._id,
                members: [testUser._id]
            });
            console.log('Created test community');
        } else {
            // Ensure test user is NOT in it initially to test join
            await Community.findByIdAndUpdate(community._id, { $pull: { members: testUser._id } });
            await User.findByIdAndUpdate(testUser._id, { $pull: { joinedCommunities: community._id } });
            console.log('Removed user from community for testing');
        }

        // 4. Try to join
        console.log(`Attempting to join community ${community._id}...`);
        try {
            const joinRes = await axios.post(
                `${API_URL}/communities/${community._id}/join`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            console.log('Join Response:', joinRes.data);
        } catch (e) {
            console.error('Join API failed:', e.response?.data || e.message);
        }

        // 5. Verify in DB
        const updatedCommunity = await Community.findById(community._id);
        const isMember = updatedCommunity.members.some(m => m.toString() === testUser._id.toString());
        console.log(`User in community members? ${isMember}`);

    } catch (err) {
        console.error('Error:', err);
    } finally {
        if (connection) await mongoose.disconnect();
    }
}

testJoinCommunity();
