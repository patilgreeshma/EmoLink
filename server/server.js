import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { createServer } from 'http';
import { Server } from 'socket.io';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import communityRoutes from './routes/communityRoutes.js';
import matchRoutes from './routes/matchRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import aiChatRoutes from './routes/aiChatRoutes.js';

dotenv.config();

connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173", // Frontend URL
        methods: ["GET", "POST"]
    }
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/match', matchRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/ai-chat', aiChatRoutes);

// Serve static files
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files from the dist directory (Vite build output)
    // The dist folder is in the root, one level up from server/
    const rootDir = path.resolve(__dirname, '../');
    app.use(express.static(path.join(rootDir, 'dist')));

    // Handle React routing, return all requests to index.html
    app.get(/(.*)/, (req, res) => {
        res.sendFile(path.join(rootDir, 'dist', 'index.html'));
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}
// Error Middleware
app.use(errorHandler);

// Socket.io connection logic
io.on("connection", (socket) => {
    console.log("Connected to socket.io");

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log("User joined user-room:", userData._id);
        socket.emit("connected");
    });

    socket.on("join_chat", (room) => {
        socket.join(room);
        console.log("User joined chat-room: " + room);
    });

    socket.on("new_message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chatId;

        if (!chat.participants) return console.log("chat.participants not defined");

        chat.participants.forEach((user) => {
            if (user._id == newMessageRecieved.sender._id) return;

            socket.in(user._id).emit("message_received", newMessageRecieved);
        });
    });

    socket.on("off_setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
