
import mongoose from 'mongoose';
import User from './server/models/User.js';
import Post from './server/models/Post.js';
import dotenv from 'dotenv';
dotenv.config();

async function checkAndSeed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();

        console.log(`Current Database Stats: Users=${userCount}, Posts=${postCount}`);

        if (postCount < 3) {
            console.log('Seeding data...');

            // Create a seed user if none exists
            let seedUser = await User.findOne({ email: 'seed@example.com' });
            if (!seedUser) {
                seedUser = await User.create({
                    name: 'Seed User',
                    email: 'seed@example.com',
                    password: 'password123',
                    lifeStage: 'Mid Career'
                });
            }

            await Post.create([
                {
                    author: seedUser._id,
                    content: 'This is a seed post visible to everyone!',
                    growthTags: ['Visibility Test']
                },
                {
                    author: seedUser._id,
                    content: 'Another seed post to populate the feed.',
                    growthTags: ['Community']
                }
            ]);
            console.log('Seeded 2 posts.');
        } else {
            console.log('Database has sufficient data.');
        }

    } catch (err) {
        console.error('Error:', err);
    } finally {
        await mongoose.disconnect();
    }
}

checkAndSeed();
