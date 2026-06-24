import User from '../models/User.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const changePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new AppError('User not found', 404);

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) throw new AppError('Current password is incorrect', 401);

  user.password = newPassword;
  await user.save();
  return { message: 'Password changed successfully' };
};

export const updateProfile = async (userId, { name, email, phone, address }) => {
  if (email) {
    const existing = await User.findOne({ email, _id: { $ne: userId } });
    if (existing) throw new AppError('Email already in use by another account', 409);
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { ...(name && { name }), ...(email && { email }), ...(phone && { phone }), ...(address && { address }) },
    { new: true, runValidators: true }
  );
  if (!user) throw new AppError('User not found', 404);
  return user;
};