import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCategoriesSection } from './components/ProductCategoriesSection';
import { BrandStorySection } from './components/BrandStorySection';
import { BestSellersSection } from './components/BestSellersSection';
import { BecomeDealerSection } from './components/BecomeDealerSection';
import { WhyChooseUsSection } from './components/WhyChooseUsSection';
import { PuritySection } from './components/PuritySection';
import { FinalCtaBanner } from './components/FinalCtaBanner';
import { NewsletterSection } from './components/NewsletterSection';
import { Footer } from './components/Footer';
import { OurProductsPage } from './components/OurProductsPage';

import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AccountModal } from './components/AccountModal';
import { InfoModal } from './components/InfoModal';
import { AdminPanel } from './components/AdminPanel';

import { Category, Product, FilterState } from './types';
import { fetchCategories, fetchProducts } from './services/api';
import { useCartStore } from './store/useCartStore';

export const App: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Page View routing state: 'home' | 'products'
  const [currentView, setCurrentView] = useState<'home' | 'products'>('home');
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all');

  // Modals & Navigation state
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'about' | 'wellness' | 'contact' | 'policy' | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => window.location.hash === '#admin');

  const setQuickViewProduct = useCartStore((state) => state.setQuickViewProduct);

  // Handle URL hash changes (e.g. #admin, #products)
  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminOpen(window.location.hash === '#admin');
      if (window.location.hash === '#products') {
        setCurrentView('products');
      } else if (window.location.hash === '' || window.location.hash === '#home') {
        setCurrentView('home');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Fetch Categories & Products from API
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error('Failed to load catalog data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (currentView !== 'home') {
      setCurrentView('home');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (slug: string) => {
    setSelectedProductCategory(slug);
    setCurrentView('products');
    window.location.hash = 'products';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredProducts = products.filter((p) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term) ||
      p.category_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF6EB] text-[#30251C] font-sans antialiased selection:bg-[#E8D7B5] selection:text-[#1F4D2E]">
      
      {/* 1. Header with Warm Ivory #FAF6EB background */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.location.hash = 'admin';
        }}
        onOpenDealer={() => scrollToSection('dealer')}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenInfo={(type) => setInfoModalType(type)}
        onNavigateSection={scrollToSection}
        currentView={currentView}
        onNavigateView={(view) => {
          setCurrentView(view);
          window.location.hash = view === 'home' ? 'home' : 'products';
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      <main className="flex-1">
        {currentView === 'products' ? (
          /* ========================================================== */
          /* DEDICATED OUR PRODUCTS PAGE                                 */
          /* ========================================================== */
          <OurProductsPage
            categories={categories}
            products={products}
            initialCategory={selectedProductCategory}
            onNavigateHome={() => {
              setCurrentView('home');
              window.location.hash = 'home';
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onQuickView={(product) => setQuickViewProduct(product)}
          />
        ) : (
          /* ========================================================== */
          /* HOMEPAGE SECTIONS                                          */
          /* ========================================================== */
          <>
            {/* 2. Hero Section */}
            <HeroBanner
              onShopClick={() => {
                setSelectedProductCategory('all');
                setCurrentView('products');
                window.location.hash = 'products';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onStoryClick={() => scrollToSection('story')}
            />

            {/* 3. Product Category Carousel Section */}
            <ProductCategoriesSection
              categories={categories}
              onSelectCategory={handleSelectCategory}
              onQuickView={(slug) => {
                const p = products.find((item) => item.slug === slug);
                if (p) setQuickViewProduct(p);
              }}
            />

            {/* 4. Ayurveda Brand Story Section */}
            <BrandStorySection
              onExploreProducts={() => {
                setSelectedProductCategory('all');
                setCurrentView('products');
                window.location.hash = 'products';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* 5. Best Sellers Section */}
            <BestSellersSection
              products={filteredProducts.length > 0 ? filteredProducts : products}
              onQuickView={(product) => setQuickViewProduct(product)}
            />

            {/* 6. Become a Dealer Section with Partnership Form */}
            <BecomeDealerSection
              onOpenEnquiryModal={() => scrollToSection('dealer-form')}
            />

            {/* 7. Why Choose Us Section */}
            <WhyChooseUsSection />

            {/* 8. About / Purity Section ("Rooted in Tradition. Created for Today.") */}
            <PuritySection />

            {/* 9. Final Full-Width CTA Banner with Community Signup */}
            <FinalCtaBanner
              onShopAll={() => {
                setSelectedProductCategory('all');
                setCurrentView('products');
                window.location.hash = 'products';
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </main>

      {/* 12. Footer in Dark Green #173A25 */}
      <Footer
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          window.location.hash = 'admin';
        }}
        onOpenDealer={() => scrollToSection('dealer')}
        onNavigateSection={(sectionId) => {
          if (sectionId === 'categories' || sectionId === 'products') {
            setSelectedProductCategory('all');
            setCurrentView('products');
            window.location.hash = 'products';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else if (sectionId === 'home') {
            setCurrentView('home');
            window.location.hash = 'home';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            if (currentView === 'products') {
              setCurrentView('home');
              setTimeout(() => scrollToSection(sectionId), 150);
            } else {
              scrollToSection(sectionId);
            }
          }
        }}
        onOpenInfo={(type) => setInfoModalType(type)}
      />

      {/* 13. Interactive Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <CheckoutModal />
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        products={products}
      />
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
      />
      <InfoModal
        type={infoModalType}
        onClose={() => setInfoModalType(null)}
      />

      {/* 14. Operations Staff Portal */}
      {isAdminOpen && (
        <AdminPanel
          categories={categories}
          products={products}
          onClose={() => {
            setIsAdminOpen(false);
            if (window.location.hash === '#admin') {
              history.pushState('', document.title, window.location.pathname + window.location.search);
            }
          }}
          onRefreshCatalog={async () => {
            try {
              const data = await fetchProducts();
              setProducts(data);
            } catch (err) {
              console.error('Failed to reload products', err);
            }
          }}
        />
      )}

    </div>
  );
};

export default App;
