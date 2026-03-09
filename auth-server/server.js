console.log('Starting server.js');
require('dotenv').config();
console.log('Loading dotenv');

process.env.JWT_SECRET = 'your-secure-jwt-secret-here';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/novapivot_auth';

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');

// Initialize express app
const app = express();

// Connect to database
console.log('PORT from env:', process.env.PORT);
const PORT = process.env.PORT || 5002;
console.log('Final PORT:', PORT);

connectDB();
console.log('MongoDB connection completed');

// Security middleware
console.log('Setting up middleware');
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
console.log('After helmet');

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    'https://novapivot.vercel.app',
    'https://nova-pivot.vercel.app',
    'https://novapivot-career-transition-platform.vercel.app'
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log('After cors');

// Rate limiting
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
//   message: 'Too many requests from this IP, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Apply rate limiting to all requests
// app.use('/api/', limiter);

// // Stricter rate limiting for auth endpoints
// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 5, // limit each IP to 5 requests per windowMs
//   message: 'Too many authentication attempts, please try again later.',
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// // Apply stricter rate limiting to auth routes
// app.use('/api/auth/login', authLimiter);
// app.use('/api/auth/register', authLimiter);

// Body parsing middleware
app.use(express.json({ limit: 10 * 1024 * 1024 }));
app.use(express.urlencoded({ extended: true, limit: 10 * 1024 * 1024 }));
app.use(cookieParser());

// Root route
app.get('/', (req, res) => {
  console.log('Root route accessed');
  res.status(200).json({
    success: true,
    message: 'NovaPivot Auth API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        logout: 'POST /api/auth/logout',
        profile: 'GET /api/auth/me',
        forgotPassword: 'POST /api/auth/forgot-password',
        resetPassword: 'POST /api/auth/reset-password/:token'
      }
    },
    docs: 'https://github.com/HACKWITHNESBITT/NovaPivot',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Auth server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API routes
app.use('/api/auth', authRoutes);

// 404 handler - exclude root route
app.use((req, res, next) => {
  console.log('404 handler: path =', req.path, 'method =', req.method);
  if (req.path === '/' && req.method === 'GET') return next();
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => err.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }

  // Mongoose duplicate key error
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }

  // Mongoose cast error
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }

  // Default error
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal Server Error'
  });
});

// Start server
console.log('Starting server on port', PORT);
const server = app.listen(PORT, () => {
  console.log(`🚀 Auth Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
}).on('error', (err) => {
  console.error('Server listen error:', err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('Unhandled Promise Rejection:', err);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
