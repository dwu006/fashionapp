import http from 'http';
import app from './app.js';
import db from './config/db.js';

const port = process.env.PORT || 5001;

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
