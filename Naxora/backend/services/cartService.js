import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const getCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId }).populate(
    'items.product',
    'name price images stock isActive'
  );

  if (!cart) return { items: [], totalPrice: 0, totalItems: 0 };

  // Drop items whose product was deleted (populate returns null for those)
  const validItems = cart.items.filter((item) => item.product);

  if (validItems.length !== cart.items.length) {
    cart.items = validItems;
    await cart.save();
  }

  return cart;
};

export const addToCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product || !product.isActive) throw new AppError('Product not found', 404);
  if (product.stock < quantity) throw new AppError('Insufficient stock', 400);

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    const newQty = existingItem.quantity + quantity;
    if (product.stock < newQty) throw new AppError('Insufficient stock', 400);
    existingItem.quantity = newQty;
    existingItem.price = product.price; // Update price
  } else {
    cart.items.push({
      product: productId,
      quantity,
      price: product.price,
    });
  }

  await cart.save();
  return cart.populate('items.product', 'name price images stock isActive');
};

export const updateCartItem = async (userId, productId, quantity) => {
  if (quantity < 1) throw new AppError('Quantity must be at least 1', 400);

  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);
  if (product.stock < quantity) throw new AppError('Insufficient stock', 400);

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new AppError('Cart not found', 404);

  const item = cart.items.find((i) => i.product.toString() === productId);
  if (!item) throw new AppError('Item not in cart', 404);

  item.quantity = quantity;
  item.price = product.price;
  await cart.save();

  return cart.populate('items.product', 'name price images stock isActive');
};

export const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new AppError('Cart not found', 404);

  cart.items = cart.items.filter((i) => i.product.toString() !== productId);
  await cart.save();

  return cart.populate('items.product', 'name price images stock isActive');
};

export const clearCart = async (userId, session = null) => {
  const opts = session ? { session } : {};
  await Cart.findOneAndUpdate({ user: userId }, { items: [], totalPrice: 0, totalItems: 0 }, opts);
};