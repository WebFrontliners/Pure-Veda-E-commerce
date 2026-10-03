import React, { useState } from 'react';
import {
  TrendingUp,
  Percent,
  Megaphone,
  CheckCircle2,
  ArrowRight,
  Send,
  ShieldCheck
} from 'lucide-react';
import { DealerEnquiry } from '../types';

interface BecomeDealerSectionProps {
  onOpenEnquiryModal: () => void;
}

export const BecomeDealerSection: React.FC<BecomeDealerSectionProps> = ({
  onOpenEnquiryModal,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<DealerEnquiry>({
    full_name: '',
    business_name: '',
    phone: '',
    email: '',
    city: '',
    state: '',
    pin_code: '',
    business_type: 'Retailer / Chemist',
    current_business: 'Ayurvedic Pharmacy & Wellness',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        full_name: '',
        business_name: '',
        phone: '',
        email: '',
        city: '',
        state: '',
        pin_code: '',
        business_type: 'Retailer / Chemist',
        current_business: '',
        message: '',
      });
      setTimeout(() => setSubmitted(false), 6000);
    }, 600);
  };

  return (
    <section 
      id="dealer" 
      className="w-full relative overflow-hidden bg-[#FAF6EB] min-h-[580px] lg:min-h-[660px] flex items-center border-y border-[#E8D7B5]"
    >
      {/* Full-Screen Panoramic Background Image */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <img
          src="/images/banners/distributor_bg.png"
          alt="Become a Pure Veda Ayurved Distributor Partnership"
          className="w-full h-full object-cover object-left md:object-center select-none"
          loading="lazy"
        />
        {/* Soft Desktop Vignette / Gradient blending the right side for typography */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FAF6EB]/20 to-[#FAF6EB]/85 hidden lg:block" />
        {/* Mobile Backdrop Overlay for contrast on narrow viewports */}
        <div className="absolute inset-0 bg-[#FAF6EB]/85 md:bg-[#FAF6EB]/75 lg:hidden" />
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
        
        {/* Split Grid: Left open for background handshake, Right for Distributor Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Kept clear on large screens so the handshake & Ayurvedic botanical table shine through */}
          <div className="hidden lg:block lg:col-span-5 xl:col-span-6" />

          {/* Right Column: Distributor Value Proposition & Form Toggle */}
          <div className="lg:col-span-7 xl:col-span-6 space-y-6 lg:pl-6 text-center lg:text-left">
            
            {/* Header Content */}
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8D7B5]/60 border border-[#B88A3B]/40 text-[#7A5527] text-xs font-semibold tracking-wider uppercase">
                <span>GROW TOGETHER</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F4D2E] font-bold tracking-tight leading-[1.15]">
                Become a Pure Veda <br />
                <span className="text-[#B88A3B]">Ayurved Distributor</span>
              </h2>

              <p className="text-sm sm:text-base text-[#30251C]/80 font-normal leading-relaxed max-w-xl mx-auto lg:mx-0">
                Partner with Pure Veda Ayurved and become part of our journey to bring authentic Ayurvedic wellness products to more customers nationwide.
              </p>
            </div>

            {/* 4 Circular Partner Benefits Badges (2x2 Grid) */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 py-2">
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-3 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#E8D7B5]/80 shadow-xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full border-1.5 border-[#1F4D2E] bg-white flex items-center justify-center text-[#1F4D2E] shrink-0 shadow-xs">
                  <ShieldCheck className="w-6 h-6 stroke-[1.6]" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1F4D2E]">
                    Certified Quality
                  </h4>
                  <p className="text-[11px] text-[#30251C]/70">
                    GMP-certified pure Vedic remedies
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-3 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#E8D7B5]/80 shadow-xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full border-1.5 border-[#1F4D2E] bg-white flex items-center justify-center text-[#1F4D2E] shrink-0 shadow-xs">
                  <TrendingUp className="w-6 h-6 stroke-[1.6]" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1F4D2E]">
                    Brand Growth
                  </h4>
                  <p className="text-[11px] text-[#30251C]/70">
                    Rapidly expanding PAN-India reach
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-3 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#E8D7B5]/80 shadow-xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full border-1.5 border-[#1F4D2E] bg-white flex items-center justify-center text-[#1F4D2E] shrink-0 shadow-xs">
                  <Percent className="w-6 h-6 stroke-[1.6]" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1F4D2E]">
                    High Margins
                  </h4>
                  <p className="text-[11px] text-[#30251C]/70">
                    Lucrative distributor trade profits
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-3 rounded-2xl bg-white/70 backdrop-blur-xs border border-[#E8D7B5]/80 shadow-xs hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-full border-1.5 border-[#1F4D2E] bg-white flex items-center justify-center text-[#1F4D2E] shrink-0 shadow-xs">
                  <Megaphone className="w-6 h-6 stroke-[1.6]" />
                </div>
                <div className="text-center sm:text-left">
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#1F4D2E]">
                    Marketing Support
                  </h4>
                  <p className="text-[11px] text-[#30251C]/70">
                    Free promotional collateral & POS
                  </p>
                </div>
              </div>

            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#1F4D2E] hover:bg-[#173A25] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                id="dealer-apply-btn"
              >
                <span>{showForm ? 'CLOSE APPLICATION' : 'APPLY AS DISTRIBUTOR'}</span>
                <ArrowRight className="w-4 h-4 text-[#B88A3B]" />
              </button>

              <button
                type="button"
                onClick={() => setShowForm(!showForm)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white/80 hover:bg-white text-[#1F4D2E] font-bold text-xs uppercase tracking-wider border border-[#B88A3B]/60 transition-all shadow-xs hover:shadow-md cursor-pointer"
                id="dealer-enquire-btn"
              >
                <span>QUICK ENQUIRY</span>
              </button>
            </div>

          </div>

        </div>

        {/* Collapsible Interactive Dealer Enquiry Form */}
        {showForm && (
          <div id="dealer-form" className="mt-10 bg-white/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-[#B88A3B]/40 shadow-2xl max-w-4xl mx-auto animate-fade-in">
            <div className="mb-6 pb-4 border-b border-[#E8D7B5] flex items-center justify-between">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#1F4D2E]">
                  Distributor Application & Enquiry Form
                </h3>
                <p className="text-xs text-[#7A5527] mt-1">
                  Please fill in your business details. Our commercial partnership team will respond within 24 hours.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xs font-bold text-[#7A5527] hover:text-[#1F4D2E] px-3 py-1 bg-[#F1E8D4] rounded-full cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-fade-in">
                <div className="w-16 h-16 bg-[#1F4D2E] text-[#B88A3B] rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#1F4D2E]">
                  Enquiry Submitted Successfully!
                </h4>
                <p className="text-xs text-[#30251C]/80 max-w-md mx-auto leading-relaxed">
                  Thank you for your interest in partnering with Pure Veda Ayurved. Our regional distributor manager will review your submission and connect with you via phone and email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      placeholder="e.g. Rajesh Kumar"
                      className="w-full bg-[#FAF6EB] border border-[#E8D7B5] rounded-xl px-3.5 py-2.5 text-xs text-[#30251C] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.business_name}
                      onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                      placeholder="e.g. Sanjeevani Ayurvedic Stores"
                      className="w-full bg-[#FAF6EB] border border-[#E8D7B5] rounded-xl px-3.5 py-2.5 text-xs text-[#30251C] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D2E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#FAF6EB] border border-[#E8D7B5] rounded-xl px-3.5 py-2.5 text-xs text-[#30251C] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="distributor@example.com"
                      className="w-full bg-[#FAF6EB] border border-[#E8D7B5] rounded-xl px-3.5 py-2.5 text-xs text-[#30251C] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D2E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="Mumbai / Delhi..."
                      className="w-full bg-[#FAF6EB] border border-[#E8D7B5] rounded-xl px-3 py-2 text-xs text-[#30251C] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      placeholder="Maharashtra / UP..."
                      className="w-full bg-[#FAF6EB] border border-[#E8D7B5] rounded-xl px-3 py-2 text-xs text-[#30251C] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D2E]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.pin_code}
                      onChange={(e) => setFormData({ ...formData, pin_code: e.target.value })}
                      placeholder="400001"
                      className="w-full bg-[#FAF6EB] border border-[#E8D7B5] rounded-xl px-3 py-2 text-xs text-[#30251C] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D2E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                      Business Type
                    </label>
                    <select
                      value={formData.business_type}
                      onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                      className="w-full bg-[#FAF6EB] border border-[#E8D7B5] rounded-xl px-3 py-2.5 text-xs text-[#30251C] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D2E]"
                    >
                      <option value="Retailer / Chemist">Retailer / Chemist Store</option>
                      <option value="Wholesaler / Stockist">Wholesaler / Stockist</option>
                      <option value="Regional Distributor">Regional Distributor</option>
                      <option value="Ayurvedic Clinic / Vaidya">Ayurvedic Clinic / Vaidya</option>
                      <option value="Modern Trade / Supermarket">Modern Trade / Supermarket</option>
                      <option value="E-commerce Seller">E-commerce Seller</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                      Current Categories / Distribution
                    </label>
                    <input
                      type="text"
                      value={formData.current_business}
                      onChange={(e) => setFormData({ ...formData, current_business: e.target.value })}
                      placeholder="Herbal products, FMCG, Pharmacy"
                      className="w-full bg-[#FAF6EB] border border-[#E8D7B5] rounded-xl px-3.5 py-2.5 text-xs text-[#30251C] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D2E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-[#7A5527] mb-1">
                    Message / Expected Volume
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your distribution reach, store network, or territory interest..."
                    className="w-full bg-[#FAF6EB] border border-[#E8D7B5] rounded-xl px-3.5 py-2.5 text-xs text-[#30251C] focus:outline-hidden focus:ring-2 focus:ring-[#1F4D2E]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-full bg-[#1F4D2E] hover:bg-[#173A25] text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 border border-[#B88A3B]/40 cursor-pointer"
                    id="submit-dealer-enquiry-btn"
                  >
                    <Send className="w-4 h-4 text-[#B88A3B]" />
                    <span>{isSubmitting ? 'Submitting Application...' : 'SUBMIT DISTRIBUTOR ENQUIRY'}</span>
                  </button>
                </div>

              </form>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
