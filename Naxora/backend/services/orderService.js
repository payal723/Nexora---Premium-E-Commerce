import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import User from '../models/User.js';
import { AppError } from '../middleware/errorMiddleware.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

const SHIPPING_THRESHOLD = 500;
const SHIPPING_CHARGE = 50;
const TAX_RATE = 0.18;

export const placeOrder = async (userId, { shippingAddress, notes }) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ user: userId })
      .populate('items.product')
      .session(session);

    if (!cart || cart.items.length === 0) throw new AppError('Cart is empty', 400);

    const orderItems = [];
    for (const cartItem of cart.items) {
      const product = await Product.findOneAndUpdate(
        { _id: cartItem.product._id, stock: { $gte: cartItem.quantity }, isActive: true },
        { $inc: { stock: -cartItem.quantity } },
        { new: true, session }
      );
      if (!product) throw new AppError(`Insufficient stock for "${cartItem.product.name}"`, 400);

      orderItems.push({
        product: cartItem.product._id,
        name: cartItem.product.name,
        price: cartItem.product.price,
        quantity: cartItem.quantity,
        image: cartItem.product.images?.[0]?.url || '',
      });
    }

    const itemsTotal = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingCharge = itemsTotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_CHARGE;
    const tax = Math.round(itemsTotal * TAX_RATE * 100) / 100;
    const grandTotal = itemsTotal + shippingCharge + tax;

    const [order] = await Order.create(
      [{
        user: userId,
        items: orderItems,
        shippingAddress,
        paymentMethod: 'COD',
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        itemsTotal,
        shippingCharge,
        tax,
        grandTotal,
        notes,
        statusHistory: [{ status: 'Pending', note: 'Order placed' }],
      }],
      { session }
    );

    await Cart.findOneAndUpdate(
      { user: userId },
      { items: [], totalPrice: 0, totalItems: 0 },
      { session }
    );

    await session.commitTransaction();

    try {
      const user = await User.findById(userId);
      if (user?.email) {
        await sendOrderConfirmationEmail(order, user);
      }
    } catch (emailErr) {
      console.error('Email send failed (non-critical):', emailErr.message);
    }

    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getUserOrders = async (userId, { page = 1, limit = 10 }) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(20, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    Order.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limitNum).populate('items.product', 'name images'),
    Order.countDocuments({ user: userId }),
  ]);

  return { orders, pagination: { currentPage: pageNum, totalPages: Math.ceil(total / limitNum), total } };
};

export const getOrderById = async (orderId, userId, role) => {
  const order = await Order.findById(orderId).populate('user', 'name email');
  if (!order) throw new AppError('Order not found', 404);
  if (role !== 'admin' && order.user._id.toString() !== userId.toString()) {
    throw new AppError('Not authorized to view this order', 403);
  }
  return order;
};

export const updateOrderStatus = async (orderId, newStatus, note = '') => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError('Order not found', 404);

  const validTransitions = {
    Pending: ['Confirmed', 'Cancelled'],
    Confirmed: ['Shipped', 'Cancelled'],
    Shipped: ['Delivered'],
    Delivered: [],
    Cancelled: [],
  };

  if (!validTransitions[order.orderStatus].includes(newStatus)) {
    throw new AppError(`Cannot transition from ${order.orderStatus} to ${newStatus}`, 400);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    if (newStatus === 'Cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } }, { session });
      }
    }

    order.orderStatus = newStatus;
    order.statusHistory.push({ status: newStatus, note });
    if (newStatus === 'Confirmed') order.confirmedAt = new Date();
    if (newStatus === 'Shipped') order.shippedAt = new Date();
    if (newStatus === 'Delivered') { order.deliveredAt = new Date(); order.paymentStatus = 'Paid'; }
    if (newStatus === 'Cancelled') { order.cancelledAt = new Date(); order.cancellationReason = note; }

    await order.save({ session });
    await session.commitTransaction();
    return order;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
};

export const getAllOrders = async ({ page = 1, limit = 20, status }) => {
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, parseInt(limit));
  const skip = (pageNum - 1) * limitNum;
  const filter = {};
  if (status && status !== 'all') filter.orderStatus = status;

  const [orders, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).populate('user', 'name email'),
    Order.countDocuments(filter),
  ]);

  return { orders, pagination: { currentPage: pageNum, totalPages: Math.ceil(total / limitNum), total } };
};