import * as authService from '../services/authService.js';
import { setCookies, clearCookies } from '../services/authService.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.registerUser({ name, email, password });
    setCookies(res, result.accessToken, result.refreshToken);
    res.status(201).json({ success: true, user: result.user });
  } catch (error) { next(error); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    setCookies(res, result.accessToken, result.refreshToken);
    res.json({ success: true, user: result.user });
  } catch (error) { next(error); }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);
    clearCookies(res);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) { next(error); }
};

export const refresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const result = await authService.refreshAccessToken(refreshToken);
    setCookies(res, result.accessToken, result.refreshToken);
    res.json({ success: true, message: 'Token refreshed' });
  } catch (error) { next(error); }
};

export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: {
        _id: req.user._id, name: req.user.name, email: req.user.email,
        role: req.user.role, address: req.user.address, phone: req.user.phone,
      },
    });
  } catch (error) { next(error); }
};