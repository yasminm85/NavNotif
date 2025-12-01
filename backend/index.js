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


// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(
  cors({
    origin: 'http://localhost:3001',
    credentials: true
  })
);

app.use(cookieParser());

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/task", disposisiRoutes);
app.use("/api/notif", notifRoutes);
app.use('/uploads', express.static('uploads'));

// Database Connection
mongoose.connect('mongodb+srv://node_db:5qcJ1b7MqwFnoGTC@nodedb.xr4shgr.mongodb.net/?appName=NodeDB')
    .then(() => {
        console.log("Connected to database!");
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => {
        console.log("Connection failed");
        console.error(err); 
    });


