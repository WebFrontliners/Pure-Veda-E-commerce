import React from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Truck, Plus, Minus, Sparkles } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

export const CartDrawer: React.FC = () => {
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTax = useCartStore((state) => state.getTax);
  const openCheckout = useCartStore((state) => state.openCheckout);

  if (!isCartOpen) return null;

  // Currency multiplier for ₹ representation
  const rawSubtotal = getSubtotal();
  const subtotal = rawSubtotal > 100 ? rawSubtotal : Math.round(rawSubtotal * 20);
  const tax = Math.round(subtotal * 0.05); // 5% GST on Ayurvedic medicines
  const shippingThreshold = 499;
  const differenceToFreeShipping = Math.max(0, shippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / shippingThreshold) * 100));
  const shippingFee = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 49;
  const total = subtotal + tax + shippingFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#30251C]/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div
          className="w-screen max-w-md bg-[#FAF6EB] shadow-2xl flex flex-col border-l border-[#E8D7B5]"
          id="cart-drawer-panel"
        >
          {/* Header */}
          <div className="p-5 border-b border-[#E8D7B5] flex items-center justify-between bg-[#F1E8D4]/60">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#1F4D2E]" />
              <h2 className="font-serif text-lg font-bold text-[#1F4D2E]">Your Ayurvedic Bag</h2>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#1F4D2E] text-white">
                {items.reduce((acc, i) => acc + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 text-[#30251C] hover:text-[#1F4D2E] rounded-full hover:bg-[#E8D7B5] transition-colors"
              aria-label="Close cart"
              id="close-cart-btn"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-4 bg-[#F1E8D4] border-b border-[#E8D7B5]">
            <div className="flex items-center justify-between text-xs font-medium text-[#1F4D2E] mb-1.5">
              <span className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#3F6B35]" />
                {differenceToFreeShipping === 0 ? (
                  <span className="font-bold text-[#3F6B35]">You've unlocked Free Express Shipping! 🎉</span>
                ) : (
                  <span>
                    Add <strong className="font-bold">₹{differenceToFreeShipping}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-[11px] font-bold text-[#B88A3B]">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-[#E8D7B5] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#1F4D2E] transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-[#E8D7B5]">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#F1E8D4] text-[#B88A3B] flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif font-bold text-lg text-[#1F4D2E]">Your bag is empty</h3>
                  <p className="text-xs text-[#30251C]/75 max-w-xs">
                    Pure Ayurvedic hair oils, massage blends, and rasayanas await you.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-6 py-2.5 rounded-full bg-[#1F4D2E] hover:bg-[#173A25] text-white text-xs font-semibold uppercase tracking-wider transition-colors"
                >
                  Explore Products
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => {
                const itemPrice = product.price > 100 ? product.price : Math.round(product.price * 20);
                return (
                  <div key={product.id} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-18 h-18 sm:w-20 sm:h-20 object-cover rounded-xl border border-[#E8D7B5] bg-white flex-shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-serif font-bold text-sm text-[#1F4D2E] line-clamp-1">
                            {product.name}
                          </h4>
                          <button
                            onClick={() => removeItem(product.id)}
                            className="text-stone-400 hover:text-rose-600 transition-colors p-1"
                            aria-label="Remove item"
                            id={`remove-item-${product.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-xs text-[#7A5527] mt-0.5">
                          ₹{itemPrice} each
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-[#E8D7B5] rounded-lg overflow-hidden bg-[#F1E8D4]/60">
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1.5 text-[#30251C] hover:bg-[#E8D7B5] transition-colors"
                            aria-label="Decrease quantity"
                            id={`dec-qty-${product.id}`}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs font-bold text-[#1F4D2E] font-mono">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            disabled={quantity >= product.stock}
                            className="p-1.5 text-[#30251C] hover:bg-[#E8D7B5] transition-colors disabled:opacity-30"
                            aria-label="Increase quantity"
                            id={`inc-qty-${product.id}`}
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-serif font-bold text-sm text-[#1F4D2E]">
                          ₹{itemPrice * quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-5 border-t border-[#E8D7B5] bg-[#F1E8D4]/60 space-y-4">
              <div className="space-y-2 text-xs text-[#30251C]/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#1F4D2E]">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="font-semibold text-[#1F4D2E]">₹{tax}</span>
                </div>
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  {shippingFee === 0 ? (
                    <span className="font-bold text-[#3F6B35] uppercase text-[11px]">Free</span>
                  ) : (
                    <span className="font-semibold text-[#1F4D2E]">₹{shippingFee}</span>
                  )}
                </div>
                <div className="pt-2 border-t border-[#E8D7B5] flex justify-between text-base font-bold text-[#1F4D2E]">
                  <span className="font-serif">Estimated Total</span>
                  <span className="font-serif">₹{total}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={openCheckout}
                className="w-full min-h-[50px] rounded-full bg-[#1F4D2E] hover:bg-[#173A25] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-98 border border-[#B88A3B]/40"
                id="checkout-trigger-btn"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 text-[#B88A3B]" />
              </button>

              <div className="text-center">
                <p className="text-[11px] text-[#7A5527] flex items-center justify-center gap-1 font-serif">
                  <Sparkles className="w-3.5 h-3.5 text-[#B88A3B]" />
                  <span>100% Satisfaction & Authenticity Guarantee</span>
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
