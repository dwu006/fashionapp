import express from 'express';
import cors from 'cors';
import path from 'path';
import userRouter from './routes/userRoute.js';
import wardrobeRouter from './routes/wardrobeRoute.js';
import { fileURLToPath } from 'url';
// import dotenv from 'dotenv';

// dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect to frontend
app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:5173',
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   allowedHeaders: ['Content-Type']
// }));

app.use(express.static(path.join(__dirname, '../src')));

app.use('/users', userRouter);
app.use('/wardrobe', wardrobeRouter);

export default app;