import express from 'express';
import cors from 'cors';
import path from 'path';
import userRouter from './routes/userRoute.js';
import wardrobeRouter from './routes/wardrobeRoute.js';
import outfitRouter from './routes/outfitRoute.js';
import { fileURLToPath } from 'url';
import http from 'http';
import db from './config/db.js';

// import dotenv from 'dotenv';

// dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connect to frontend
app.use(cors());

app.use(express.static(path.join(__dirname, '../src')));

app.use('/users', userRouter);
app.use('/wardrobe', wardrobeRouter);
app.use('/outfits', outfitRouter);


const port = process.env.PORT || 5000;
// Create HTTP server
const server = http.createServer(app);
//test mongodb connection then start server
db()
.then(() => {
    server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
  server.on('error', (error) => {
    console.error('Server encountered an error:', error);
  });
})
