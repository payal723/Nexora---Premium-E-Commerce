import express from 'express';
import * as cartController from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';
import { cartItemValidation, validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

// All cart routes require authentication
router.use(protect);

router.get('/', cartController.getCart);
router.post('/', cartItemValidation, validate, cartController.addToCart);
router.put('/:productId', cartController.updateCartItem);
router.delete('/clear', cartController.clearCart);
router.delete('/:productId', cartController.removeFromCart);

export default router;
