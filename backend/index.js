const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
require('dotenv').config();

// 1. Initialize the app FIRST
const app = express();

// 2. Connect to Database
connectDB();

// 3. Global Middleware
// Updated CORS to be safer and allow frontend communication
app.use(cors({
    origin: "*", 
    credentials: true
}));
app.use(express.json());

// 4. Routes (BOTH Data and Auth are required)
app.use('/api/data', require('./routes/data'));
app.use('/api/auth', require('./routes/auth')); // <-- Added missing route

// 5. Health Check 
app.get('/', (req, res) => {
    res.send("Vivek's Master Ledger API is Live and Running!");
});

// 6. EXPORT the app for Vercel
module.exports = app;

// 7. Local Development Support
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}