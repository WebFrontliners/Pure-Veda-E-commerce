import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { Product } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  products,
}) => {
  const wishlist = useCartStore((state) => state.wishlist);
  const toggleWishlist = useCartStore((state) => state.toggleWishlist);
  const addItem = useCartStore((state) => state.addItem);

  if (!isOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-[#30251C]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF6EB] shadow-2xl flex flex-col border-l border-[#E8D7B5]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8D7B5] flex items-center justify-between bg-[#F1E8D4]/60">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
              <h2 className="font-serif text-lg font-bold text-[#1F4D2E]">
                Your Saved Wishlist
              </h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#1F4D2E] text-white">
                {wishlistedProducts.length}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[#30251C] hover:text-[#1F4D2E] rounded-full hover:bg-[#E8D7B5]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E8D7B5]">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F1E8D4] text-[#B88A3B] flex items-center justify-center">
                  <Heart className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-serif font-bold text-lg text-[#1F4D2E]">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-[#30251C]/70 max-w-xs">
                  Save your favorite Ayurvedic elixirs, oils, and bathing soaps to revisit anytime.
                </p>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div key={product.id} className="py-4 flex gap-4 first:pt-0 last:pb-0 items-center">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-xl border border-[#E8D7B5] bg-white shrink-0"
                  />
                  <div className="flex-1">
                    <h4 className="font-serif font-bold text-sm text-[#1F4D2E] line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="font-serif font-bold text-xs text-[#30251C] mt-0.5">
                      ₹{product.price > 100 ? product.price : Math.round(product.price * 20)}
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => {
                          addItem(product, 1);
                        }}
                        className="px-3 py-1.5 rounded-full bg-[#1F4D2E] text-white text-[11px] font-semibold flex items-center gap-1 hover:bg-[#173A25]"
                      >
                        <ShoppingBag className="w-3 h-3 text-[#B88A3B]" />
                        <span>Move to Bag</span>
                      </button>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 transition-colors"
                        title="Remove from Wishlist"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-5 border-t border-[#E8D7B5] bg-[#F1E8D4]/40">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-full bg-[#1F4D2E] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Continue Exploring
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
