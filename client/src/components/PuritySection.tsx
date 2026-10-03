import React from 'react';
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from 'lucide-react';

export const PuritySection: React.FC = () => {
  return (
    <section id="wellness" className="py-16 sm:py-20 bg-[#FAF6EB] relative overflow-hidden border-b border-[#E8D7B5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Brand Story Narrative & Button */}
          <div className="lg:col-span-6 space-y-5 text-center lg:text-left">
            <p className="text-xs font-serif font-bold uppercase tracking-[0.25em] text-[#B88A3B]">
              OUR STORY
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F4D2E] font-bold tracking-tight leading-[1.15]">
              Rooted in Tradition. <br />
              <span>Created for Today.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#30251C]/80 font-normal leading-relaxed max-w-xl">
              At Pure Veda Ayurved, we bring together the timeless knowledge of Ayurveda and modern quality standards to create natural wellness products for today's lifestyle.
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('story');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#1F4D2E] hover:bg-[#173A25] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
              >
                <span>LEARN MORE</span>
                <ArrowRight className="w-4 h-4 text-[#B88A3B]" />
              </button>
            </div>
          </div>

          {/* Right Column: Authentic Spices & Brass Bowls Photography */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#FAF6EB] ring-1 ring-[#B88A3B]/40 aspect-[4/3] bg-[#F1E8D4]">
              <img
                src="/images/tradition_spices.jpg"
                alt="Ayurvedic spices and brass bowls"
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
