import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Product from '../models/Product.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Product.deleteMany({});
  console.log('Cleared existing data');

  // Create admin user
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@shopx.com',
    password: 'admin123',
    role: 'admin',
  });

  // Create regular user
  await User.create({
    name: 'John Doe',
    email: 'user@shopx.com',
    password: 'user123',
    role: 'user',
  });

  console.log('✅ Users created:');
  console.log('   Admin: admin@shopx.com / admin123');
  console.log('   User:  user@shopx.com  / user123');

  // Create sample products
  const products = [
    { name: 'Sony WH-1000XM5 Headphones', description: 'Industry-leading noise canceling with 30-hour battery life and multipoint connection.', price: 24990, category: 'electronics', stock: 45, brand: 'Sony', images: [{ url: 'https://picsum.photos/seed/sony/600/500', alt: 'Sony Headphones' }] },
    { name: 'Apple MacBook Air M2', description: '15.3-inch Liquid Retina display, M2 chip, 8GB RAM, 256GB SSD.', price: 119900, category: 'electronics', stock: 12, brand: 'Apple', images: [{ url: 'https://picsum.photos/seed/macbook/600/500', alt: 'MacBook Air' }] },
    { name: 'Nike Air Max 270', description: 'Breathable mesh upper with Max Air cushioning for all-day comfort.', price: 9995, category: 'footwear', stock: 80, brand: 'Nike', images: [{ url: 'https://picsum.photos/seed/nike/600/500', alt: 'Nike Air Max' }] },
    { name: 'Puma Training T-Shirt', description: 'dryCELL technology pulls sweat away from the skin for a dry and comfortable feel.', price: 1299, category: 'clothing', stock: 200, brand: 'Puma', images: [{ url: 'https://picsum.photos/seed/puma/600/500', alt: 'Puma T-Shirt' }] },
    { name: 'Samsung 55" 4K Smart TV', description: 'Crystal UHD with PurColor technology. Smart TV features with Amazon Alexa and Google Assistant.', price: 47990, category: 'electronics', stock: 8, brand: 'Samsung', images: [{ url: 'https://picsum.photos/seed/samsung/600/500', alt: 'Samsung TV' }] },
    { name: 'Instant Pot Duo 7-in-1', description: 'Multi-cooker with pressure cooker, slow cooker, rice cooker, steamer, sauté, yogurt maker.', price: 6499, category: 'kitchen', stock: 55, brand: 'Instant Pot', images: [{ url: 'https://picsum.photos/seed/instantpot/600/500', alt: 'Instant Pot' }] },
    { name: 'Kindle Paperwhite 11th Gen', description: '6.8" display with adjustable warm light and 8GB storage. Waterproof (IPX8).', price: 13999, category: 'electronics', stock: 35, brand: 'Amazon', images: [{ url: 'https://picsum.photos/seed/kindle/600/500', alt: 'Kindle' }] },
    { name: 'Levi\'s 511 Slim Fit Jeans', description: 'Classic slim fit from hip to ankle. Sits below waist with straight leg.', price: 3299, category: 'clothing', stock: 150, brand: 'Levi\'s', images: [{ url: 'https://picsum.photos/seed/levis/600/500', alt: 'Levi\'s Jeans' }] },
    { name: 'Bosch Cordless Drill', description: '18V lithium-ion with 2-speed gearbox, LED light, and 13mm metal keyless chuck.', price: 8990, category: 'tools', stock: 25, brand: 'Bosch', images: [{ url: 'https://picsum.photos/seed/bosch/600/500', alt: 'Bosch Drill' }] },
    { name: 'The Psychology of Money', description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel. Bestseller with 3M+ copies.', price: 399, category: 'books', stock: 500, brand: 'Harriman House', images: [{ url: 'https://picsum.photos/seed/book1/600/500', alt: 'Psychology of Money' }] },
    { name: 'JBL Flip 6 Speaker', description: 'Portable Bluetooth speaker with bold JBL Pro Sound and IP67 waterproof rating.', price: 8499, category: 'electronics', stock: 60, brand: 'JBL', images: [{ url: 'https://picsum.photos/seed/jbl/600/500', alt: 'JBL Flip 6' }] },
    { name: 'Adidas Ultraboost 22', description: 'Running shoes with responsive BOOST midsole and Primeknit+ upper for adaptive fit.', price: 16999, category: 'footwear', stock: 40, brand: 'Adidas', images: [{ url: 'https://picsum.photos/seed/adidas/600/500', alt: 'Adidas Ultraboost' }] },
  ];

  await Product.insertMany(products);
  console.log(`✅ ${products.length} products seeded`);

  await mongoose.disconnect();
  console.log('\n🚀 Database seeded successfully! You can now start the server.');
};

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
