import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB connect...✅');
  } catch (error) {
    console.error('MongoDB connectin failed...❌', error.message);
    process.exit(1);
  }
};

export default connectDB;
