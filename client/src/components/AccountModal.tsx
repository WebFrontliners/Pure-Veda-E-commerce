import React, { useState } from 'react';
import { X, User, Phone, CheckCircle2, Package, Sparkles } from 'lucide-react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose }) => {
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneOrEmail) {
      setIsOtpSent(true);
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#30251C]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 text-center">
        <div
          className="relative bg-[#FAF6EB] rounded-3xl max-w-md w-full text-left overflow-hidden shadow-2xl border border-[#E8D7B5] p-6 sm:p-8 space-y-6 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-3 border-b border-[#E8D7B5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#B88A3B] bg-black shrink-0">
                <img src="/logo.jpg" alt="Pure Veda Ayurved" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#1F4D2E]">
                {isLoggedIn ? 'Vedic Wellness Account' : 'Customer Login & Track Orders'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-full hover:bg-[#F1E8D4]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoggedIn ? (
            <div className="space-y-4 text-xs text-[#30251C]">
              <div className="p-4 bg-[#F1E8D4] rounded-2xl border border-[#E8D7B5] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#1F4D2E]">Logged in as:</span>
                  <span className="font-mono">{phoneOrEmail || 'Customer'}</span>
                </div>
                <p className="text-[11px] text-[#7A5527]">
                  Gold Veda Loyalty Member • 120 Wellness Points
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-serif font-bold text-sm text-[#1F4D2E] flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#B88A3B]" />
                  <span>Recent Dispatched Orders</span>
                </h4>
                <div className="p-3 bg-white rounded-xl border border-[#E8D7B5] space-y-1">
                  <div className="flex justify-between font-bold">
                    <span>Order #1001</span>
                    <span className="text-emerald-700">Out for Delivery</span>
                  </div>
                  <p className="text-[11px] text-[#7A5527]">
                    Herbal Hair Oil, Narvo Muqt Powder • Standard Express
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsLoggedIn(false)}
                className="w-full py-2.5 rounded-full border border-[#E8D7B5] text-[#7A5527] font-semibold hover:bg-[#F1E8D4]"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-[#30251C]/80 leading-relaxed">
                Enter your mobile number or email to access your past orders, manage addresses, and check delivery status.
              </p>

              {!isOtpSent ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                      Mobile Number / Email
                    </label>
                    <input
                      type="text"
                      required
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      placeholder="e.g. +91 98765 43210 or user@example.com"
                      className="w-full bg-[#F1E8D4]/60 border border-[#E8D7B5] rounded-xl px-3.5 py-2.5 text-xs text-[#30251C] focus:outline-none focus:ring-2 focus:ring-[#1F4D2E]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#1F4D2E] hover:bg-[#173A25] text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all"
                  >
                    CONTINUE WITH OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                      Enter 4-Digit OTP (Demo: type any code)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="1234"
                      className="w-full bg-[#F1E8D4]/60 border border-[#E8D7B5] rounded-xl px-3.5 py-2.5 text-xs font-mono text-center tracking-widest text-[#30251C] focus:outline-none focus:ring-2 focus:ring-[#1F4D2E]"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#1F4D2E] hover:bg-[#173A25] text-white font-semibold text-xs uppercase tracking-wider shadow-sm transition-all"
                  >
                    VERIFY & ACCESS ACCOUNT
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
