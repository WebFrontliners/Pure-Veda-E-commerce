import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, QrCode, Banknote, Loader2, PackageCheck, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { submitOrder } from '../services/api';
import { Order } from '../types';

export const CheckoutModal: React.FC = () => {
  const isCheckoutOpen = useCartStore((state) => state.isCheckoutOpen);
  const closeCheckout = useCartStore((state) => state.closeCheckout);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const getSubtotal = useCartStore((state) => state.getSubtotal);

  // Form State
  const [formData, setFormData] = useState({
    name: 'Pooja Verma',
    email: 'pooja.verma@example.com',
    street: '14B Lotus Enclave, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    zip: '560001',
    paymentMethod: 'upi',
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '888',
  });

  const [activeStep, setActiveStep] = useState<'details' | 'payment' | 'review'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isCheckoutOpen) return null;

  const rawSubtotal = getSubtotal();
  const subtotal = rawSubtotal > 100 ? rawSubtotal : Math.round(rawSubtotal * 20);
  const tax = Math.round(subtotal * 0.05);
  const shippingFee = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + tax + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrorMessage('');
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.street) {
      setErrorMessage('Please complete all contact and delivery details.');
      setActiveStep('details');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const shippingAddressFormatted = `${formData.street}, ${formData.city}, ${formData.state} - ${formData.zip}`;
      const payload = {
        customer_name: formData.name,
        customer_email: formData.email,
        shipping_address: shippingAddressFormatted,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
      };

      const result = await submitOrder(payload);
      setConfirmedOrder({
        ...result.order,
        total_amount: total,
      });
      clearCart();
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong processing your order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    setConfirmedOrder(null);
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#30251C]/60 backdrop-blur-sm transition-opacity"
        onClick={() => {
          if (!confirmedOrder && !isSubmitting) closeCheckout();
        }}
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
        <div
          className="relative bg-[#FAF6EB] rounded-3xl max-w-2xl w-full text-left overflow-hidden shadow-2xl border border-[#E8D7B5] animate-fade-in"
          onClick={(e) => e.stopPropagation()}
          id="checkout-modal-container"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#E8D7B5] flex items-center justify-between bg-[#F1E8D4]/60">
            <div>
              <span className="text-[11px] font-serif font-bold uppercase tracking-wider text-[#B88A3B]">
                Pure Veda Ayurved Direct
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#1F4D2E]">
                {confirmedOrder ? 'Order Confirmed!' : 'Secure Checkout'}
              </h2>
            </div>
            {!confirmedOrder && (
              <button
                onClick={closeCheckout}
                disabled={isSubmitting}
                className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-[#E8D7B5] transition-colors"
                aria-label="Close checkout"
                id="close-checkout-modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Success Screen */}
          {confirmedOrder ? (
            <div className="p-8 sm:p-10 space-y-6 text-center" id="order-confirmation-screen">
              <div className="w-16 h-16 bg-[#1F4D2E] text-[#B88A3B] rounded-full flex items-center justify-center mx-auto shadow-md animate-fade-in">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#B88A3B]">
                  Order Receipt #{confirmedOrder.id}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1F4D2E]">
                  Dhanyavaad, {confirmedOrder.customer_name}!
                </h3>
                <p className="text-xs sm:text-sm text-[#30251C]/80 max-w-md mx-auto leading-relaxed">
                  Your order for sacred Ayurvedic remedies has been placed. We have sent a detailed receipt to <strong className="text-[#1F4D2E]">{confirmedOrder.customer_email}</strong>.
                </p>
              </div>

              {/* Order summary box */}
              <div className="bg-[#F1E8D4]/70 rounded-2xl p-5 border border-[#E8D7B5] text-left space-y-3">
                <div className="flex items-center justify-between text-xs pb-3 border-b border-[#E8D7B5]">
                  <span className="text-[#7A5527] font-medium">Estimated Delivery</span>
                  <span className="font-bold text-[#1F4D2E]">2 - 4 Business Days (Express)</span>
                </div>

                <div className="space-y-2 pt-1">
                  <p className="text-xs font-serif font-bold text-[#1F4D2E] uppercase tracking-wider">
                    Purchased Remedies ({confirmedOrder.items.length})
                  </p>
                  <div className="divide-y divide-[#E8D7B5]/60 max-h-40 overflow-y-auto pr-1">
                    {confirmedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <span className="font-medium text-[#30251C]">
                          {item.product_name || `Formulation #${item.product_id}`} × {item.quantity}
                        </span>
                        <span className="font-serif font-bold text-[#1F4D2E]">
                          ₹{Math.round(item.price_at_purchase > 100 ? item.price_at_purchase : item.price_at_purchase * 20) * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8D7B5] flex justify-between items-center">
                  <span className="text-sm font-bold text-[#30251C]">Total Paid</span>
                  <span className="font-serif text-xl font-bold text-[#1F4D2E]">
                    ₹{confirmedOrder.total_amount}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleFinish}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#1F4D2E] hover:bg-[#173A25] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 border border-[#B88A3B]/40"
                id="continue-shopping-btn"
              >
                <ShoppingBag className="w-4 h-4 text-[#B88A3B]" />
                <span>Continue Shopping Formulations</span>
              </button>
            </div>
          ) : (
            /* Checkout Form Flow */
            <form onSubmit={handlePlaceOrder} className="p-6 sm:p-8 space-y-6">
              
              {errorMessage && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {errorMessage}
                </div>
              )}

              {/* Step Accordion 1: Contact & Shipping */}
              <div className="border border-[#E8D7B5] rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setActiveStep('details')}
                  className={`w-full p-4 flex items-center justify-between text-left font-serif font-bold text-base transition-colors ${
                    activeStep === 'details' ? 'bg-[#F1E8D4] text-[#1F4D2E]' : 'bg-white text-[#30251C] hover:bg-[#FAF6EB]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1F4D2E] text-white text-xs flex items-center justify-center font-sans font-bold">
                      1
                    </span>
                    <span>Contact & Delivery Address</span>
                  </div>
                  <span className="text-xs font-sans font-medium text-[#7A5527]">
                    {activeStep === 'details' ? 'Editing' : 'Saved'}
                  </span>
                </button>

                {activeStep === 'details' && (
                  <div className="p-5 bg-[#FAF6EB] space-y-4 border-t border-[#E8D7B5]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-white border border-[#E8D7B5] rounded-xl px-3.5 py-2.5 text-xs text-[#30251C] focus:outline-none focus:ring-2 focus:ring-[#1F4D2E]"
                          id="checkout-name"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full bg-white border border-[#E8D7B5] rounded-xl px-3.5 py-2.5 text-xs text-[#30251C] focus:outline-none focus:ring-2 focus:ring-[#1F4D2E]"
                          id="checkout-email"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-white border border-[#E8D7B5] rounded-xl px-3.5 py-2.5 text-xs text-[#30251C] focus:outline-none focus:ring-2 focus:ring-[#1F4D2E]"
                        id="checkout-address"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#E8D7B5] rounded-xl px-3 py-2 text-xs text-[#30251C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#E8D7B5] rounded-xl px-3 py-2 text-xs text-[#30251C]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                          PIN Code
                        </label>
                        <input
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          className="w-full bg-white border border-[#E8D7B5] rounded-xl px-3 py-2 text-xs text-[#30251C]"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveStep('payment')}
                        className="px-6 py-2.5 rounded-full bg-[#1F4D2E] text-white text-xs font-semibold uppercase tracking-wider"
                      >
                        Continue to Payment
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Accordion 2: Mock Payment */}
              <div className="border border-[#E8D7B5] rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setActiveStep('payment')}
                  className={`w-full p-4 flex items-center justify-between text-left font-serif font-bold text-base transition-colors ${
                    activeStep === 'payment' ? 'bg-[#F1E8D4] text-[#1F4D2E]' : 'bg-white text-[#30251C] hover:bg-[#FAF6EB]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1F4D2E] text-white text-xs flex items-center justify-center font-sans font-bold">
                      2
                    </span>
                    <span>Payment Selection</span>
                  </div>
                  <span className="text-xs font-sans font-medium text-[#7A5527] uppercase">
                    {formData.paymentMethod}
                  </span>
                </button>

                {activeStep === 'payment' && (
                  <div className="p-5 bg-[#FAF6EB] space-y-4 border-t border-[#E8D7B5]">
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'upi' })}
                        className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                          formData.paymentMethod === 'upi'
                            ? 'border-[#1F4D2E] bg-[#F1E8D4] text-[#1F4D2E] font-bold ring-1 ring-[#1F4D2E]'
                            : 'border-[#E8D7B5] text-[#30251C] bg-white'
                        }`}
                      >
                        <QrCode className="w-5 h-5 text-[#B88A3B]" />
                        <span className="text-xs">Instant UPI</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                        className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                          formData.paymentMethod === 'card'
                            ? 'border-[#1F4D2E] bg-[#F1E8D4] text-[#1F4D2E] font-bold ring-1 ring-[#1F4D2E]'
                            : 'border-[#E8D7B5] text-[#30251C] bg-white'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-[#B88A3B]" />
                        <span className="text-xs">Card / RuPay</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                        className={`p-3 rounded-2xl border text-center flex flex-col items-center gap-1.5 transition-all ${
                          formData.paymentMethod === 'cod'
                            ? 'border-[#1F4D2E] bg-[#F1E8D4] text-[#1F4D2E] font-bold ring-1 ring-[#1F4D2E]'
                            : 'border-[#E8D7B5] text-[#30251C] bg-white'
                        }`}
                      >
                        <Banknote className="w-5 h-5 text-[#B88A3B]" />
                        <span className="text-xs">Pay on Arrival</span>
                      </button>
                    </div>

                    <div className="pt-2 flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-xs text-[#7A5527]">
                        <ShieldCheck className="w-4 h-4 text-[#3F6B35]" />
                        <span>100% Encrypted & Safe Indian Payment Gateway</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveStep('review')}
                        className="px-6 py-2.5 rounded-full bg-[#1F4D2E] text-white text-xs font-semibold uppercase tracking-wider"
                      >
                        Review Order
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Accordion 3: Review & Submit */}
              <div className="border border-[#E8D7B5] rounded-2xl overflow-hidden bg-white shadow-xs">
                <button
                  type="button"
                  onClick={() => setActiveStep('review')}
                  className={`w-full p-4 flex items-center justify-between text-left font-serif font-bold text-base transition-colors ${
                    activeStep === 'review' ? 'bg-[#F1E8D4] text-[#1F4D2E]' : 'bg-white text-[#30251C] hover:bg-[#FAF6EB]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#1F4D2E] text-white text-xs flex items-center justify-center font-sans font-bold">
                      3
                    </span>
                    <span>Order Review & Total</span>
                  </div>
                  <span className="text-xs font-serif font-bold text-[#1F4D2E]">
                    ₹{total}
                  </span>
                </button>

                {activeStep === 'review' && (
                  <div className="p-5 bg-[#FAF6EB] space-y-4 border-t border-[#E8D7B5]">
                    <div className="space-y-2 text-xs">
                      {items.map((i) => {
                        const itemPrice = i.product.price > 100 ? i.product.price : Math.round(i.product.price * 20);
                        return (
                          <div key={i.product.id} className="flex justify-between items-center text-[#30251C]">
                            <span className="line-clamp-1">{i.product.name} × {i.quantity}</span>
                            <span className="font-serif font-semibold text-[#1F4D2E]">₹{itemPrice * i.quantity}</span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="pt-3 border-t border-[#E8D7B5] space-y-1.5 text-xs text-[#7A5527]">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{subtotal}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (5%)</span>
                        <span>₹{tax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base text-[#1F4D2E] pt-2 border-t border-[#E8D7B5]">
                        <span className="font-serif">Amount Due</span>
                        <span className="font-serif">₹{total}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full min-h-[52px] rounded-full bg-[#1F4D2E] hover:bg-[#173A25] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 border border-[#B88A3B]/40"
                  id="submit-order-btn"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#B88A3B]" />
                      <span>Recording Sacred Order in Database...</span>
                    </>
                  ) : (
                    <>
                      <PackageCheck className="w-5 h-5 text-[#B88A3B]" />
                      <span>Place Order • ₹{total}</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
};
