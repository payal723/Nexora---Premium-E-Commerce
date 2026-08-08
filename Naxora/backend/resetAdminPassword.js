

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error('Usage: node resetAdminPassword.js <admin-email> <new-password>');
  process.exit(1);
}

if (newPassword.length < 6) {
  console.error('Password must be at least 6 characters (matches your User schema rule).');
  process.exit(1);
}

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      console.error(`No user found with email: ${email}`);
      process.exit(1);
    }

   
    user.password = newPassword;
    await user.save();

    console.log(` Password reset successfully for ${email} (role: ${user.role})`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error resetting password:', error);
    process.exit(1);
  }
};

run();