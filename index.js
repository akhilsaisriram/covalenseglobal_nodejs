const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(bodyParser.json()); // Ensure this is set to parse JSON
app.use(cors());
app.use(morgan('dev')); // Log HTTP requests in dev format

// Routes
app.use('/students', studentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
