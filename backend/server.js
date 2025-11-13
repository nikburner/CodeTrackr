require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Routes
const leetcodeRoutes = require('./routes/leetcodeRoutes');
const codechefRoutes = require('./routes/codechefRoutes');
const codeforcesRoutes = require('./routes/codeforcesRoutes');
const userRoutes = require('./routes/userRoutes');
const contestRoutes = require('./routes/contestRoutes');
const heatmapRoutes = require('./routes/heatmapRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware (essential for both dev and prod)
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_PROD_URL 
    : 'http://localhost:5173',
  credentials: true,
  exposedHeaders: ['Authorization']
}));

// Body parser
app.use(express.json());

// Routes
app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/codechef', codechefRoutes);
app.use('/api/codeforces', codeforcesRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contests', contestRoutes);
app.use('/api/dash', heatmapRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    environment: process.env.NODE_ENV || 'development' 
  });
});

// Error handling (works for both environments)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? { message: 'Internal server error' }
      : { message: err.message, stack: err.stack }
  });
});

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app;