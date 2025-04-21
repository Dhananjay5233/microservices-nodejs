require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const hashed = await bcrypt.hash('admin123', 10);
  const exists = await Admin.findOne({ email: 'admin@spark.com' });

  if (!exists) {
    await Admin.create({ email: 'admin@spark.com', password: hashed });
    console.log('Admin created!');
  } else {
    console.log('Admin already exists');
  }

  process.exit();
});