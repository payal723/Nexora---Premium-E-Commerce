import Product from '../models/Product.js';
import { AppError } from '../middleware/errorMiddleware.js';

export const getProducts = async (queryParams) => {
  const {
    page = 1,
    limit = 12,
    category,
    search,
    sort = '-createdAt',
    minPrice,
    maxPrice,
  } = queryParams;

  const filter = { isActive: true };

  // Text search
  if (search) {
    filter.$text = { $search: search };
  }

  // Category filter
  if (category && category !== 'all') {
    filter.category = category.toLowerCase();
  }

  // Price range
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  // Build sort
  const sortMap = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    rating: { 'ratings.average': -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };
  const sortOption = sortMap[sort] || { createdAt: -1 };

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalProducts: total,
      hasNextPage: pageNum < Math.ceil(total / limitNum),
      hasPrevPage: pageNum > 1,
    },
  };
};

export const getProductById = async (id) => {
  const product = await Product.findById(id);
  if (!product || !product.isActive) {
    throw new AppError('Product not found', 404);
  }
  return product;
};

export const getCategories = async () => {
  const categories = await Product.distinct('category', { isActive: true });
  return categories.sort();
};

export const createProduct = async (data) => {
  const product = await Product.create(data);
  return product;
};

export const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!product) throw new AppError('Product not found', 404);
  return product;
};

export const deleteProduct = async (id) => {
  const product = await Product.findById(id);
  if (!product) throw new AppError('Product not found', 404);
  // Soft delete
  product.isActive = false;
  await product.save();
  return { message: 'Product deleted successfully' };
};

export const addReview = async (productId, userId, userName, { rating, comment }) => {
  const product = await Product.findById(productId);
  if (!product) throw new AppError('Product not found', 404);

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === userId.toString()
  );
  if (alreadyReviewed) throw new AppError('You have already reviewed this product', 400);

  product.reviews.push({ user: userId, name: userName, rating: Number(rating), comment });
  product.calculateRatings();
  await product.save();
  return product;
};
