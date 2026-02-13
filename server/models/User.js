import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false
    },
    lifeStage: {
        type: String,
        enum: ['Student', 'Early Career', 'Mid Career', 'Executive', 'Retirement', 'Transition', 'Other'],
        default: 'Other'
    },
    growthGoals: {
        type: [String],
        default: []
    },
    strengths: {
        type: [String],
        default: []
    },
    growthStatement: {
        type: String,
        maxlength: 500
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    joinedCommunities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', userSchema);
