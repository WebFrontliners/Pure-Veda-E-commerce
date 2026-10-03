import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Leaf, ShieldCheck } from 'lucide-react';

interface HeroBannerProps {
  onShopClick?: () => void;
  onStoryClick?: () => void;
}

export type BannerPosition = 'center' | 'right' | 'left' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';

export interface BannerSlide {
  id: number;
  image: string;
  alt: string;
  position: BannerPosition;
  customClass?: string;
  customStyle?: React.CSSProperties;
  eyebrow: string;
  eyebrowIcon?: React.ReactNode;
  titlePrimary: string;
  titleHighlight: string;
  subhead: string;
  description: string;
  primaryBtnText: string;
  primaryBtnAction: 'products' | 'story' | 'dealer';
  secondaryBtnText?: string;
  secondaryBtnAction?: 'products' | 'story' | 'dealer';
}

const BANNERS: BannerSlide[] = [
  {
    id: 1,
    image: '/images/banners/banner-1.jpg',
    alt: 'Pure Veda Ayurved - Ancient Mountain Herbal Botanicals and Elixirs',
    position: 'center',
    eyebrow: 'PURE VEDA AYURVED',
    eyebrowIcon: <Sparkles className="w-3.5 h-3.5 text-[#B88A3B]" />,
    titlePrimary: 'Ancient Wisdom for a',
    titleHighlight: 'Healthier Tomorrow',
    subhead: 'Pure. Natural. Authentic Ayurveda.',
    description:
      'Discover authentic Ayurvedic wellness formulations, handcrafted with sacred herbs and time-tested Vedic shastras for everyday vitality.',
    primaryBtnText: 'SHOP NOW',
    primaryBtnAction: 'products',
    secondaryBtnText: 'EXPLORE OUR STORY',
    secondaryBtnAction: 'story',
  },
  {
    id: 2,
    image: '/images/banners/banner-2.jpg',
    alt: 'Pure Veda Ayurved - Sacred Vedic Courtyard with Amla, Turmeric and Decoctions',
    position: 'right',
    customClass: 'lg:pr-12 xl:pr-20',
    eyebrow: 'THE SACRED ESSENCE',
    eyebrowIcon: <Leaf className="w-3.5 h-3.5 text-[#789447]" />,
    titlePrimary: 'Rooted in Tradition.',
    titleHighlight: 'Created for Today.',
    subhead: '100% Pure Botanical Formulations',
    description:
      'Harmonizing your body’s innate biological rhythms through solar-infused botanical oils, fresh wild harvests, and zero synthetic toxins.',
    primaryBtnText: 'EXPLORE PRODUCTS',
    primaryBtnAction: 'products',
    secondaryBtnText: 'OUR HERITAGE',
    secondaryBtnAction: 'story',
  },
  {
    id: 3,
    image: '/images/banners/banner-3.jpg',
    alt: 'Pure Veda Ayurved - Sunrise Lake Abhyanga Oils and Classical Healing Churnas',
    position: 'right',
    customClass: 'lg:pr-12 xl:pr-20',
    eyebrow: 'HOLISTIC WELLNESS',
    eyebrowIcon: <ShieldCheck className="w-3.5 h-3.5 text-[#B88A3B]" />,
    titlePrimary: 'Awaken Vitality with',
    titleHighlight: 'Timeless Rasayanas',
    subhead: 'Classical Shastric Recipes • AYUSH Certified',
    description:
      'Experience restorative everyday rituals with classical Abhyanga massage oils, micro-fine churnas, and artisanal bathing bars.',
    primaryBtnText: 'VIEW BEST SELLERS',
    primaryBtnAction: 'products',
    secondaryBtnText: 'BECOME A DEALER',
    secondaryBtnAction: 'dealer',
  },
];

// Map positioning presets to Flexbox container and text alignment
const POSITION_CONFIG: Record<
  BannerPosition,
  {
    overlayGradient: string;
    containerAlignment: string;
    cardAlignment: string;
    textAlign: string;
  }
> = {
  center: {
    overlayGradient: 'bg-gradient-to-t from-black/60 via-black/35 to-black/40',
    containerAlignment: 'justify-center items-center',
    cardAlignment: 'items-center text-center mx-auto',
    textAlign: 'text-center',
  },
  right: {
    overlayGradient: 'bg-gradient-to-r from-transparent via-black/30 to-black/75',
    containerAlignment: 'justify-end items-center',
    cardAlignment: 'items-start text-left ml-auto',
    textAlign: 'text-left',
  },
  left: {
    overlayGradient: 'bg-gradient-to-l from-transparent via-black/30 to-black/75',
    containerAlignment: 'justify-start items-center',
    cardAlignment: 'items-start text-left mr-auto',
    textAlign: 'text-left',
  },
  'top-right': {
    overlayGradient: 'bg-gradient-to-b from-black/70 via-black/30 to-transparent',
    containerAlignment: 'justify-end items-start pt-12 sm:pt-16',
    cardAlignment: 'items-start text-left ml-auto',
    textAlign: 'text-left',
  },
  'bottom-right': {
    overlayGradient: 'bg-gradient-to-t from-black/75 via-black/30 to-transparent',
    containerAlignment: 'justify-end items-end pb-16 sm:pb-20',
    cardAlignment: 'items-start text-left ml-auto',
    textAlign: 'text-left',
  },
  'top-left': {
    overlayGradient: 'bg-gradient-to-b from-black/70 via-black/30 to-transparent',
    containerAlignment: 'justify-start items-start pt-12 sm:pt-16',
    cardAlignment: 'items-start text-left mr-auto',
    textAlign: 'text-left',
  },
  'bottom-left': {
    overlayGradient: 'bg-gradient-to-t from-black/75 via-black/30 to-transparent',
    containerAlignment: 'justify-start items-end pb-16 sm:pb-20',
    cardAlignment: 'items-start text-left mr-auto',
    textAlign: 'text-left',
  },
};

