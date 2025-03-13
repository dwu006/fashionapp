import express from 'express';
import cors from 'cors';
import path from 'path';
import userRouter from './routes/userRoute.js';
import wardrobeRouter from './routes/wardrobeRoute.js';
import outfitRouter from './routes/outfitRoute.js';
import aiRouter from './routes/aiRoute.js';
import donationCentersRoute from './api/donation_centers_api.js';
import { fileURLToPath } from 'url';
import http from 'http';
import db from './config/db.js';
import dotenv from 'dotenv';
import fs from 'fs'; // Added for directory creation

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect to frontend
app.use(cors());

app.use(express.static(path.join(__dirname, '../src')));

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve static files from uploads directory
app.use('/uploads', express.static(uploadsDir));

app.use('/users', userRouter);
app.use('/wardrobe', wardrobeRouter);
app.use('/outfits', outfitRouter);
app.use('/ai', aiRouter);
app.use('/api', donationCentersRoute);

export const port = process.env.PORT || 5001;

const server = http.createServer(app);
db()
.then(() => {
    server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

  server.on('error', (error) => {
    console.error('Server encountered an error:', error);
  });
});

export default app;