import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles, Pause, Play } from 'lucide-react';
import { Category } from '../types';

interface ProductCategoriesSectionProps {
  categories: Category[];
  onSelectCategory: (slug: string) => void;
  onQuickView: (productSlug: string) => void;
}

export const ProductCategoriesSection: React.FC<ProductCategoriesSectionProps> = ({
  categories,
  onSelectCategory,
  onQuickView,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [direction, setDirection] = useState<'left-to-right' | 'right-to-left'>('left-to-right');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [scrollStart, setScrollStart] = useState<number>(0);
  const [hasDragged, setHasDragged] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);

  // Duplicate the categories 4 times to ensure seamless infinite looping runway in both directions
  const repeatedCategories = categories && categories.length > 0
    ? [
        ...categories,
        ...categories,
        ...categories,
        ...categories,
      ]
    : [];

  // Helper to get total width of one full set of cards (including gaps)
  const getSingleSetWidth = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el || categories.length === 0 || el.children.length < categories.length * 2) {
      return 0;
    }
    const firstCard = el.children[0] as HTMLElement;
    const secondCard = el.children[1] as HTMLElement;
    if (!firstCard || !secondCard) return 0;
    const cardStep = secondCard.offsetLeft - firstCard.offsetLeft;
    return cardStep * categories.length;
  }, [categories]);

  // Initial positioning: Center the scroll in Set 2 so user can scroll left or right immediately
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const timer = setTimeout(() => {
      const setWidth = getSingleSetWidth();
      if (setWidth > 0) {
        // Position at set 2
        el.scrollLeft = setWidth * 1.5;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [categories, getSingleSetWidth]);

  // Check and wrap scroll position seamlessly
  const checkInfiniteWrap = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const setWidth = getSingleSetWidth();
    if (setWidth <= 0) return;

    // If scrolled past set 2 into set 3, wrap back by 1 set
    if (el.scrollLeft >= setWidth * 2.5) {
      el.scrollLeft -= setWidth;
    }
    // If scrolled back past set 1 into set 0, wrap forward by 1 set
    else if (el.scrollLeft <= setWidth * 0.5) {
      el.scrollLeft += setWidth;
    }
  }, [getSingleSetWidth]);

  // Continuous smooth auto-scroll animation
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    let lastTime = performance.now();

    const step = (now: number) => {
      const delta = now - lastTime;
      lastTime = now;

      if (!isPaused && !isDragging && el) {
        // Calm Ayurvedic auto-scroll speed (~45px per second)
        const speed = (delta * 0.045);
        if (direction === 'left-to-right') {
          // Visual movement left-to-right (cards glide toward the right)
          el.scrollLeft -= speed;
        } else {
          // Visual movement right-to-left (cards glide toward the left)
          el.scrollLeft += speed;
        }
        checkInfiniteWrap();
      }

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPaused, isDragging, direction, checkInfiniteWrap]);

  // Manual slide by 1 card distance
  const handleSlide = (navDirection: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const firstCard = el.children[0] as HTMLElement;
    const secondCard = el.children[1] as HTMLElement;
    const cardStep = secondCard && firstCard ? secondCard.offsetLeft - firstCard.offsetLeft : 360;

    // Update auto-scroll direction to match user intent
    setDirection(navDirection === 'left' ? 'left-to-right' : 'right-to-left');

    el.scrollBy({
      left: navDirection === 'left' ? -cardStep : cardStep,
      behavior: 'smooth',
    });

    // Check wrap after smooth scroll completes
    setTimeout(checkInfiniteWrap, 450);
  };

  // Mouse drag interaction
  const handleMouseDown = (e: React.MouseEvent) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setIsDragging(true);
    setStartX(e.pageX - el.offsetLeft);
    setScrollStart(el.scrollLeft);
    setHasDragged(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const el = scrollContainerRef.current;
    if (!el) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.4;
    el.scrollLeft = scrollStart - walk;
    if (Math.abs(walk) > 6) {
      setHasDragged(true);
    }
    checkInfiniteWrap();
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  if (!categories || categories.length === 0) {
    return null;
  }

  return (
    <section id="categories" className="py-16 sm:py-20 bg-[#FAF6EB] overflow-hidden select-none">
      {/* Section Header with Controls (Centered Container) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8D7B5]/40 border border-[#B88A3B]/40 text-[#7A5527] text-xs font-semibold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#B88A3B]" />
              <span>NATURAL • SAFE • EFFECTIVE</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F4D2E] font-bold tracking-tight">
              Our Ayurvedic Products
            </h2>
            <p className="text-sm sm:text-base text-[#30251C]/75 font-normal max-w-xl">
              Natural care for a healthier and happier you. Handcrafted with authentic herbal botanicals.
            </p>
          </div>

          {/* Carousel Navigation Buttons & Play/Pause */}
          <div className="flex items-center justify-center md:justify-end gap-2.5">
            <button
              type="button"
              onClick={() => handleSlide('left')}
              className="p-2.5 sm:p-3 rounded-full bg-white border border-[#E8D7B5] hover:border-[#B88A3B] text-[#1F4D2E] hover:bg-[#1F4D2E] hover:text-white transition-all shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
              aria-label="Previous Category"
              title="Slide Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="px-3.5 py-2.5 rounded-full bg-white border border-[#E8D7B5] hover:border-[#B88A3B] text-[#1F4D2E] hover:bg-[#1F4D2E] hover:text-white transition-all shadow-xs hover:shadow-md active:scale-95 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider cursor-pointer"
              aria-label={isPaused ? 'Resume Auto-Scroll' : 'Pause Auto-Scroll'}
              title={isPaused ? 'Resume Auto-Scroll' : 'Pause Auto-Scroll'}
            >
              {isPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Play</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleSlide('right')}
              className="p-2.5 sm:p-3 rounded-full bg-white border border-[#E8D7B5] hover:border-[#B88A3B] text-[#1F4D2E] hover:bg-[#1F4D2E] hover:text-white transition-all shadow-xs hover:shadow-md active:scale-95 cursor-pointer"
              aria-label="Next Category"
              title="Slide Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Full-Bleed Carousel Track (Edge-to-Edge Full Screen Width, Zero Left/Right Gap) */}
      <div 
        className="w-full relative group/carousel overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => {
          if (!isDragging) setIsPaused(false);
        }}
      >
        {/* Floating Left Arrow */}
        <button
          type="button"
          onClick={() => handleSlide('left')}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8D7B5] hover:border-[#B88A3B] text-[#1F4D2E] hover:bg-[#1F4D2E] hover:text-white shadow-lg hover:shadow-xl transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-110 active:scale-95 cursor-pointer hidden sm:flex items-center justify-center"
          aria-label="Scroll Left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scrollable Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkInfiniteWrap}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar py-4 px-0 cursor-grab active:cursor-grabbing select-none"
          style={{
            scrollBehavior: 'auto',
            WebkitOverflowScrolling: 'touch',
          }}
        >
          {repeatedCategories.map((cat, index) => {
            return (
              <div
                key={`${cat.id}-clone-${index}`}
                onClick={() => {
                  if (!hasDragged) {
                    onSelectCategory(cat.slug);
                  }
                }}
                className="group w-[280px] sm:w-[320px] md:w-[340px] shrink-0 bg-white rounded-2xl overflow-hidden border border-[#E8D7B5]/80 hover:border-[#B88A3B] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                {/* Category Image - Flush Border to Border */}
                <div className="relative aspect-square w-full overflow-hidden bg-[#F1E8D4]">
                  <img
                    src={cat.image_url || '/images/products/hair_oil.jpg'}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                    loading="lazy"
                  />
                </div>

                {/* Content Area with Inner Padding */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
                  {/* Title & Description */}
                  <div className="space-y-1.5 text-center">
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1F4D2E] group-hover:text-[#3F6B35] transition-colors leading-tight">
                      {cat.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#30251C]/75 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  {/* SHOP NOW Button */}
                  <div className="pt-4 mt-3 border-t border-[#E8D7B5]/40 text-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!hasDragged) {
                          onSelectCategory(cat.slug);
                        }
                      }}
                      className="w-full py-2.5 px-4 rounded-full bg-[#1F4D2E] hover:bg-[#173A25] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-xs hover:shadow-md flex items-center justify-center gap-2 group-hover:bg-[#173A25]"
                      id={`cat-shop-${cat.slug}-${index}`}
                    >
                      <span>SHOP NOW</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Floating Right Arrow */}
        <button
          type="button"
          onClick={() => handleSlide('right')}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full bg-white/95 backdrop-blur-md border border-[#E8D7B5] hover:border-[#B88A3B] text-[#1F4D2E] hover:bg-[#1F4D2E] hover:text-white shadow-lg hover:shadow-xl transition-all opacity-0 group-hover/carousel:opacity-100 hover:scale-110 active:scale-95 cursor-pointer hidden sm:flex items-center justify-center"
          aria-label="Scroll Right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Helper Indicator (Centered Container) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center justify-center gap-2 text-xs text-[#7A5527]/70 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#B88A3B] animate-pulse" />
          <span>Infinite Loop Carousel • Drag or use arrows to explore • Hover to pause</span>
        </div>
      </div>
    </section>
  );
};
