const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const sanitize = require('./middleware/sanitize');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const goalRoutes = require('./routes/goalRoutes');
const noteRoutes = require('./routes/noteRoutes');
const examRoutes = require('./routes/examRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const pomodoroStatsRoutes = require('./routes/pomodoroStatsRoutes');
const streakRoutes = require('./routes/streakRoutes');
const examPrepRoutes = require('./routes/examPrepRoutes');

const app = express();

// Disable ETag caching so authenticated user switches never receive stale 304 JSON
app.set('etag', false);
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

// Body & Cookie parsers
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

// Security headers & Express 5-safe payload sanitization
app.use(helmet());
app.use(sanitize);

// CORS
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: [allowedOrigin, 'http://127.0.0.1:5173'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Compression & Request logging
app.use(compression());
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  const accessLogStream = fs.createWriteStream(path.join(logsDir, 'access.log'), { flags: 'a' });
  app.use(morgan('combined', { stream: accessLogStream }));
}

// Root & Health Check endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    name: 'StudySync API',
    status: 'running',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    uptime: Math.floor(process.uptime()),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Mount routes (with singular & plural aliases)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/subjects', '/api/subject', '/subjects', '/subject'], subjectRoutes);
app.use(['/api/tasks', '/api/task', '/tasks', '/task'], taskRoutes);
app.use(['/api/schedules', '/api/schedule', '/schedules', '/schedule'], scheduleRoutes);
app.use(['/api/goals', '/api/goal', '/goals', '/goal'], goalRoutes);
app.use(['/api/notes', '/api/note', '/notes', '/note'], noteRoutes);
app.use(['/api/exams', '/api/exam', '/exams', '/exam'], examRoutes);
app.use(['/api/assignments', '/api/assignment', '/assignments', '/assignment'], assignmentRoutes);
app.use(['/api/pomodorostats', '/api/pomodoro', '/pomodorostats', '/pomodoro'], pomodoroStatsRoutes);
app.use(['/api/streaks', '/api/streak', '/streaks', '/streak'], streakRoutes);
app.use(['/api/examprep', '/api/v1/examprep', '/api/exam-prep', '/examprep'], examPrepRoutes);

// Catch-all 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
  });
});

// Centralized error handler
app.use(errorHandler);

module.exports = app;
