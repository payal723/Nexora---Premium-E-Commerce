import express from 'express';
import * as productController from '../controllers/productController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { productValidation, validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/:id', productController.getProduct);

// Protected: add review
router.post('/:id/reviews', protect, productController.addReview);

// Admin only
router.post('/', protect, authorize('admin'), productValidation, validate, productController.createProduct);
router.put('/:id', protect, authorize('admin'), productController.updateProduct);
router.delete('/:id', protect, authorize('admin'), productController.deleteProduct);

export default router;
