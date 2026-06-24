import * as userService from '../services/userService.js';

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await userService.changePassword(req.user._id, currentPassword, newPassword);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone, address } = req.body;
    const user = await userService.updateProfile(req.user._id, { name, email, phone, address });
    res.json({
      success: true,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone, address: user.address },
    });
  } catch (error) {
    next(error);
  }
};