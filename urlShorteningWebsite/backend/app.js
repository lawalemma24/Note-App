require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db.config/dbConnections.JS');
const urlRoutes = require('../backend/routes/urlRoutes.js');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', urlRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))