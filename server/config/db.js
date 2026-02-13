import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Attempt connecting with standard options.
        // If this fails with SSL error, it's likely an IP whitelist issue.
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);

        if (error.message.includes('bad auth') || error.message.includes('authentication failed')) {
            console.log('\n\x1b[31m%s\x1b[0m', '---- AUTHENTICATION ERROR ----');
            console.log('MongoDB Atlas rejected the password or username.');
            console.log('Please CHECK YOUR .env FILE:');
            console.log('1. Did you replace <password> with your actual password?');
            console.log('2. Is the username correct?');
            console.log('3. Did you allow Network Access from your IP?\n');
        } else {
            console.log('\n\x1b[33m%s\x1b[0m', '---- CONNECTION ERROR ----');
            console.log('If you see SSL or Timeout errors, check your MongoDB Atlas IP Whitelist.\n');
        }
        process.exit(1);
    }
};

export default connectDB;
