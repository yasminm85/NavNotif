require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// routes initialize
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const disposisiRoutes = require('./routes/disposisiRoutes');
const notifRoutes = require('./routes/notifRoutes');
const displayRoutes = require('./routes/displayRoutes');

const app = express();

const DB_CONNECTION = process.env.DB_CONNECTION;   
const PORT = process.env.PORT || 3000;            

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const allowedOrigins = [
  'http://localhost:3001',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);

// upload 
app.use('/uploads', express.static('uploads'));
app.use('/uploads/laporan', express.static('uploads/laporan'));
app.use('/uploads/tambahan', express.static('uploads/tambahan'));
app.use('/uploads/display', express.static('uploads/display'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/task', disposisiRoutes);
app.use('/api/notif', notifRoutes);
app.use('/api/media', displayRoutes);


// DB Connection
mongoose
  .connect(DB_CONNECTION)
  .then(() => {
    console.log('Connected to database!');
    app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });
  })
  .catch((err) => {
    console.log('Connection failed');
    console.error(err);
    process.exit(1); 
  });


module.exports = app;
