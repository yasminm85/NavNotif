const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const disposisiRoutes = require('./routes/disposisiRoutes')
const notifRoutes = require('./routes/notifRoutes')
const app = express()
require('dotenv').config();
const db_connection = process.env.DB_CONNECTION;
const PORT = process.env.PORT || 3000;



// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));


const allowedOrigins = [
  'http://localhost:3001',                
  'https://nav-notif.vercel.app'       
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));


app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/task", disposisiRoutes);
app.use("/api/notif", notifRoutes);
app.use('/uploads', express.static('uploads'));



// Database Connection
mongoose.connect(db_connection)
    .then(() => {
        console.log("Connected to database!");
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Connection failed");
        console.error(err); 
    });


