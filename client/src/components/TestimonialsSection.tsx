import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote, CheckCircle2, Sparkles } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya S.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      text: '“The hair oil has truly reduced my hair fall and made my hair stronger. Highly recommended!”',
      rating: 5,
    },
    {
      id: 2,
      name: 'Rahul M.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      text: '“The soaps are amazing and feel so natural on the skin. Love the fragrance and quality.”',
      rating: 5,
    },
    {
      id: 3,
      name: 'Anjali K.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      text: '“Pure, natural and effective products. I trust Pure Veda Ayurved for my family\'s wellness.”',
      rating: 5,
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-16 sm:py-20 bg-[#FAF6EB] relative overflow-hidden border-b border-[#E8D7B5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <p className="text-xs font-serif font-bold uppercase tracking-[0.25em] text-[#B88A3B]">
            REAL EXPERIENCES
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F4D2E] font-bold tracking-tight">
            What Our Customers Say
          </h2>
          <p className="text-sm sm:text-base text-[#30251C]/75 font-normal">
            Trusted by many for natural and effective care.
          </p>
        </div>

        {/* Testimonials 3-Cards Row with Left and Right Arrows */}
        <div className="relative max-w-5xl mx-auto px-6 sm:px-12">
          
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev === 0 ? 1 : 0))}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#E8D7B5] bg-white flex items-center justify-center text-[#7A5527] hover:text-[#1F4D2E] hover:border-[#B88A3B] transition-colors shadow-xs"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-6 border border-[#E8D7B5]/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <p className="text-xs sm:text-sm text-[#30251C]/80 leading-relaxed font-normal">
                  {item.text}
                </p>

                <div className="pt-2 border-t border-[#E8D7B5]/40 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-[#B88A3B]/60 bg-[#F1E8D4] shrink-0">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-0.5 text-[#B88A3B]">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-[#B88A3B] text-[#B88A3B]" />
                      ))}
                    </div>
                    <span className="font-serif font-bold text-xs sm:text-sm text-[#1F4D2E] block mt-0.5">
                      — {item.name}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => setActiveIndex((prev) => (prev === 1 ? 0 : 1))}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[#E8D7B5] bg-white flex items-center justify-center text-[#7A5527] hover:text-[#1F4D2E] hover:border-[#B88A3B] transition-colors shadow-xs"
            aria-label="Next review"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Carousel Dots */}
          <div className="flex items-center justify-center gap-2 mt-8">
            <span className="w-2 h-2 rounded-full bg-[#1F4D2E]" />
            <span className="w-2 h-2 rounded-full bg-[#E8D7B5]" />
          </div>

        </div>

      </div>
    </section>
  );
};

