import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
  onOpenDealer?: () => void;
  onNavigateSection?: (sectionId: string) => void;
  onOpenInfo?: (type: 'about' | 'wellness' | 'contact' | 'policy') => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenDealer,
  onNavigateSection,
  onOpenInfo,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#122E1D] text-[#F1E8D4] pt-14 pb-8 border-t border-[#B88A3B]/40 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-[#FAF6EB]/10">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-3 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-[#B88A3B] bg-black shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Pure Veda Ayurved"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-serif font-bold text-[#B88A3B] tracking-wider uppercase">
                  Natural. Authentic. Ayurvedic.
                </span>
              </div>
            </div>

            <p className="text-xs text-[#F1E8D4]/75 leading-relaxed">
              Pure Veda Ayurved brings time-tested Ayurvedic wisdom to modern lifestyles for a healthier and happier tomorrow.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-[#FAF6EB]/10 hover:bg-[#B88A3B] text-[#FAF6EB] hover:text-[#173A25] flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-[#FAF6EB]/10 hover:bg-[#B88A3B] text-[#FAF6EB] hover:text-[#173A25] flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-[#FAF6EB]/10 hover:bg-[#B88A3B] text-[#FAF6EB] hover:text-[#173A25] flex items-center justify-center transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
              <a
                href="#"
                className="w-7 h-7 rounded-full bg-[#FAF6EB]/10 hover:bg-[#B88A3B] text-[#FAF6EB] hover:text-[#173A25] flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="font-serif text-xs font-bold text-[#FAF6EB] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-xs text-[#F1E8D4]/75">
              <li>
                <button
                  onClick={() => onNavigateSection?.('home')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('story')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('categories')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Our Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('wellness')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Ayurveda & Wellness
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenDealer?.()}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Become a Dealer
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInfo?.('contact')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="font-serif text-xs font-bold text-[#FAF6EB] uppercase tracking-wider">
              Customer Support
            </h4>
            <ul className="space-y-1.5 text-xs text-[#F1E8D4]/75">
              <li>
                <button
                  onClick={() => onOpenInfo?.('policy')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Shipping Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInfo?.('policy')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Return Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInfo?.('policy')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInfo?.('policy')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInfo?.('policy')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenInfo?.('policy')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Track Order
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Product Categories */}
          <div className="lg:col-span-2 space-y-2.5">
            <h4 className="font-serif text-xs font-bold text-[#FAF6EB] uppercase tracking-wider">
              Product Categories
            </h4>
            <ul className="space-y-1.5 text-xs text-[#F1E8D4]/75">
              <li>
                <button
                  onClick={() => onNavigateSection?.('categories')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Hair Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('categories')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Body Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('categories')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Oral Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('categories')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Skin Care
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('categories')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Herbal Powders
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection?.('categories')}
                  className="hover:text-[#B88A3B] transition-colors"
                >
                  Premium Soaps
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact Us & Payment Badges */}
          <div className="lg:col-span-3 space-y-2.5">
            <h4 className="font-serif text-xs font-bold text-[#FAF6EB] uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-2 text-xs text-[#F1E8D4]/80">
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#B88A3B] shrink-0" />
                <span>info@purevedaayurved.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#B88A3B] shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#B88A3B] shrink-0 mt-0.5" />
                <span>123 Wellness Street, Mumbai, Maharashtra, India</span>
              </li>
            </ul>

            {/* Payment Badges */}
            <div className="pt-2 flex items-center gap-2">
              <span className="px-2 py-1 bg-white text-[#122E1D] text-[10px] font-bold rounded shadow-xs">
                VISA
              </span>
              <span className="px-2 py-1 bg-white text-[#122E1D] text-[10px] font-bold rounded shadow-xs">
                Mastercard
              </span>
              <span className="px-2 py-1 bg-white text-[#122E1D] text-[10px] font-bold rounded shadow-xs">
                RuPay
              </span>
              <span className="px-2 py-1 bg-white text-[#122E1D] text-[10px] font-bold rounded shadow-xs">
                UPI
              </span>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Legal, Scroll to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#F1E8D4]/60 gap-4">
          <p>© Pure Veda Ayurved. All Rights Reserved.</p>

          <div className="flex items-center gap-6">
            <button onClick={() => onOpenInfo?.('policy')} className="hover:text-[#B88A3B]">
              Sitemap
            </button>
            <span>|</span>
            <button onClick={() => onOpenInfo?.('policy')} className="hover:text-[#B88A3B]">
              Terms
            </button>
            <span>|</span>
            <button onClick={() => onOpenInfo?.('policy')} className="hover:text-[#B88A3B]">
              Privacy
            </button>

            {onOpenAdmin && (
              <>
                <span>|</span>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-[#B88A3B] text-[11px]"
                >
                  Admin
                </button>
              </>
            )}
          </div>

          {/* Floating Scroll to Top button */}
          <button
            onClick={scrollToTop}
            className="w-8 h-8 rounded-full border border-[#FAF6EB]/20 bg-[#FAF6EB]/10 hover:bg-[#B88A3B] text-[#FAF6EB] hover:text-[#173A25] flex items-center justify-center transition-all shadow-xs"
            aria-label="Scroll to top"
          >
            ▲
          </button>
        </div>

      </div>
    </footer>
  );
};
