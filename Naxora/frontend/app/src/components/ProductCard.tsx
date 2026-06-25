import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct } = useApp();
  const inWishlist = isInWishlist(product.id);

  return (
    <div className="group bg-[#12121a] rounded-2xl border border-[#2a2a3a] overflow-hidden transition-all duration-300 hover:shadow-[0_8px_40px_rgba(0,0,0,0.4)] hover:border-[#3a3a4a]">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#0a0a0f]">
        <Link to={`/product/${product.id}`} onClick={() => setSelectedProduct(product)}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badge */}
        {product.badge && (
          <span className="absolute top-3 left-3 px-3 py-1 bg-[#fd79a8] text-white text-xs font-medium rounded-full">
            {product.badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={() => toggleWishlist(product.id)}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
            inWishlist
              ? 'bg-[#fd79a8] text-white'
              : 'bg-[#12121a]/80 text-[#a0a0b0] hover:text-[#fd79a8]'
          }`}
          aria-label="Toggle wishlist"
        >
          <Heart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>

        <button
          onClick={() => addToCart(product)}
          className="absolute bottom-3 left-3 right-3 h-10 bg-[#6c5ce7] text-white rounded-xl flex items-center justify-center gap-2 text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#a29bfe]"
        >
          <ShoppingCart size={14} />
          Add to Cart
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <Link
          to={`/product/${product.id}`}
          onClick={() => setSelectedProduct(product)}
          className="block"
        >
          <p className="text-xs text-[#6c6c7e] uppercase tracking-wider mb-1">{product.category}</p>
          <h4 className="text-sm font-medium text-[#f8f9fa] line-clamp-2 mb-2 group-hover:text-[#a29bfe] transition-colors">
            {product.name}
          </h4>
        </Link>

        <div className="flex items-center gap-1.5 mb-2">
          <Star size={13} className="text-[#00cec9] fill-[#00cec9]" />
          <span className="text-xs text-[#a0a0b0]">
            {product.rating} ({product.reviews})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-lg font-medium text-[#6c5ce7]">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-[#6c6c7e] line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
