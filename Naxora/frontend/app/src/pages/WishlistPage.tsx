import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { wishlist } = useApp();

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <main className="pt-24 pb-16 px-4 sm:px-6 min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#12121a] flex items-center justify-center mx-auto mb-6">
            <Heart size={32} className="text-[#6c6c7e]" />
          </div>
          <h2 className="text-2xl text-[#f8f9fa] mb-2">Your wishlist is empty</h2>
          <p className="text-[#a0a0b0] mb-6 max-w-sm">
            Save items you love for later
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#6c5ce7] text-white rounded-full text-sm font-medium hover:bg-[#a29bfe] transition-colors"
          >
            Browse Products
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-normal text-[#f8f9fa] mb-8 tracking-tight">
          My Wishlist ({wishlistProducts.length} items)
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </main>
  );
}
