import React, { useState, useEffect } from 'react';
import { X, Star, ShoppingBag, Check, ShieldCheck, Truck, AlertCircle, Leaf, Layers } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export const ProductDetailModal: React.FC = () => {
  const product = useCartStore((state) => state.activeQuickViewProduct);
  const setQuickViewProduct = useCartStore((state) => state.setQuickViewProduct);
  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setAdded(false);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setQuickViewProduct]);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;
  const isSoap = product.slug === 'premium-bath-soap-set';

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQuickViewProduct(null);
    }, 900);
  };

  const formattedPrice = product.price > 100 ? product.price : Math.round(product.price * 20);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#30251C]/60 backdrop-blur-sm transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
        <div
          className="relative bg-[#FAF6EB] rounded-3xl max-w-3xl w-full text-left overflow-hidden shadow-2xl border border-[#E8D7B5] animate-fade-in"
          id="product-detail-modal"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={() => setQuickViewProduct(null)}
            className="absolute top-4 right-4 z-10 p-2 text-[#30251C] hover:text-[#1F4D2E] bg-[#FAF6EB]/90 hover:bg-[#FAF6EB] rounded-full shadow-md transition-colors border border-[#E8D7B5]"
            aria-label="Close modal"
            id="close-detail-modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Image Preview Side */}
            <div className="relative bg-[#F1E8D4] aspect-square md:aspect-auto flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-[#E8D7B5]">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 bg-[#1F4D2E] text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm flex items-center gap-1.5 border border-[#B88A3B]/50">
                <Leaf className="w-3.5 h-3.5 text-[#B88A3B]" />
                <span>Ayurvedic Formulation</span>
              </div>
            </div>

            {/* Details Content Side */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F4D2E] bg-[#F1E8D4] px-3 py-1 rounded-full border border-[#E8D7B5]">
                    {product.category_name || 'Pure Ayurveda'}
                  </span>
                  <div className="flex items-center gap-1 text-[#B88A3B]">
                    <Star className="w-4 h-4 fill-[#B88A3B]" />
                    <span className="text-xs font-bold text-[#30251C]">{product.rating.toFixed(2)}</span>
                    <span className="text-xs text-[#7A5527]">(Verified)</span>
                  </div>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F4D2E] leading-tight">
                  {product.name}
                </h2>

                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-serif font-bold text-[#1F4D2E]">
                    ₹{formattedPrice}
                  </span>
                  <span className="text-xs text-[#7A5527]">Inclusive of all taxes</span>
                </div>

                <p className="text-sm text-[#30251C]/85 leading-relaxed pt-1">
                  {product.description}
                </p>

                {/* 5 Variants Notice for Soaps */}
                {isSoap && (
                  <div className="p-3 bg-[#F1E8D4] rounded-2xl border border-[#B88A3B]/40 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#1F4D2E]">
                      <Layers className="w-4 h-4 text-[#B88A3B]" />
                      <span>Includes 5 Full-Size Handcrafted Variants:</span>
                    </div>
                    <p className="text-[11px] text-[#7A5527] leading-relaxed">
                      1. Royal Chandan (Sandalwood) • 2. Purifying Neem Tulsi • 3. Kesar Haldi Radiance • 4. Kashmiri Rose Almond • 5. Soothing Aloe Vera
                    </p>
                  </div>
                )}

                {/* Stock info */}
                <div className="pt-1">
                  {isOutOfStock ? (
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Currently Sold Out
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#3F6B35] flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      In Stock & Dispatched within 24 Hours
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper & Add to Cart */}
              <div className="space-y-4 pt-4 border-t border-[#E8D7B5]">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#E8D7B5] rounded-xl overflow-hidden bg-[#F1E8D4]/60">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1 || isOutOfStock}
                      className="px-3.5 py-2 text-[#30251C] hover:bg-[#E8D7B5] transition-colors disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 text-sm font-bold text-[#1F4D2E] min-w-[2.5rem] text-center font-mono">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock || isOutOfStock}
                      className="px-3.5 py-2 text-[#30251C] hover:bg-[#E8D7B5] transition-colors disabled:opacity-40"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className={`flex-1 min-h-[48px] rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                      isOutOfStock
                        ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                        : added
                        ? 'bg-[#3F6B35] text-white'
                        : 'bg-[#1F4D2E] hover:bg-[#173A25] text-white border border-[#B88A3B]/40'
                    }`}
                    id="modal-add-to-cart"
                  >
                    {added ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Added to Cart!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-[#B88A3B]" />
                        <span>Add to Cart • ₹{formattedPrice * quantity}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Trust mini badges */}
                <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-[#7A5527]">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#1F4D2E]" />
                    <span>Free Shipping on ₹499+</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#1F4D2E]" />
                    <span>100% Ayush Certified Purity</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
