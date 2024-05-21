const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// ROUTERS
const userRoutes = require('./routes/user');

const app = express();

app.use(cors());
app.use(express.json());

// Connection URI
const uri = 'mongodb+srv://us-electricals:T1lbGQP7WSs9M9Gg@uselectricals.pr972cz.mongodb.net/mylapay';

// Connect to MongoDB
mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// API routes
app.use('/api/v1/auth', userRoutes);

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
