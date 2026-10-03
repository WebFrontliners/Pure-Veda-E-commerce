import React, { useState } from 'react';
import { Send, CheckCircle2, Sparkles, Mail } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <section className="py-14 sm:py-18 bg-[#F1E8D4] border-b border-[#E8D7B5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
        
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1F4D2E]/10 text-[#1F4D2E] text-xs font-bold uppercase tracking-wider">
          <Mail className="w-3.5 h-3.5 text-[#B88A3B]" />
          <span>Ayurvedic Wisdom in Your Inbox</span>
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1F4D2E] font-bold tracking-tight">
          Join the Pure Veda Wellness Community
        </h2>

        <p className="text-sm sm:text-base text-[#30251C]/80 max-w-xl mx-auto font-normal leading-relaxed">
          Get wellness tips, product updates and special offers delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto pt-2">
          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 bg-[#FAF6EB] border border-[#E8D7B5] rounded-full py-3.5 px-5 text-xs sm:text-sm text-[#30251C] placeholder-[#7A5527]/70 focus:outline-none focus:ring-2 focus:ring-[#1F4D2E] shadow-inner"
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-full bg-[#1F4D2E] hover:bg-[#173A25] text-white font-semibold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all border border-[#B88A3B]/40 shrink-0"
              id="newsletter-subscribe-btn"
            >
              SUBSCRIBE
            </button>
          </div>

          {subscribed && (
            <p className="text-xs font-serif font-bold text-[#1F4D2E] mt-3 flex items-center justify-center gap-1.5 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#3F6B35]" />
              <span>Namaste! You have successfully joined the Pure Veda Wellness Community.</span>
            </p>
          )}
        </form>

      </div>
    </section>
  );
};
