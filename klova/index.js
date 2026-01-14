// server.js - FIXED VERSION
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const ideaRoutes = require('./route/ideaRoute.js');
const kollabRoutes = require('./route/kollab.js');
const discussionRoutes = require('./route/discussionRoute.js');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGOURL).then(() => {
  console.log(' Connected to MongoDB');
}).catch(err => {
  console.error(' MongoDB connection error:', err);
});

app.get('/test', (req, res) => {
  res.send('Welcome to the Kollab API');
});


// Routes - IMPORTANT: Define parameterized routes LAST
app.use('/ideas', ideaRoutes);
app.use('/kollabs', kollabRoutes);  // Base kollabs routes
app.use('/kollabs/:id/discussions', discussionRoutes);
// app.use('/discussions', discussionRoutes);  // Adjusted base route



app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);

});