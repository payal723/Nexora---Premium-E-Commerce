import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from './errorMiddleware.js';

export const protect = async (req, res, next) => {
  try {
    let token = req.cookies?.accessToken;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authenticated. Please log in.', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new AppError('User no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

// Role-based authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          `Access denied. Role '${req.user.role}' is not authorized.`,
          403
        )
      );
    }
    next();
  };
};
