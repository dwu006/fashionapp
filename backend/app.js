import express from 'express';
import cors from 'cors';
import path from 'path';
import userRoutes from './routes/userRoute.js';
import wardrobeRoutes from './routes/wardrobeRoute.js'
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

// Enable CORS for frontend connections
app.use(cors());

// Connection to frontend
app.use(express.static(path.join(__dirname, '../src')));

// API Routes: Adjust the route prefixes as needed
app.use('/api/users', userRoutes);
app.use('/api/wardrobe', wardrobeRoutes);

export default app;