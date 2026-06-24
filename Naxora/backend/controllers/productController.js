import * as productService from '../services/productService.js';

export const getProducts = async (req, res, next) => {
  try {
    const result = await productService.getProducts(req.query);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  try {
    const categories = await productService.getCategories();
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const product = await productService.addReview(
      req.params.id,
      req.user._id,
      req.user.name,
      req.body
    );
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};
