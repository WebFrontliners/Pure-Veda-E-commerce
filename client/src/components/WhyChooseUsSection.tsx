import React from 'react';
import { Scroll, Leaf, ShieldCheck, BookOpen, Sun, Sparkles } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const features = [
    {
      icon: Scroll,
      title: 'Authentic Ayurvedic Formulas',
      desc: 'Faithfully prepared following canonical Charaka & Sushruta Samhita procedures with zero compromises.',
    },
    {
      icon: Leaf,
      title: 'Pure & Natural Ingredients',
      desc: 'Wild-harvested medicinal plants, cold-pressed seed oils, and Grade-A Kashmiri & Himalayan botanicals.',
    },
    {
      icon: ShieldCheck,
      title: 'Safe & Effective',
      desc: 'Triple-tested for heavy metals, microbials, and purity in state-of-the-art GMP-certified laboratories.',
    },
    {
      icon: BookOpen,
      title: 'Inspired by Ancient Wisdom',
      desc: 'Harmonising Tridosha (Vata, Pitta, Kapha) balance through time-tested therapeutic synergy.',
    },
    {
      icon: Sun,
      title: 'Created for Everyday Wellness',
      desc: 'Seamlessly integrating holistic Ayurvedic self-care into active modern routines and daily rituals.',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#FAF6EB] border-b border-[#E8D7B5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-2">
          <p className="text-xs font-serif font-bold uppercase tracking-[0.25em] text-[#B88A3B]">
            OUR PROMISE
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1F4D2E] font-bold tracking-tight">
            Why Choose Pure Veda Ayurved?
          </h2>
        </div>

        {/* 5 Circular Badges Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-3 group"
              >
                <div className="w-16 h-16 rounded-full border-2 border-[#B88A3B] bg-[#F1E8D4]/60 group-hover:bg-[#F1E8D4] flex items-center justify-center text-[#1F4D2E] shadow-xs group-hover:scale-105 transition-all">
                  <Icon className="w-7 h-7 text-[#7A5527]" />
                </div>
                <h3 className="font-serif font-bold text-xs sm:text-sm text-[#1F4D2E] leading-snug">
                  {item.title}
                </h3>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
