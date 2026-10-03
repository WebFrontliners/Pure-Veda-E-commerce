import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Menu,
  X,
  Heart,
  User,
  ShieldCheck,
  Leaf,
  Sparkles,
  PhoneCall,
  Briefcase
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenDealer: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onOpenInfo: (type: 'about' | 'wellness' | 'contact') => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onNavigateSection: (sectionId: string) => void;
  currentView?: 'home' | 'products';
  onNavigateView?: (view: 'home' | 'products') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAdmin,
  onOpenDealer,
  onOpenWishlist,
  onOpenAccount,
  onOpenInfo,
  searchTerm,
  onSearchChange,
  onNavigateSection,
  currentView = 'home',
  onNavigateView,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const itemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useCartStore((state) => state.getWishlistCount());
  const openCart = useCartStore((state) => state.openCart);

  const handleNavClick = (sectionId: string) => {
    if (sectionId === 'home') {
      if (onNavigateView) onNavigateView('home');
      else onNavigateSection('home');
    } else if (sectionId === 'categories' || sectionId === 'products') {
      if (onNavigateView) onNavigateView('products');
      else onNavigateSection('categories');
    } else {
      if (currentView === 'products' && onNavigateView) {
        onNavigateView('home');
        setTimeout(() => onNavigateSection(sectionId), 100);
      } else {
        onNavigateSection(sectionId);
      }
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF6EB] border-b border-[#E8D7B5]/80 shadow-xs transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-[#1F4D2E] text-[#FAF6EB] text-[11px] sm:text-xs py-1.5 px-4 font-medium tracking-wide border-b border-[#B88A3B]/40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-6 text-[#FAF6EB]/90">
            <span className="flex items-center gap-1.5">
              <span>🌿</span> 100% Natural Ingredients
            </span>
            <span className="hidden md:inline text-[#B88A3B]/50">|</span>
            <span className="hidden md:flex items-center gap-1.5">
              <span>🚚</span> Free Shipping on Orders Above ₹999
            </span>
            <span className="hidden lg:inline text-[#B88A3B]/50">|</span>
            <span className="hidden lg:flex items-center gap-1.5">
              <span>📜</span> Ayurvedic Formulas
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#FAF6EB]/90 text-[11px]">
            <button
              onClick={() => onOpenInfo('contact')}
              className="hover:text-[#B88A3B] transition-colors"
            >
              Track Order
            </button>
            <span className="text-[#B88A3B]/50">|</span>
            <button
              onClick={() => onOpenInfo('contact')}
              className="hover:text-[#B88A3B] transition-colors"
            >
              Help
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 -ml-2 rounded-lg text-[#30251C] hover:text-[#1F4D2E] hover:bg-[#F1E8D4] focus:outline-none transition-colors"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left: Pure Veda Ayurved Logo */}
          <div className="flex items-center gap-3">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
              className="flex items-center gap-3 group"
            >
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden shadow-md border-2 border-[#B88A3B] group-hover:scale-105 transition-transform duration-200 bg-black shrink-0">
                <img
                  src="/logo.jpg"
                  alt="Pure Veda Ayurved Official Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#1F4D2E] leading-none">
                  PURE VEDA
                </span>
                <span className="text-[11px] font-serif font-bold tracking-[0.25em] text-[#B88A3B] uppercase mt-0.5">
                  AYURVED
                </span>
              </div>
            </a>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-[13px] font-semibold text-[#30251C]">
            <button
              onClick={() => handleNavClick('home')}
              className={`${
                currentView === 'home'
                  ? 'text-[#1F4D2E] border-b-2 border-[#1F4D2E] font-bold'
                  : 'text-[#30251C] hover:text-[#1F4D2E]'
              } transition-colors relative py-1 cursor-pointer`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('products')}
              className={`${
                currentView === 'products'
                  ? 'text-[#1F4D2E] border-b-2 border-[#1F4D2E] font-bold'
                  : 'text-[#30251C] hover:text-[#1F4D2E]'
              } transition-colors relative py-1 cursor-pointer`}
            >
              Our Products
            </button>
            <button
              onClick={() => handleNavClick('story')}
              className="hover:text-[#1F4D2E] transition-colors relative py-1 hover:border-b-2 hover:border-[#1F4D2E] cursor-pointer"
            >
              About Us
            </button>
            <button
              onClick={() => handleNavClick('wellness')}
              className="hover:text-[#1F4D2E] transition-colors relative py-1 hover:border-b-2 hover:border-[#1F4D2E] cursor-pointer"
            >
              Ayurveda & Wellness
            </button>
            <button
              onClick={() => onOpenDealer()}
              className="hover:text-[#1F4D2E] transition-colors relative py-1 hover:border-b-2 hover:border-[#1F4D2E]"
            >
              Become a Dealer
            </button>
            <button
              onClick={() => onOpenInfo('contact')}
              className="hover:text-[#1F4D2E] transition-colors relative py-1 hover:border-b-2 hover:border-[#1F4D2E]"
            >
              Contact Us
            </button>
          </nav>

          {/* Right Action Icons: Search, User/Account, Wishlist, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Icon / Bar Toggle */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 sm:p-2.5 rounded-full text-[#30251C] hover:text-[#1F4D2E] hover:bg-[#F1E8D4] transition-colors"
                aria-label="Search formulations"
                title="Search formulations"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* User / Account Icon */}
            <button
              onClick={onOpenAccount}
              className="p-2 sm:p-2.5 rounded-full text-[#30251C] hover:text-[#1F4D2E] hover:bg-[#F1E8D4] transition-colors"
              aria-label="Account & Login"
              title="Customer Account"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Wishlist Icon with Count */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 sm:p-2.5 rounded-full text-[#30251C] hover:text-[#1F4D2E] hover:bg-[#F1E8D4] transition-colors"
              aria-label="Wishlist"
              title="Saved Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#B88A3B] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon with Item Count */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-full bg-[#1F4D2E] text-white font-medium hover:bg-[#173A25] transition-all shadow-sm border border-[#B88A3B]/40 group"
              aria-label="Shopping Cart"
              id="header-cart-btn"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#FAF6EB] group-hover:scale-110 transition-transform" />
              <span className="hidden md:inline text-xs font-semibold tracking-wide">Cart</span>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold text-[#1F4D2E] bg-[#FAF6EB] rounded-full">
                {itemCount}
              </span>
            </button>

            {/* Staff Admin Portal Quick Shield (Discrete) */}
            <button
              onClick={onOpenAdmin}
              className="hidden xl:flex p-2 rounded-full text-[#7A5527] hover:text-[#1F4D2E] hover:bg-[#F1E8D4] transition-colors"
              title="Staff Admin Portal"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {searchOpen && (
          <div className="pb-4 pt-1 animate-fade-in">
            <div className="relative max-w-xl mx-auto w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search pure Ayurvedic products (Hair Oil, Triphala, Narvo Muqt, Soaps...)"
                className="w-full bg-[#F1E8D4]/60 border border-[#E8D7B5] rounded-full py-2.5 pl-11 pr-10 text-sm text-[#30251C] placeholder-[#7A5527]/70 focus:outline-none focus:ring-2 focus:ring-[#1F4D2E] shadow-inner"
                autoFocus
              />
              <Search className="w-4 h-4 text-[#7A5527] absolute left-4 top-1/2 -translate-y-1/2" />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-stone-500 hover:text-stone-800"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-[#30251C]/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-[#FAF6EB] h-full shadow-2xl flex flex-col p-6 z-10 border-r border-[#E8D7B5] animate-fade-in">
            <div className="flex items-center justify-between pb-6 border-b border-[#E8D7B5]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm border border-[#B88A3B] bg-black shrink-0">
                  <img
                    src="/logo.jpg"
                    alt="Pure Veda Ayurved"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1F4D2E]">PURE VEDA</h3>
                  <span className="text-[9px] font-serif font-bold tracking-widest text-[#B88A3B] uppercase">
                    AYURVED
                  </span>
                </div>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-stone-500 hover:text-stone-800 rounded-full hover:bg-[#F1E8D4]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-6 space-y-2 text-sm font-semibold text-[#30251C]">
              <button
                onClick={() => handleNavClick('home')}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F1E8D4] text-[#1F4D2E] font-bold"
              >
                🌿 Home
              </button>
              <button
                onClick={() => handleNavClick('products')}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F1E8D4]"
              >
                📦 Our Products
              </button>
              <button
                onClick={() => handleNavClick('story')}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F1E8D4]"
              >
                📖 About Us
              </button>
              <button
                onClick={() => handleNavClick('wellness')}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F1E8D4]"
              >
                🧘 Ayurveda & Wellness
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenDealer();
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl bg-[#F1E8D4] text-[#1F4D2E] font-bold flex items-center justify-between border border-[#B88A3B]/40"
              >
                <span>🤝 Become a Dealer</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-[#1F4D2E] text-white rounded-full">
                  Partner
                </span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenInfo('contact');
                }}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-[#F1E8D4]"
              >
                📞 Contact Us
              </button>
            </div>

            <div className="mt-auto pt-6 border-t border-[#E8D7B5] space-y-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 rounded-xl bg-[#1F4D2E] text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#B88A3B]" />
                <span>Dispensary Staff Portal</span>
              </button>
              <p className="text-[11px] text-stone-500 text-center font-serif">
                Pure • Natural • Ayurvedic
              </p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
