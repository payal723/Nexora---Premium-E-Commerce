import { useState, useMemo, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, X, SlidersHorizontal, Star } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { products, categories } from '@/data/products';
import { useApp } from '@/context/AppContext';
import ProductCard from '@/components/ProductCard';

gsap.registerPlugin(ScrollTrigger);

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const { searchQuery, setSearchQuery } = useApp();
  const sectionRef = useRef<HTMLElement>(null);

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || ''
  );
  const [priceRange, setPriceRange] = useState<string>('');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('default');
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [mobileFilters, setMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const query = searchParams.get('q') || '';
    if (query) {
      setLocalSearch(query);
      setSearchQuery(query);
    }
  }, [searchParams, setSearchQuery]);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Search
    const query = localSearch || searchQuery;
    if (query) {
      const lower = query.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lower) ||
          p.category.toLowerCase().includes(lower)
      );
    }

    // Category
    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Price range
    if (priceRange) {
      const [min, max] = priceRange.split('-').map(Number);
      if (max) {
        filtered = filtered.filter((p) => p.price >= min && p.price <= max);
      } else {
        filtered = filtered.filter((p) => p.price >= min);
      }
    }

    // Rating
    if (minRating > 0) {
      filtered = filtered.filter((p) => p.rating >= minRating);
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  }, [localSearch, searchQuery, selectedCategory, priceRange, minRating, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const activeFilters = [
    ...(selectedCategory ? [`Category: ${selectedCategory}`] : []),
    ...(priceRange ? [`Price: ${priceRange}`] : []),
    ...(minRating > 0 ? [`Rating: ${minRating}+`]: []),
  ];

  const clearFilters = () => {
    setSelectedCategory('');
    setPriceRange('');
    setMinRating(0);
    setSortBy('default');
    setLocalSearch('');
    setSearchQuery('');
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, minRating, sortBy, localSearch, searchQuery]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.shop-product-card',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.05,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [paginatedProducts]);

  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h4 className="text-sm font-medium text-[#f8f9fa] mb-3">Categories</h4>
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
              className={`flex items-center justify-between w-full text-sm py-2 px-3 rounded-lg transition-colors ${
                selectedCategory === cat.slug
                  ? 'bg-[#6c5ce7]/10 text-[#a29bfe]'
                  : 'text-[#a0a0b0] hover:text-[#f8f9fa] hover:bg-white/5'
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-xs text-[#6c6c7e]">{cat.itemCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium text-[#f8f9fa] mb-3">Price Range</h4>
        <div className="space-y-2">
          {[
            { label: 'Under ₹500', value: '0-500' },
            { label: '₹500 - ₹1000', value: '500-1000' },
            { label: '₹1000 - ₹2000', value: '1000-2000' },
            { label: 'Above ₹2000', value: '2000-999999' },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setPriceRange(priceRange === range.value ? '' : range.value)}
              className={`block w-full text-left text-sm py-2 px-3 rounded-lg transition-colors ${
                priceRange === range.value
                  ? 'bg-[#6c5ce7]/10 text-[#a29bfe]'
                  : 'text-[#a0a0b0] hover:text-[#f8f9fa] hover:bg-white/5'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="text-sm font-medium text-[#f8f9fa] mb-3">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2].map((rating) => (
            <button
              key={rating}
              onClick={() => setMinRating(minRating === rating ? 0 : rating)}
              className={`flex items-center gap-2 w-full text-sm py-2 px-3 rounded-lg transition-colors ${
                minRating === rating
                  ? 'bg-[#6c5ce7]/10 text-[#a29bfe]'
                  : 'text-[#a0a0b0] hover:text-[#f8f9fa] hover:bg-white/5'
              }`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={12}
                    className={i < rating ? 'text-[#00cec9] fill-[#00cec9]' : 'text-[#2a2a3a]'}
                  />
                ))}
              </div>
              <span>&amp; above</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <main className="pt-24 pb-16 px-4 sm:px-6" ref={sectionRef}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-normal text-[#f8f9fa] mb-4 tracking-tight">
            Shop All Products
          </h1>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <form
              onSubmit={(e) => { e.preventDefault(); setSearchQuery(localSearch); }}
              className="flex-1 relative"
            >
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6c6c7e]" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full h-12 pl-12 pr-4 bg-[#12121a] border border-[#2a2a3a] rounded-xl text-[#f8f9fa] placeholder:text-[#6c6c7e] focus:outline-none focus:border-[#6c5ce7] transition-colors"
              />
              {localSearch && (
                <button
                  type="button"
                  onClick={() => { setLocalSearch(''); setSearchQuery(''); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6c6c7e] hover:text-[#f8f9fa]"
                >
                  <X size={16} />
                </button>
              )}
            </form>

            <div className="flex gap-3">
              <button
                onClick={() => setMobileFilters(true)}
                className="lg:hidden h-12 px-4 bg-[#12121a] border border-[#2a2a3a] rounded-xl text-[#a0a0b0] flex items-center gap-2 text-sm hover:border-[#6c5ce7] transition-colors"
              >
                <SlidersHorizontal size={16} />
                Filters
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-12 px-4 bg-[#12121a] border border-[#2a2a3a] rounded-xl text-[#a0a0b0] text-sm focus:outline-none focus:border-[#6c5ce7] cursor-pointer"
              >
                <option value="default">Sort by</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Best Rating</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {activeFilters.map((filter) => (
                <span
                  key={filter}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6c5ce7]/10 text-[#a29bfe] text-xs rounded-full"
                >
                  {filter}
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-[#fd79a8] hover:text-[#fd79a8]/80 ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          <p className="text-sm text-[#6c6c7e]">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Content */}
        <div className="flex gap-8">
          {/* Desktop Filters */}
          <aside className="hidden lg:block w-64 shrink-0">
            <FiltersContent />
          </aside>

          {/* Products */}
          <div className="flex-1">
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <div key={product.id} className="shop-product-card opacity-0">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Search size={48} className="mx-auto text-[#2a2a3a] mb-4" />
                <h3 className="text-xl text-[#f8f9fa] mb-2">No products found</h3>
                <p className="text-[#a0a0b0] mb-4">Try adjusting your filters or search query</p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2.5 bg-[#6c5ce7] text-white rounded-full text-sm hover:bg-[#a29bfe] transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg border border-[#2a2a3a] flex items-center justify-center text-[#a0a0b0] hover:text-[#f8f9fa] hover:border-[#6c5ce7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ←
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm transition-colors ${
                      currentPage === i + 1
                        ? 'bg-[#6c5ce7] text-white'
                        : 'border border-[#2a2a3a] text-[#a0a0b0] hover:text-[#f8f9fa] hover:border-[#6c5ce7]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg border border-[#2a2a3a] flex items-center justify-center text-[#a0a0b0] hover:text-[#f8f9fa] hover:border-[#6c5ce7] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileFilters(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-[#12121a] border-l border-[#2a2a3a] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-[#f8f9fa]">Filters</h3>
              <button
                onClick={() => setMobileFilters(false)}
                className="p-2 text-[#a0a0b0] hover:text-[#f8f9fa]"
              >
                <X size={20} />
              </button>
            </div>
            <FiltersContent />
            <button
              onClick={() => setMobileFilters(false)}
              className="w-full h-12 bg-[#6c5ce7] text-white rounded-xl font-medium mt-8 hover:bg-[#a29bfe] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
