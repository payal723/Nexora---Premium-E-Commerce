import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { orderValidation, validate } from '../middleware/validationMiddleware.js';

const router = express.Router();

router.use(protect);

// User routes
router.post('/', orderValidation, validate, orderController.placeOrder);
router.get('/my-orders', orderController.getMyOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/:id/cancel', orderController.cancelOrder);

// Admin routes
router.get('/', authorize('admin'), orderController.getAllOrders);
router.patch('/:id/status', authorize('admin'), orderController.updateOrderStatus);

export default router;
