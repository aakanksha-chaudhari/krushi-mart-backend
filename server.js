const cors = require("cors");

// ✅ Updated CORS configuration
app.use(cors({
  origin: [

    "http://127.0.0.1:5501",// Local frontend    
    "http://localhost:5500", // Another local form
    "https://krushi-mart-frontend.vercel.app" // Replace with your actual deployed frontend URL
  ],
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Optional: Handle preflight requests globally
app.options("*", cors());

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;



// ✅ Handle OPTIONS preflight requests globally
app.options("*", cors());

app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend')));

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
