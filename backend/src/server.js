import express from 'express';
import notesRoutes from '../src/routes/noteroutes.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import { useEffect } from 'react';

dotenv.config();

const app = express();

// Middleware to log requests (optional)
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
  
// });
app.use(express.json());

// CORS
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));



// Parse JSON with verification to capture raw body
// app.use(express.json({
//   verify: (req, res, buf, encoding) => {
//     // Store the raw body in the request object
//     req.rawBody = buf.toString(encoding || 'utf8');
//   }
// }));

const PORT = process.env.PORT || 3000;

// Routes
app.use("/api/notes", notesRoutes);
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Error handler for JSON parsing
// Remove or update the error handler that uses next()
app.use((err, req, res, next) => {  // This should be at the END of middleware chain
  console.error('Server error:', err.stack);
  
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      error: 'Invalid JSON format in request body',
      message: err.message 
    });
  }
  
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// General error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});