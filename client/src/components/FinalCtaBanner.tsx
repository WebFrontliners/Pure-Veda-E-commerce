import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

interface FinalCtaBannerProps {
  onShopAll: () => void;
}

export const FinalCtaBanner: React.FC<FinalCtaBannerProps> = ({ onShopAll }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <section className="bg-[#173A25] text-[#FAF6EB] py-12 sm:py-16 border-b border-[#B88A3B]/40 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Hands Sprout Image + Headlines + Shop Button */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shadow-lg border-2 border-[#B88A3B]/50 shrink-0 bg-[#30251C]">
              <img
                src="/images/hands_sprout.jpg"
                alt="Ayurvedic Wellness Seedling"
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FAF6EB] leading-tight">
                Wellness Today <br className="hidden sm:inline" />
                for a Brighter Tomorrow
              </h2>
              <p className="text-xs sm:text-sm text-[#F1E8D4]/80 max-w-sm">
                Choose Pure Veda Ayurved and embrace a natural approach to everyday wellness.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={onShopAll}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#B88A3B] hover:bg-[#a37930] text-[#1F4D2E] font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg"
                  id="final-cta-shop-btn"
                >
                  <span>SHOP ALL PRODUCTS</span>
                  <ArrowRight className="w-4 h-4 text-[#1F4D2E]" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Side: Join Community & Email Subscription */}
          <div className="lg:col-span-6 lg:border-l lg:border-[#B88A3B]/30 lg:pl-10 space-y-3 text-center sm:text-left">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FAF6EB]">
              Join the Pure Veda Wellness Community
            </h3>
            <p className="text-xs sm:text-sm text-[#F1E8D4]/80 max-w-md">
              Get wellness tips, product updates and special offers delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="pt-2 max-w-md mx-auto sm:mx-0">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 bg-white text-[#30251C] rounded-full sm:rounded-l-full sm:rounded-r-none px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#B88A3B]"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full sm:rounded-r-full sm:rounded-l-none bg-[#B88A3B] hover:bg-[#a37930] text-[#1F4D2E] font-bold text-xs uppercase tracking-wider transition-all shrink-0"
                  id="newsletter-subscribe-btn"
                >
                  SUBSCRIBE
                </button>
              </div>

              {subscribed && (
                <p className="text-xs font-serif font-bold text-[#B88A3B] mt-2 flex items-center justify-center sm:justify-start gap-1.5 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#789447]" />
                  <span>Thank you for joining our Ayurvedic wellness circle!</span>
                </p>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

