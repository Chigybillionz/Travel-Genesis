const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/travel_genesis');
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(` MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Make sure MongoDB is running locally or provide a valid MONGO_URI in .env');
    // Note: Do not immediately exit so server can still serve health check / helpful messages if DB is offline
  }
};

module.exports = connectDB;
