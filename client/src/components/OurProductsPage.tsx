import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  Search,
  Star,
  Heart,
  Check,
  RotateCcw,
  SlidersHorizontal,
  PackageCheck,
  Sparkles,
  ArrowUpDown,
  X
} from 'lucide-react';
import { Category, Product } from '../types';
import { useCartStore } from '../store/useCartStore';

interface OurProductsPageProps {
  categories: Category[];
  products: Product[];
  initialCategory?: string;
  onNavigateHome: () => void;
  onQuickView: (product: Product) => void;
}

export const OurProductsPage: React.FC<OurProductsPageProps> = ({
  categories,
  products,
  initialCategory = 'all',
  onNavigateHome,
  onQuickView,
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const isWishlisted = useCartStore((state) => state.isWishlisted);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<string>('all'); // 'all' | 'under-300' | '300-500' | '500-700' | 'above-700' | 'custom'
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [availability, setAvailability] = useState<'all' | 'in-stock' | 'out-of-stock'>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);
  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});

  // Sync initialCategory when prop changes
  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
      setCurrentPage(1);
    }
  }, [initialCategory]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addItem(product, 1);
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1200);
  };

  const handleWishlistToggle = (e: React.MouseEvent, productId: number) => {
    e.stopPropagation();
    toggleWishlist(productId);
  };

  // Specific review counts
  const reviewCounts: Record<string, number> = {
    'herbal-hair-oil': 120,
    'massage-oil': 95,
    'herbal-tooth-powder': 80,
    'premium-bath-soap-set': 110,
    'face-wash': 115,
    'triphala-powder': 85,
    'narvo-muqt-powder': 95,
    'kumkumadi-oil': 140,
    'ashwagandha-gold-churna': 105,
    'brahmi-amla-hair-elixir': 88,
    'kesar-chandan-bathing-bar': 92,
    'neem-aloe-face-wash': 118,
    'maha-narayana-tailam': 76,
    'clove-bakul-dant-manjan': 64,
    'pure-himalayan-shilajit': 160,
    'haritaki-detox-powder': 82,
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Category Filter
      if (selectedCategory !== 'all') {
        const cat = categories.find((c) => c.slug === selectedCategory);
        if (cat && product.category_id !== cat.id && (product as any).category_slug !== selectedCategory) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc) return false;
      }

      // Price Filters
      if (priceRange === 'under-300' && product.price >= 300) return false;
      if (priceRange === '300-500' && (product.price < 300 || product.price > 500)) return false;
      if (priceRange === '500-700' && (product.price < 500 || product.price > 700)) return false;
      if (priceRange === 'above-700' && product.price <= 700) return false;
      if (priceRange === 'custom') {
        if (minPrice && product.price < Number(minPrice)) return false;
        if (maxPrice && product.price > Number(maxPrice)) return false;
      }

      // Availability Filter
      if (availability === 'in-stock' && product.stock <= 0) return false;
      if (availability === 'out-of-stock' && product.stock > 0) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return (b.rating || 5) - (a.rating || 5);
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      return a.id - b.id; // 'featured'
    });
  }, [products, categories, selectedCategory, searchQuery, priceRange, minPrice, maxPrice, availability, sortBy]);

  // Pagination calculation: Strictly 3 products per row × 3 rows = 9 products per page
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when filters change
  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const handlePriceSelect = (range: string) => {
    setPriceRange(range);
    setCurrentPage(1);
  };

  const handleAvailabilitySelect = (status: 'all' | 'in-stock' | 'out-of-stock') => {
    setAvailability(status);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setPriceRange('all');
    setMinPrice('');
    setMaxPrice('');
    setAvailability('all');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const scrollToGridTop = () => {
    const el = document.getElementById('products-catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    scrollToGridTop();
  };

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="bg-[#FAF6EB] min-h-screen">
      
      {/* 1. Breadcrumb Banner with Background Image */}
      <div className="relative w-full overflow-hidden bg-[#1F4D2E] min-h-[180px] sm:min-h-[220px] flex items-center border-b border-[#E8D7B5]/60">
        {/* Background Image */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="/images/banners/banner-2.jpg"
            alt="Ayurvedic Botanical Heritage"
            className="w-full h-full object-cover object-center select-none"
            loading="eager"
          />
          {/* Deep Emerald Green Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#1F4D2E]/92 via-[#1F4D2E]/80 to-[#173A25]/90 pointer-events-none" />
        </div>

        {/* Breadcrumb Content */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {/* Breadcrumb Links */}
          <nav className="flex items-center gap-2 text-xs sm:text-sm text-[#F1E8D4]/80 font-medium mb-3">
            <button
              onClick={onNavigateHome}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-[#B88A3B]" />
            <button
              onClick={() => handleCategorySelect('all')}
              className={`${
                selectedCategory === 'all' ? 'text-[#B88A3B] font-bold' : 'hover:text-white'
              } transition-colors cursor-pointer`}
            >
              Our Products
            </button>
            {selectedCategory !== 'all' && activeCategoryObj && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#B88A3B]" />
                <span className="text-[#B88A3B] font-bold">
                  {activeCategoryObj.name}
                </span>
              </>
            )}
          </nav>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold tracking-tight">
            Our Ayurvedic Products
          </h1>
        </div>
      </div>

      {/* 2. Main Section Header (Title, Subtitle, Paragraph) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14 pb-8 border-b border-[#E8D7B5]/60 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <p className="text-xs font-serif font-bold uppercase tracking-[0.28em] text-[#B88A3B]">
            100% PURE • CERTIFIED BOTANICALS • TIME-TESTED VEDIC WISDOM
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F4D2E] font-bold tracking-tight">
            Our Herbal Wellness Collection
          </h2>
          <p className="text-sm sm:text-base text-[#30251C]/80 font-normal leading-relaxed">
            Formulated in harmony with ancient Charaka and Sushruta Samhita traditions. Every formulation combines sacred handpicked botanicals, solar-infused extractions, and certified chemical-free purity to nourish your body, mind, and spirit naturally.
          </p>
        </div>
      </div>

      {/* 3. Catalog Layout (Left Filters + Right 3x3 Grid) */}
      <div id="products-catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        
        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden mb-6 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white border border-[#E8D7B5] text-[#1F4D2E] font-bold text-xs uppercase tracking-wider shadow-xs"
          >
            <SlidersHorizontal className="w-4 h-4 text-[#B88A3B]" />
            <span>Filter Products</span>
          </button>

          {/* Quick Sort for Mobile */}
          <div className="flex-1">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-white border border-[#E8D7B5] rounded-xl py-3 px-3 text-xs font-medium text-[#1F4D2E] focus:outline-hidden"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name-asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 items-start">
          
          {/* ================================================================= */}
          {/* LEFT-HAND SIDE: FILTERS SIDEBAR */}
          {/* ================================================================= */}
          <aside className="hidden lg:block w-72 xl:w-80 shrink-0 space-y-6 sticky top-28">
            <div className="bg-white rounded-2xl p-6 border border-[#E8D7B5]/80 shadow-xs space-y-7">
              
              {/* Sidebar Header & Clear All */}
              <div className="flex items-center justify-between pb-4 border-b border-[#E8D7B5]/50">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#B88A3B]" />
                  <h3 className="font-serif font-bold text-base text-[#1F4D2E]">
                    Filter Products
                  </h3>
                </div>
                {(selectedCategory !== 'all' || priceRange !== 'all' || availability !== 'all' || searchQuery) && (
                  <button
                    onClick={handleClearFilters}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B88A3B] hover:text-[#7A5527] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* 1. Search Box */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A5527] mb-2">
                  Search by Keyword
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    placeholder="Search hair oil, powder..."
                    className="w-full bg-[#FAF6EB] border border-[#E8D7B5] rounded-xl pl-9 pr-3 py-2 text-xs text-[#30251C] placeholder-[#30251C]/40 focus:outline-hidden focus:ring-1 focus:ring-[#1F4D2E]"
                  />
                  <Search className="w-4 h-4 text-[#7A5527]/60 absolute left-3 top-2.5" />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-xs text-[#7A5527] hover:text-[#1F4D2E]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 2. All Product Categories */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A5527] mb-3">
                  All Product Categories
                </label>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('all')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                      selectedCategory === 'all'
                        ? 'bg-[#1F4D2E] text-white font-bold shadow-xs'
                        : 'text-[#30251C] hover:bg-[#F1E8D4]/60'
                    }`}
                  >
                    <span>All Products</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-[#E8D7B5]/50 text-[#7A5527]'
                    }`}>
                      {products.length}
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const count = products.filter(
                      (p) => p.category_id === cat.id || (p as any).category_slug === cat.slug
                    ).length;
                    const isSelected = selectedCategory === cat.slug;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.slug)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#1F4D2E] text-white font-bold shadow-xs'
                            : 'text-[#30251C] hover:bg-[#F1E8D4]/60'
                        }`}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-[#E8D7B5]/50 text-[#7A5527]'
                        }`}>
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Price Filters */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A5527] mb-3">
                  Price Filter
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-300', label: 'Under ₹300' },
                    { id: '300-500', label: '₹300 – ₹500' },
                    { id: '500-700', label: '₹500 – ₹700' },
                    { id: 'above-700', label: 'Above ₹700' },
                  ].map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center gap-2.5 text-xs text-[#30251C] cursor-pointer hover:text-[#1F4D2E]"
                    >
                      <input
                        type="radio"
                        name="price-filter"
                        checked={priceRange === option.id}
                        onChange={() => handlePriceSelect(option.id)}
                        className="w-3.5 h-3.5 text-[#1F4D2E] focus:ring-[#1F4D2E]"
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>

                {/* Custom Min / Max Range Input */}
                <div className="mt-3 pt-3 border-t border-[#E8D7B5]/40 space-y-2">
                  <span className="text-[11px] font-semibold text-[#7A5527]">Custom Range (₹)</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => {
                        setMinPrice(e.target.value);
                        setPriceRange('custom');
                        setCurrentPage(1);
                      }}
                      className="w-full bg-[#FAF6EB] border border-[#E8D7B5] rounded-lg px-2.5 py-1.5 text-xs text-[#30251C] focus:outline-hidden focus:ring-1 focus:ring-[#1F4D2E]"
                    />
                    <span className="text-xs text-[#7A5527]">—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => {
                        setMaxPrice(e.target.value);
                        setPriceRange('custom');
                        setCurrentPage(1);
                      }}
                      className="w-full bg-[#FAF6EB] border border-[#E8D7B5] rounded-lg px-2.5 py-1.5 text-xs text-[#30251C] focus:outline-hidden focus:ring-1 focus:ring-[#1F4D2E]"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Availability Section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A5527] mb-3">
                  Availability
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 text-xs text-[#30251C] cursor-pointer hover:text-[#1F4D2E]">
                    <input
                      type="radio"
                      name="availability-filter"
                      checked={availability === 'all'}
                      onChange={() => handleAvailabilitySelect('all')}
                      className="w-3.5 h-3.5 text-[#1F4D2E] focus:ring-[#1F4D2E]"
                    />
                    <span>All Availability</span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#30251C] cursor-pointer hover:text-[#1F4D2E]">
                    <input
                      type="radio"
                      name="availability-filter"
                      checked={availability === 'in-stock'}
                      onChange={() => handleAvailabilitySelect('in-stock')}
                      className="w-3.5 h-3.5 text-[#1F4D2E] focus:ring-[#1F4D2E]"
                    />
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
                      In Stock
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 text-xs text-[#30251C] cursor-pointer hover:text-[#1F4D2E]">
                    <input
                      type="radio"
                      name="availability-filter"
                      checked={availability === 'out-of-stock'}
                      onChange={() => handleAvailabilitySelect('out-of-stock')}
                      className="w-3.5 h-3.5 text-[#1F4D2E] focus:ring-[#1F4D2E]"
                    />
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-stone-400 inline-block" />
                      Out of Stock
                    </span>
                  </label>
                </div>
              </div>

            </div>
          </aside>

          {/* ================================================================= */}
          {/* RIGHT-HAND SIDE: ALL PRODUCTS IN 3x3 GRID & PAGINATION */}
          {/* ================================================================= */}
          <main className="flex-1 w-full">
            
            {/* Desktop Top Toolbar */}
            <div className="hidden lg:flex items-center justify-between pb-6 mb-6 border-b border-[#E8D7B5]/60">
              <div className="text-xs sm:text-sm text-[#30251C]/80 font-medium">
                Showing{' '}
                <span className="font-bold text-[#1F4D2E]">
                  {filteredProducts.length > 0 ? startIndex + 1 : 0}–
                  {Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}
                </span>{' '}
                of <span className="font-bold text-[#1F4D2E]">{filteredProducts.length}</span> products
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7A5527]">
                  Sort By:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-[#E8D7B5] rounded-xl py-2 px-3 text-xs font-semibold text-[#1F4D2E] focus:outline-hidden focus:ring-1 focus:ring-[#1F4D2E] cursor-pointer shadow-2xs"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="name-asc">Name: A to Z</option>
                </select>
              </div>
            </div>

            {/* Empty State */}
            {currentProducts.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-[#E8D7B5]/80 space-y-4 my-8">
                <div className="w-16 h-16 rounded-full bg-[#FAF6EB] flex items-center justify-center mx-auto text-[#B88A3B]">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#1F4D2E]">
                  No products found
                </h3>
                <p className="text-sm text-[#30251C]/75 max-w-md mx-auto">
                  We could not find any Ayurvedic products matching your selected filters. Try broadening your criteria.
                </p>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1F4D2E] hover:bg-[#173A25] text-white text-xs font-bold uppercase tracking-wider transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              /* Strictly 3 products per row × 3 rows max (9 items) */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {currentProducts.map((product) => {
                  const isLiked = isWishlisted(product.id);
                  const isAdded = addedMap[product.id];
                  const count = reviewCounts[product.slug] || 95;

                  return (
                    <div
                      key={product.id}
                      onClick={() => onQuickView(product)}
                      className="group relative bg-white rounded-2xl border border-[#E8D7B5]/80 hover:border-[#B88A3B] transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer"
                      id={`product-page-card-${product.id}`}
                    >
                      {/* Product Image - Flush Border to Border */}
                      <div className="relative aspect-square w-full overflow-hidden bg-[#F1E8D4]">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                          loading="lazy"
                        />

                        {/* Wishlist Heart Button */}
                        <button
                          type="button"
                          onClick={(e) => handleWishlistToggle(e, product.id)}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-xs transition-transform duration-200 hover:scale-110 border border-[#E8D7B5] z-10 cursor-pointer"
                          aria-label="Save to Wishlist"
                        >
                          <Heart
                            className={`w-4 h-4 transition-colors ${
                              isLiked
                                ? 'text-rose-600 fill-rose-600'
                                : 'text-[#30251C]/60 hover:text-rose-600'
                            }`}
                          />
                        </button>

                        {/* Out of Stock Overlay Badge */}
                        {product.stock <= 0 && (
                          <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs flex items-center justify-center">
                            <span className="px-3 py-1 bg-[#30251C] text-white text-xs font-bold uppercase tracking-wider rounded-full">
                              Out of Stock
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content Area with Inner Padding */}
                      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                        <div>
                          {/* Product Title */}
                          <h3 className="font-serif font-bold text-sm sm:text-base text-[#1F4D2E] line-clamp-1 group-hover:text-[#3F6B35] transition-colors leading-snug">
                            {product.name}
                          </h3>

                          {/* Rating Stars & Count */}
                          <div className="flex items-center gap-1.5 text-[#B88A3B] py-1.5">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 fill-[#B88A3B] text-[#B88A3B]" />
                              ))}
                            </div>
                            <span className="text-xs text-[#7A5527] font-medium">
                              ({count})
                            </span>
                          </div>

                          {/* Price */}
                          <div className="pt-1">
                            <span className="text-base sm:text-lg font-serif font-bold text-[#1F4D2E]">
                              ₹{product.price}
                            </span>
                          </div>
                        </div>

                        {/* Add to Cart Button */}
                        <div className="pt-4 mt-3 border-t border-[#E8D7B5]/40">
                          <button
                            type="button"
                            disabled={product.stock <= 0}
                            onClick={(e) => handleAddToCart(e, product)}
                            className={`w-full py-2.5 px-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                              product.stock <= 0
                                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                                : isAdded
                                ? 'bg-[#3F6B35] text-white'
                                : 'bg-[#1F4D2E] hover:bg-[#173A25] text-white active:scale-95'
                            }`}
                            id={`products-page-add-${product.id}`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-white" />
                                <span>Added!</span>
                              </>
                            ) : (
                              <span>{product.stock <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
                            )}
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* =============================================================== */}
            {/* PAGINATION (After the 3x3 Grid) */}
            {/* =============================================================== */}
            {totalPages > 1 && (
              <div className="mt-12 pt-8 border-t border-[#E8D7B5]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-[#7A5527] font-medium">
                  Page <span className="font-bold text-[#1F4D2E]">{currentPage}</span> of{' '}
                  <span className="font-bold text-[#1F4D2E]">{totalPages}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Previous Button */}
                  <button
                    type="button"
                    disabled={currentPage === 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-[#E8D7B5] text-[#1F4D2E] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1F4D2E] hover:text-white cursor-pointer shadow-2xs"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Prev</span>
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => handlePageChange(pageNum)}
                        className={`w-9 h-9 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-2xs ${
                          isActive
                            ? 'bg-[#1F4D2E] text-white'
                            : 'bg-white border border-[#E8D7B5] text-[#1F4D2E] hover:bg-[#F1E8D4]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {/* Next Button */}
                  <button
                    type="button"
                    disabled={currentPage === totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-[#E8D7B5] text-[#1F4D2E] font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#1F4D2E] hover:text-white cursor-pointer shadow-2xs"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Mobile Filters Drawer / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#E8D7B5]">
                <h3 className="font-serif font-bold text-lg text-[#1F4D2E]">Filters</h3>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 rounded-full text-[#30251C]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#7A5527] mb-2">
                  Category
                </label>
                <div className="space-y-1">
                  <button
                    type="button"
                    onClick={() => {
                      handleCategorySelect('all');
                      setMobileFilterOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                      selectedCategory === 'all' ? 'bg-[#1F4D2E] text-white font-bold' : 'text-[#30251C]'
                    }`}
                  >
                    All Products ({products.length})
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        handleCategorySelect(c.slug);
                        setMobileFilterOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs ${
                        selectedCategory === c.slug ? 'bg-[#1F4D2E] text-white font-bold' : 'text-[#30251C]'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#7A5527] mb-2">
                  Price
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'all', label: 'All Prices' },
                    { id: 'under-300', label: 'Under ₹300' },
                    { id: '300-500', label: '₹300 – ₹500' },
                    { id: '500-700', label: '₹500 – ₹700' },
                    { id: 'above-700', label: 'Above ₹700' },
                  ].map((o) => (
                    <label key={o.id} className="flex items-center gap-2 text-xs text-[#30251C]">
                      <input
                        type="radio"
                        name="mobile-price"
                        checked={priceRange === o.id}
                        onChange={() => {
                          handlePriceSelect(o.id);
                          setMobileFilterOpen(false);
                        }}
                      />
                      <span>{o.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#7A5527] mb-2">
                  Availability
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-[#30251C]">
                    <input
                      type="radio"
                      name="mobile-avail"
                      checked={availability === 'all'}
                      onChange={() => {
                        handleAvailabilitySelect('all');
                        setMobileFilterOpen(false);
                      }}
                    />
                    <span>All</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#30251C]">
                    <input
                      type="radio"
                      name="mobile-avail"
                      checked={availability === 'in-stock'}
                      onChange={() => {
                        handleAvailabilitySelect('in-stock');
                        setMobileFilterOpen(false);
                      }}
                    />
                    <span>In Stock</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-[#30251C]">
                    <input
                      type="radio"
                      name="mobile-avail"
                      checked={availability === 'out-of-stock'}
                      onChange={() => {
                        handleAvailabilitySelect('out-of-stock');
                        setMobileFilterOpen(false);
                      }}
                    />
                    <span>Out of Stock</span>
                  </label>
                </div>
              </div>

            </div>

            <div className="pt-6 border-t border-[#E8D7B5] space-y-2">
              <button
                type="button"
                onClick={() => {
                  handleClearFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2.5 rounded-xl border border-[#1F4D2E] text-[#1F4D2E] text-xs font-bold uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
