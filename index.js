const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv')
const mongoose = require('mongoose');

dotenv.config();

// ROUTERS
const userRoutes = require('./routes/user');
const supportQueryRoutes = require('./routes/supportQuery');
const sandboxPageDataRoutes = require('./routes/sandboxPageData');
const productManagementRoutes = require('./routes/productManagement');

const app = express();

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// API routes
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/query-support', supportQueryRoutes);
app.use('/api/v1/sandbox-page-data', sandboxPageDataRoutes);
app.use('/api/v1/product-management', productManagementRoutes)


const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
