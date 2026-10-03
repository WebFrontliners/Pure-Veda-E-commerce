import React from 'react';
import { ArrowRight, Leaf, ShieldCheck, CheckCircle2, Sprout } from 'lucide-react';

interface BrandStorySectionProps {
  onExploreProducts: () => void;
}

export const BrandStorySection: React.FC<BrandStorySectionProps> = ({ onExploreProducts }) => {
  return (
    <section 
      id="story" 
      className="w-full relative overflow-hidden bg-[#1F4D2E] min-h-[520px] lg:min-h-[580px] flex items-center select-none"
    >
      {/* Full-Screen Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src="/images/banners/essence_of_nature_bg.png"
          alt="The Essence of Nature - Ayurvedic Heritage"
          className="w-full h-full object-cover object-left md:object-center select-none"
          loading="lazy"
        />
        {/* Mobile Gradient Overlay for enhanced text readability on narrow viewports */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1F4D2E]/90 via-[#1F4D2E]/75 to-[#1F4D2E]/90 md:from-transparent md:via-transparent md:to-transparent pointer-events-none" />
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Brand Story & CTA Button */}
          <div className="lg:col-span-6 xl:col-span-5 space-y-5 text-center lg:text-left">
            <p className="text-xs sm:text-sm font-serif font-bold uppercase tracking-[0.25em] text-[#D8B15D] drop-shadow-xs">
              THE ESSENCE OF NATURE
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white font-bold tracking-tight leading-[1.15] drop-shadow-sm">
              The Power of <br />
              <span className="text-white">Pure Ayurveda</span>
            </h2>

            <p className="text-sm sm:text-base text-[#F1E8D4]/90 font-normal leading-relaxed max-w-lg mx-auto lg:mx-0 drop-shadow-xs">
              Time-tested formulations created for modern lifestyles. Discover natural wellness inspired by generations of Ayurvedic knowledge.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={onExploreProducts}
                className="inline-flex items-center gap-2.5 px-8 py-3.5 sm:py-4 rounded-lg bg-[#B88A3B] hover:bg-[#a1752b] text-[#1F4D2E] font-bold text-xs uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 cursor-pointer group"
                id="story-explore-products-btn"
              >
                <span>EXPLORE PRODUCTS</span>
                <ArrowRight className="w-4 h-4 text-[#1F4D2E] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Center Space: Allows the central mortar & pestle, tulsi, and amla to shine through */}
          <div className="hidden lg:block lg:col-span-1 xl:col-span-2" />

          {/* Right Column: Vintage Parchment Card with 2x2 Trust Badges */}
          <div className="lg:col-span-5 xl:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm sm:max-w-md bg-[#FAF4E6]/95 backdrop-blur-xs rounded-2xl p-6 sm:p-7 shadow-2xl border-2 border-[#D8C7A5]/80 relative transition-transform duration-300 hover:scale-[1.02]">
              
              {/* Subtle Deckle-Edge / Parchment Inner Border */}
              <div className="absolute inset-1.5 rounded-xl border border-dashed border-[#B88A3B]/30 pointer-events-none" />

              {/* 2x2 Trust Badges Grid */}
              <div className="grid grid-cols-2 gap-4 sm:gap-6 relative z-10">
                
                {/* 1. Supports Natural Healing */}
                <div className="flex flex-col items-center text-center p-2 group/badge">
                  <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border-1.5 border-[#1F4D2E] bg-white/60 flex items-center justify-center text-[#1F4D2E] mb-2.5 transition-transform group-hover/badge:scale-110 duration-200">
                    <Leaf className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.6]" />
                  </div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-[#1F4D2E] leading-snug">
                    Supports <br />Natural Healing
                  </h3>
                </div>

                {/* 2. Promotes Overall Wellness */}
                <div className="flex flex-col items-center text-center p-2 group/badge">
                  <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border-1.5 border-[#1F4D2E] bg-white/60 flex items-center justify-center text-[#1F4D2E] mb-2.5 transition-transform group-hover/badge:scale-110 duration-200">
                    <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.6]" />
                  </div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-[#1F4D2E] leading-snug">
                    Promotes <br />Overall Wellness
                  </h3>
                </div>

                {/* 3. Safe for Daily Use */}
                <div className="flex flex-col items-center text-center p-2 group/badge">
                  <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border-1.5 border-[#1F4D2E] bg-white/60 flex items-center justify-center text-[#1F4D2E] mb-2.5 transition-transform group-hover/badge:scale-110 duration-200">
                    <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.6]" />
                  </div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-[#1F4D2E] leading-snug">
                    Safe for <br />Daily Use
                  </h3>
                </div>

                {/* 4. Made with Herbal Extracts */}
                <div className="flex flex-col items-center text-center p-2 group/badge">
                  <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-full border-1.5 border-[#1F4D2E] bg-white/60 flex items-center justify-center text-[#1F4D2E] mb-2.5 transition-transform group-hover/badge:scale-110 duration-200">
                    <Sprout className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.6]" />
                  </div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-[#1F4D2E] leading-snug">
                    Made with <br />Herbal Extracts
                  </h3>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