export const HeroBanner: React.FC<HeroBannerProps> = ({ onShopClick, onStoryClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % BANNERS.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + BANNERS.length) % BANNERS.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const handleAction = (action?: 'products' | 'story' | 'dealer') => {
    if (!action) return;
    if (action === 'products') {
      if (onShopClick) onShopClick();
      else {
        const el = document.getElementById('products');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'story') {
      if (onStoryClick) onStoryClick();
      else {
        const el = document.getElementById('story');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (action === 'dealer') {
      const el = document.getElementById('dealer');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Autoplay timer with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(timer);
  }, [nextSlide, isPaused]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      nextSlide();
    } else if (distance < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      id="home"
      aria-label="Ayurvedic Wellness Hero Carousel"
      className="relative w-full h-[calc(100vh-115px)] min-h-[580px] max-h-[960px] overflow-hidden bg-[#1F4D2E] select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 3 Full-Screen Slides with Smooth Transitions */}
      {BANNERS.map((banner, index) => {
        const isActive = index === currentIndex;
        const config = POSITION_CONFIG[banner.position] || POSITION_CONFIG.center;

        return (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
            aria-hidden={!isActive}
          >
            {/* Background Photographic Image with subtle Ken Burns effect */}
            <img
              src={banner.image}
              alt={banner.alt}
              className={`w-full h-full object-cover object-center transform transition-transform duration-[7000ms] ease-out ${
                isActive ? 'scale-105' : 'scale-100'
              }`}
              loading={index === 0 ? 'eager' : 'lazy'}
            />

            {/* Position-Tailored Atmospheric Overlay */}
            <div className={`absolute inset-0 ${config.overlayGradient} transition-opacity duration-1000`} />

            {/* Content Container positioned according to slide configuration */}
            <div className={`absolute inset-0 z-10 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex ${config.containerAlignment}`}>
              <div
                className={`max-w-xl sm:max-w-2xl flex flex-col space-y-4 sm:space-y-5 transition-all duration-700 delay-150 transform ${
                  isActive ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                } ${config.cardAlignment} ${banner.customClass || ''}`}
                style={banner.customStyle}
              >
                {/* Eyebrow Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-[#B88A3B]/50 shadow-sm">
                  {banner.eyebrowIcon}
                  <span className="text-[11px] sm:text-xs font-serif font-bold uppercase tracking-[0.25em] text-[#F1E8D4]">
                    {banner.eyebrow}
                  </span>
                </div>

                {/* Main Headline */}
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.12] drop-shadow-md">
                  {banner.titlePrimary}{' '}
                  <span className="text-[#B88A3B] italic font-normal block sm:inline">
                    {banner.titleHighlight}
                  </span>
                </h1>

                {/* Subhead Tagline */}
                <p className="font-serif font-bold text-sm sm:text-base md:text-lg text-[#F1E8D4] tracking-wide drop-shadow-sm">
                  {banner.subhead}
                </p>

                {/* Description */}
                <p className="text-xs sm:text-sm md:text-base text-white/90 font-normal leading-relaxed max-w-lg drop-shadow-sm">
                  {banner.description}
                </p>

                {/* Action Buttons */}
                <div
                  className={`pt-2 sm:pt-3 flex flex-wrap gap-3 ${
                    banner.position === 'center' ? 'justify-center' : 'justify-start'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleAction(banner.primaryBtnAction)}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[#1F4D2E] hover:bg-[#173A25] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 border border-[#B88A3B]/60"
                  >
                    <span>{banner.primaryBtnText}</span>
                    <ArrowRight className="w-4 h-4 text-[#B88A3B]" />
                  </button>

                  {banner.secondaryBtnText && (
                    <button
                      type="button"
                      onClick={() => handleAction(banner.secondaryBtnAction)}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-black/35 hover:bg-black/55 text-[#FAF6EB] font-bold text-xs uppercase tracking-wider border border-white/30 backdrop-blur-md transition-all shadow-sm hover:border-[#B88A3B]"
                    >
                      <span>{banner.secondaryBtnText}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Left Navigation Arrow */}
      <button
        type="button"
        onClick={prevSlide}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/30 hover:bg-black/60 text-white/85 hover:text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 focus:outline-none"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* Right Navigation Arrow */}
      <button
        type="button"
        onClick={nextSlide}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/30 hover:bg-black/60 text-white/85 hover:text-white backdrop-blur-md border border-white/20 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105 opacity-80 sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 focus:outline-none"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* Bottom Carousel Indicator Dots / Pills */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/15 shadow-md">
        {BANNERS.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <button
              key={banner.id}
              type="button"
              onClick={() => goToSlide(index)}
              className={`h-2 transition-all duration-300 rounded-full focus:outline-none ${
                isActive
                  ? 'w-8 bg-[#B88A3B] shadow-xs'
                  : 'w-2 bg-white/60 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={isActive ? 'true' : 'false'}
            />
          );
        })}
      </div>
    </section>
  );
};
