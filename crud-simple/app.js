// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const quizRoutes = require('./routes/quiz');
const questionRoutes = require('./routes/question');
const { authenticateJWT } = require('./middleware/authenticate');
const authRouter = require('./routes/auth');
const app = express();
const port = 3001; // Port your server will listen on

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/PE_2').then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});


// Middleware
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(authenticateJWT); // Apply JWT authentication middleware

// Routes
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/auth', authRouter);
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
