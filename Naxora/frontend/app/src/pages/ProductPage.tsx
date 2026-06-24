import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star, Minus, Plus, Check, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { products } from '@/data/products';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart, toggleWishlist, isInWishlist } = useApp();
  const sectionRef = useRef<HTMLDivElement>(null);

  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews'>('description');
  const inWishlist = isInWishlist(product?.id || '');

  const relatedProducts = products
    .filter((p) => p.category === product?.category && p.id !== product?.id)
    .slice(0, 4);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        '.product-detail-content',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' }
      );
    }
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) {
    return (
      <div className="pt-24 pb-16 px-4 text-center">
        <h2 className="text-2xl text-[#f8f9fa] mb-4">Product not found</h2>
        <Link to="/shop" className="text-[#6c5ce7] hover:text-[#a29bfe]">
          Browse products →
        </Link>
      </div>
    );
  }

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto product-detail-content">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-sm text-[#a0a0b0]">
          <Link to="/" className="hover:text-[#f8f9fa]">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-[#f8f9fa]">Shop</Link>
          <span>/</span>
          <span className="text-[#6c6c7e]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
          {/* Image */}
          <div className="bg-[#12121a] rounded-2xl border border-[#2a2a3a] p-6 flex items-center justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-full max-w-md object-contain"
            />
          </div>

          {/* Info */}
          <div>
            <Link
              to={`/shop?category=${product.category}`}
              className="text-xs uppercase tracking-wider text-[#6c5ce7] mb-2 inline-block"
            >
              {product.category}
            </Link>

            <h1 className="text-2xl sm:text-3xl font-normal text-[#f8f9fa] mb-3">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.rating) ? 'text-[#00cec9] fill-[#00cec9]' : 'text-[#2a2a3a]'}
                  />
                ))}
              </div>
              <span className="text-sm text-[#a0a0b0]">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            {product.badge && (
              <span className="inline-block px-3 py-1 bg-[#fd79a8] text-white text-xs rounded-full mb-4">
                {product.badge}
              </span>
            )}

            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-medium text-[#6c5ce7]">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-[#6c6c7e] line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-[#a0a0b0] mb-6 leading-relaxed">
              {product.description}
            </p>

            {/* Features */}
            <div className="space-y-2 mb-8">
              {product.features.map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-[#a0a0b0]">
                  <Check size={14} className="text-[#00cec9]" />
                  {feature}
                </div>
              ))}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-[#a0a0b0]">Quantity</span>
              <div className="flex items-center gap-3 bg-[#12121a] border border-[#2a2a3a] rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#a0a0b0] hover:text-[#f8f9fa]"
                >
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center text-[#f8f9fa] font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-[#a0a0b0] hover:text-[#f8f9fa]"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={async () => {
                  for (let i = 0; i < quantity; i++) {
                    await addToCart(product);
                  }
                }}
                className="flex-1 h-14 bg-[#6c5ce7] text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-[#a29bfe] transition-colors"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`w-14 h-14 rounded-xl border flex items-center justify-center transition-colors ${
                  inWishlist
                    ? 'bg-[#fd79a8] border-[#fd79a8] text-white'
                    : 'border-[#2a2a3a] text-[#a0a0b0] hover:text-[#fd79a8] hover:border-[#fd79a8]'
                }`}
              >
                <Heart size={20} fill={inWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-[#12121a] rounded-xl border border-[#2a2a3a]">
              <div className="text-center">
                <Truck size={20} className="mx-auto text-[#6c5ce7] mb-1" />
                <p className="text-[10px] text-[#a0a0b0]">Free Shipping</p>
              </div>
              <div className="text-center">
                <RotateCcw size={20} className="mx-auto text-[#6c5ce7] mb-1" />
                <p className="text-[10px] text-[#a0a0b0]">7-Day Returns</p>
              </div>
              <div className="text-center">
                <ShieldCheck size={20} className="mx-auto text-[#6c5ce7] mb-1" />
                <p className="text-[10px] text-[#a0a0b0]">Secure Checkout</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex gap-6 border-b border-[#2a2a3a] mb-6">
            {(['description', 'specs', 'reviews'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-[#6c5ce7] border-b-2 border-[#6c5ce7]'
                    : 'text-[#a0a0b0] hover:text-[#f8f9fa]'
                }`}
              >
                {tab === 'specs' ? 'Specifications' : tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="text-[#a0a0b0] leading-relaxed">
              <p>{product.description}</p>
              <p className="mt-4">
                Experience premium quality with our carefully selected {product.name.toLowerCase()}. 
                Designed for modern lifestyles, this product combines functionality with elegant aesthetics. 
                Perfect for everyday use or as a thoughtful gift for your loved ones.
              </p>
            </div>
          )}

          {activeTab === 'specs' && (
            <table className="w-full max-w-lg">
              <tbody>
                {product.features.map((feature) => (
                  <tr key={feature} className="border-b border-[#2a2a3a]">
                    <td className="py-3 text-sm text-[#a0a0b0] w-1/2">{feature}</td>
                    <td className="py-3 text-sm text-[#f8f9fa]">Yes</td>
                  </tr>
                ))}
                <tr className="border-b border-[#2a2a3a]">
                  <td className="py-3 text-sm text-[#a0a0b0]">Category</td>
                  <td className="py-3 text-sm text-[#f8f9fa] capitalize">{product.category}</td>
                </tr>
                <tr className="border-b border-[#2a2a3a]">
                  <td className="py-3 text-sm text-[#a0a0b0]">In Stock</td>
                  <td className="py-3 text-sm text-[#00cec9]">Yes</td>
                </tr>
              </tbody>
            </table>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-[#12121a] rounded-xl border border-[#2a2a3a] p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-full bg-[#6c5ce7]/20 flex items-center justify-center text-[#a29bfe] text-sm font-medium">
                      {['R', 'P', 'A'][i]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#f8f9fa]">
                        {['Rahul M.', 'Priya S.', 'Amit K.'][i]}
                      </p>
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={12} className="text-[#00cec9] fill-[#00cec9]" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-[#a0a0b0]">
                    {[
                      'Amazing quality! Worth every rupee. The delivery was super fast too.',
                      'Love this product! Exactly as described. Will order again.',
                      'Great value for money. Customer service was very helpful.',
                    ][i]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-normal text-[#f8f9fa] mb-6 tracking-tight">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
