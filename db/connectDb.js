const mongoose = require('mongoose');

require("dotenv").config();
console.log(process.env.Live_url);

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.Live_url)
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDb;
