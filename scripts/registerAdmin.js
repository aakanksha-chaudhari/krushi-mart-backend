const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('../models/Admin'); // this must point to your Admin model

dotenv.config();

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  const email = "admin";     // 👈 You can change this if needed
  const password = "admin1234";          // 👈 You can change this if needed

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("❌ Admin already exists.");
    process.exit();
  }

  const hashed = await bcrypt.hash(password, 10);
  await Admin.create({ email, password: hashed });
  console.log(" Admin registered successfully.");
  process.exit();
}).catch((err) => {
  console.error("❌ MongoDB Error:", err);
});
