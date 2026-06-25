import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import ProductCard from '@/components/ProductCard';
import { productAPI } from '@/lib/api';
import type { Product } from '@/types';

gsap.registerPlugin(ScrollTrigger);

export default function FeaturedProducts() {
const [products, setProducts] = useState<any[]>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
  productAPI.getProducts().then((res) => {
    if (res.success) {
      setProducts(res.products);
    }
  });
}, []);

  const featured = products.slice(0, 8);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-20 sm:py-32 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-normal text-[#f8f9fa] tracking-tight mb-2">
              Featured Products
            </h2>
            <p className="text-[#a0a0b0]">
              Handpicked premium products just for you
            </p>
          </div>

          <Link
            to="/shop"
            className="hidden sm:inline-flex text-sm text-[#6c5ce7] hover:text-[#a29bfe]"
          >
            View All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product: any) => (
            <ProductCard
              key={product._id}
              product={{
                id: product._id,
                name: product.name,
                category: product.category,
                price: product.price,
                image: product.images?.[0]?.url || '/placeholder.jpg',
                rating: product.ratings?.average || 0,
                reviews: product.ratings?.count || 0,
                description: product.description,
                features: [],
                inStock: product.stock > 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}