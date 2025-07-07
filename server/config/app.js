const express = require('express');
const cors = require('cors');
const app = express();
const challengeRoutes = require('../routes/ChallengeRouter');
const userRoutes = require('../routes/UserRouter');
const uploadRoutes = require('../routes/UploadRouter');
const errorHandler = require('../middleware/errorHandler');
const { rateLimiter, startLimiterCleanup } = require('../middleware/limiter');

app.use(cors({ origin: process.env.SERVER_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());
app.use('/uploads', express.static('uploads'));
startLimiterCleanup();
app.use('/api', rateLimiter);
app.use('/api/uploads', uploadRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler)
module.exports = app;
