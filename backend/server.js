import http from 'http';
import app from './app.js';
import db from './config/db.js';

const port = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);
db()
.then(() => {
    // Start server
    server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
  server.on('error', (error) => {
    console.error('Server encountered an error:', error);
  });
})

