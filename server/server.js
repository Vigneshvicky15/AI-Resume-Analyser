// Load environment variables immediately on startup
require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB();

const app = express();

// Standard middleware
app.use(cors({
  origin: function (origin, callback) {
    // Dynamically allow any incoming origin to bypass CORS issues on Vercel and local development
    callback(null, true);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local uploaded resume PDFs statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Welcome test route
app.get('/', (req, res) => {
  res.json({ success: true, message: 'AI Resume Analyzer API is running smoothly.' });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes); // Fallback for URLs missing /api suffix
app.use('/api/resume', resumeRoutes);
app.use('/resume', resumeRoutes); // Fallback for URLs missing /api suffix

// Fallback Route (404)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// Centralized Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
