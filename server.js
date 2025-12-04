const express = require('express');
const connectDB = require('./config');
require('dotenv').config();

// 🔥 Import Routes 
// const authRoutes = require("./routes/authroutes"); // 🚨 सुनिश्चित करें कि नाम 'authroutes' ही हो

const app = express();
const PORT = 5000;

// Database connect
connectDB();


app.use(express.json()); 


app.use("/api/auth", authRoutes); 

// Main Test Route: 
app.get('/', (req, res) => {
    res.send("Backend is working 🚀. Server + MongoDB connected successfully.");
});

// Server Listen
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});