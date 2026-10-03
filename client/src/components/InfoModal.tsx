import React from 'react';
import { X, Leaf, Phone, Mail, MapPin, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface InfoModalProps {
  type: 'about' | 'wellness' | 'contact' | 'policy' | null;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-[#30251C]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4 sm:p-6 text-center">
        <div
          className="relative bg-[#FAF6EB] rounded-3xl max-w-2xl w-full text-left overflow-hidden shadow-2xl border border-[#E8D7B5] p-6 sm:p-8 space-y-6 animate-fade-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8D7B5]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-[#B88A3B] bg-black shrink-0">
                <img src="/logo.jpg" alt="Pure Veda Ayurved" className="w-full h-full object-cover" />
              </div>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#1F4D2E]">
                {type === 'about' && 'About Pure Veda Ayurved'}
                {type === 'wellness' && 'Ayurveda & Holistic Living'}
                {type === 'contact' && 'Contact Our Ayurvedic Vaidyas'}
                {type === 'policy' && 'Customer Care & Policies'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 rounded-full hover:bg-[#F1E8D4]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="text-xs sm:text-sm text-[#30251C]/85 leading-relaxed space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            {type === 'about' && (
              <>
                <p>
                  <strong>Pure Veda Ayurved</strong> was founded with a singular sacred mission: to revive the authentic, classical science of Indian Ayurveda and present it with uncompromising purity and modern convenience.
                </p>
                <p>
                  Every formulation in our apothecary—from our nourishing <em>Herbal Hair Oil</em> and warm <em>Massage Oil</em> to our rejuvenating <em>Narvo Muqt Powder</em> and <em>Pure Triphala</em>—is prepared strictly in accordance with traditional Ayurvedic texts, avoiding artificial preservatives, heavy metals, parabens, or synthetic fragrance.
                </p>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-[#F1E8D4] rounded-xl border border-[#E8D7B5]">
                    <h5 className="font-serif font-bold text-[#1F4D2E]">100% Ayush Certified</h5>
                    <p className="text-[11px] text-[#7A5527]">Manufactured under strict GMP regulations.</p>
                  </div>
                  <div className="p-3 bg-[#F1E8D4] rounded-xl border border-[#E8D7B5]">
                    <h5 className="font-serif font-bold text-[#1F4D2E]">Wild Herbal Sourcing</h5>
                    <p className="text-[11px] text-[#7A5527]">Directly gathered from Western Ghats & Himalayas.</p>
                  </div>
                </div>
              </>
            )}

            {type === 'wellness' && (
              <>
                <h4 className="font-serif font-bold text-base text-[#1F4D2E]">The Core Principles of Ayurveda</h4>
                <p>
                  Ayurveda regards each human being as a unique combination of the five great elements (Pancha Mahabhuta): Space, Air, Fire, Water, and Earth, manifested as the three Doshas:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#30251C]">
                  <li><strong>Vata (Air & Space):</strong> Governs nerve impulses, breath, and movement. Nourished by warm Abhyanga massage oils.</li>
                  <li><strong>Pitta (Fire & Water):</strong> Governs metabolism, digestion, and skin radiance. Soothed by cooling herbs like Sandalwood and Amla.</li>
                  <li><strong>Kapha (Earth & Water):</strong> Governs bodily structure and moisture. Balanced by stimulating herbal cleansers like Neem and Tooth Powder.</li>
                </ul>
                <p className="pt-2">
                  Daily practice of <em>Dinacharya</em> (morning Ayurvedic ritual), tongue scraping, herbal dental hygiene, and Rasayana supplementation brings enduring vitality.
                </p>
              </>
            )}

            {type === 'contact' && (
              <>
                <p>
                  Have questions about your Dosha, our herbal formulations, or your order? Our in-house Ayurvedic specialists and customer care team are here to assist.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="p-3.5 bg-[#F1E8D4] rounded-2xl flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#1F4D2E]" />
                    <div>
                      <p className="font-bold text-xs text-[#1F4D2E]">Helpline & WhatsApp Support</p>
                      <p className="text-xs">+91 1800 258 7890 (Toll Free, 9 AM - 7 PM IST)</p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-[#F1E8D4] rounded-2xl flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#1F4D2E]" />
                    <div>
                      <p className="font-bold text-xs text-[#1F4D2E]">Email Us</p>
                      <p className="text-xs">care@purevedaayurved.com / orders@purevedaayurved.com</p>
                    </div>
                  </div>
                  <div className="p-3.5 bg-[#F1E8D4] rounded-2xl flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#1F4D2E]" />
                    <div>
                      <p className="font-bold text-xs text-[#1F4D2E]">Apothecary Headquarters</p>
                      <p className="text-xs">Pure Veda Ayurved Complex, Sector 18, Udyog Vihar, India</p>
                    </div>
                  </div>
                </div>
              </>
            )}

            {type === 'policy' && (
              <>
                <h4 className="font-serif font-bold text-base text-[#1F4D2E]">Shipping & Delivery Policy</h4>
                <p>
                  All orders are dispatched within 24 hours of receipt via insured express courier. Delivery across major Indian cities takes 2-4 business days. Free shipping applies to all orders ₹499 and above.
                </p>
                <h4 className="font-serif font-bold text-base text-[#1F4D2E] pt-2">15-Day Purity Guarantee & Returns</h4>
                <p>
                  If you receive damaged products or are unsatisfied with the herbal freshness, please reach out to our support within 15 days for a replacement or refund.
                </p>
                <h4 className="font-serif font-bold text-base text-[#1F4D2E] pt-2">Zero Chemical Pledge</h4>
                <p>
                  Our products carry zero synthetic parabens, artificial petrochemical silicones, SLS, or synthetic colours.
                </p>
              </>
            )}
          </div>

          <div className="pt-2 border-t border-[#E8D7B5] flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#1F4D2E] text-white text-xs font-semibold uppercase tracking-wider"
            >
              Close
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
