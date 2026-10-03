import React, { useState } from 'react';
import { Star, ShoppingBag, Heart, Check, Eye, AlertCircle, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';

interface BestSellersSectionProps {
  products: Product[];
  onQuickView: (product: Product) => void;
}

export const BestSellersSection: React.FC<BestSellersSectionProps> = ({
  products,
  onQuickView,
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const isWishlisted = useCartStore((state) => state.isWishlisted);

  const [addedMap, setAddedMap] = useState<Record<number, boolean>>({});

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

  return (
    <section id="products" className="py-16 sm:py-24 bg-[#FAF6EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <p className="text-xs font-serif font-bold uppercase tracking-[0.25em] text-[#B88A3B]">
            CUSTOMER FAVORITES
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F4D2E] font-bold tracking-tight">
            Our Best Sellers
          </h2>
          <p className="text-sm sm:text-base text-[#30251C]/75 font-normal">
            Trusted choices for natural and effective everyday care.
          </p>
        </div>

        {/* Product Grid (4 items per row, strictly 2 rows = 8 items total) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.slice(0, 8).map((product) => {
            const isLiked = isWishlisted(product.id);
            const isAdded = addedMap[product.id];

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
            };
            const count = reviewCounts[product.slug] || 95;

            return (
              <div
                key={product.id}
                onClick={() => onQuickView(product)}
                className="group relative bg-white rounded-2xl border border-[#E8D7B5]/80 hover:border-[#B88A3B] transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden cursor-pointer"
                id={`bestseller-card-${product.id}`}
              >
                {/* Product Image - Flush Border to Border */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#F1E8D4]">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Wishlist Heart Button */}
                  <button
                    type="button"
                    onClick={(e) => handleWishlistToggle(e, product.id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white shadow-xs transition-transform duration-200 hover:scale-110 border border-[#E8D7B5] z-10"
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
                </div>

                {/* Content Area with Inner Padding */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
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
                      onClick={(e) => handleAddToCart(e, product)}
                      className={`w-full py-2.5 px-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-xs ${
                        isAdded
                          ? 'bg-[#3F6B35] text-white'
                          : 'bg-[#1F4D2E] hover:bg-[#173A25] text-white active:scale-95'
                      }`}
                      id={`bestseller-add-${product.id}`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span>Added!</span>
                        </>
                      ) : (
                        <span>ADD TO CART</span>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
