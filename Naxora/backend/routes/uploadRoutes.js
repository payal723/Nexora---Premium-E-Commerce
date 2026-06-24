import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { uploadImage } from '../config/cloudinary.js';
import { AppError } from '../middleware/errorMiddleware.js';

const router = express.Router();

// Admin only - upload product image
router.post('/image', protect, authorize('admin'), async (req, res, next) => {
  try {
    if (!req.files || !req.files.image) {
      return next(new AppError('No image file provided', 400));
    }

    const file = req.files.image;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return next(new AppError('Only JPEG, PNG, and WebP images are allowed', 400));
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return next(new AppError('Image size cannot exceed 5MB', 400));
    }

    const result = await uploadImage(file.data, 'shopx/products');

    res.json({
      success: true,
      image: {
        url: result.secure_url,
        publicId: result.public_id,
        alt: req.body.alt || '',
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;