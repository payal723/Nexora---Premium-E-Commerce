import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "./models/Product.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const products = [
  {
    name: "ProBuds X1 Wireless Earbuds",
    description: "Premium wireless earbuds with active noise cancellation.",
    price: 1499,
    category: "electronics",
    stock: 50,
    brand: "Nexora",
    images: [
      {
        url: "https://plus.unsplash.com/premium_photo-1678099940967-73fe30680949?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8V2lyZWxlc3MlMjBFYXJidWRzfGVufDB8fDB8fHww",
        alt: "Wireless Earbuds",
      },
    ],
    isActive: true,
  },
  {
    name: "SmartFit Pro Smartwatch",
    description: "Advanced fitness tracking smartwatch.",
    price: 2499,
    category: "electronics",
    stock: 40,
    brand: "Nexora",
    images: [
      {
        url: "https://plus.unsplash.com/premium_photo-1712848344597-27b66945f09d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8c21hcnR3YXRjaHxlbnwwfHwwfHx8MA%3D%3D",
        alt: "Smartwatch",
      },
    ],
    isActive: true,
  },
  {
    name: "Premium Cotton T-Shirt",
    description: "100% premium organic cotton t-shirt.",
    price: 699,
    category: "clothing",
    stock: 100,
    brand: "Nexora",
    images: [
      {
        url: "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y290dG9uJTIwdHNoaXJ0fGVufDB8fDB8fHww",
        alt: "T-Shirt",
      },
    ],
    isActive: true,
  },
  {
    name: "Heritage Leather Messenger Bag",
    description: "Handcrafted genuine leather messenger bag.",
    price: 3499,
    category: "accessories",
    stock: 25,
    brand: "Nexora",
    images: [
      {
        url: "https://images.unsplash.com/photo-1549943872-f7ff0b2b51be?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SGVyaXRhZ2UlMjBMZWF0aGVyJTIwTWVzc2VuZ2VyJTIwQmFnfGVufDB8fDB8fHww",
        alt: "Messenger Bag",
      },
    ],
    isActive: true,
  },
  {
    name: "SonicPro Noise-Canceling Headphones",
    description: "Premium over-ear ANC headphones.",
    price: 3999,
    category: "electronics",
    stock: 30,
    brand: "Nexora",
    images: [
      {
        // TODO: replace with a real image URL — search "over ear headphones" on unsplash.com or pexels.com,
        // right-click the photo -> "Copy Image Address", and paste it here.
        url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        alt: "Headphones",
      },
    ],
    isActive: true,
  },
  {
    name: "LumaTouch Desk Lamp",
    description: "LED desk lamp with touch controls.",
    price: 1299,
    category: "home",
    stock: 60,
    brand: "Nexora",
    images: [
      {
        // TODO: replace with a real image URL — search "led desk lamp" on unsplash.com or pexels.com,
        // right-click the photo -> "Copy Image Address", and paste it here.
        url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        alt: "Desk Lamp",
      },
    ],
    isActive: true,
  },
  {
    name: "TravelPro Laptop Backpack",
    description: "Water-resistant travel backpack.",
    price: 1999,
    category: "accessories",
    stock: 45,
    brand: "Nexora",
    images: [
      {
        // TODO: replace with a real image URL — search "laptop backpack" on unsplash.com or pexels.com,
        // right-click the photo -> "Copy Image Address", and paste it here.
        url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        alt: "Backpack",
      },
    ],
    isActive: true,
  },
  {
    name: "UrbanEdge Designer Sunglasses",
    description: "UV400 polarized sunglasses.",
    price: 1299,
    category: "accessories",
    stock: 70,
    brand: "Nexora",
    images: [
      {
        // TODO: replace with a real image URL — search "designer sunglasses" on unsplash.com or pexels.com,
        // right-click the photo -> "Copy Image Address", and paste it here.
        url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
        alt: "Sunglasses",
      },
    ],
    isActive: true,
  }
];

const seedProducts = async () => {
  try {
    await connectDB();

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("✅ Products Seeded Successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedProducts();