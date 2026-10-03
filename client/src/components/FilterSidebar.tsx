import React from 'react';
import { Filter, SlidersHorizontal, RotateCcw, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { Category, FilterState } from '../types';

interface FilterSidebarProps {
  categories: Category[];
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  totalProducts: number;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  totalProducts,
}) => {
  return (
    <aside className="w-full bg-white rounded-2xl border border-stone-200/90 p-5 shadow-soft space-y-6">
      
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-veda-800" />
          <h2 className="font-serif text-lg font-bold text-stone-900">Refine Search</h2>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-stone-500 hover:text-veda-800 flex items-center gap-1 font-medium transition-colors"
          title="Reset all filters"
          id="reset-filters-btn"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Sorting */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
          Sort Formulations
        </label>
        <select
          value={filters.sort}
          onChange={(e) => onFilterChange({ sort: e.target.value })}
          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-veda-600 cursor-pointer"
          id="sort-select"
        >
          <option value="newest">Newest Arrivals</option>
          <option value="rating">Highest Rated ★</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
          Remedy Categories
        </label>
        <div className="space-y-1">
          <button
            onClick={() => onFilterChange({ category: 'all' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
              filters.category === 'all'
                ? 'bg-veda-800 text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
            }`}
          >
            <span>All Formulations</span>
            {filters.category === 'all' && <Check className="w-3.5 h-3.5" />}
          </button>
          
          {categories.map((cat) => {
            const isActive = filters.category === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => onFilterChange({ category: cat.slug })}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-veda-800 text-white font-semibold'
                    : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                }`}
              >
                <span>{cat.name}</span>
                {isActive && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3 pt-2 border-t border-stone-100">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Max Price ($)
          </label>
          <span className="text-xs font-bold text-veda-900 px-2 py-0.5 bg-veda-50 rounded-md">
            ${filters.maxPrice || 100}
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={filters.maxPrice || 100}
          onChange={(e) => onFilterChange({ maxPrice: parseFloat(e.target.value) })}
          className="w-full accent-veda-700 cursor-pointer"
          id="price-range-slider"
        />
        <div className="flex justify-between text-[11px] text-stone-400 font-medium">
          <span>$10</span>
          <span>$50</span>
          <span>$100</span>
        </div>
      </div>

      {/* Trust & Purity Box */}
      <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/80 text-xs text-stone-600 space-y-2">
        <div className="flex items-center gap-1.5 text-veda-800 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>The Pure Veda Standard</span>
        </div>
        <p className="text-[11px] leading-relaxed text-stone-500">
          Every batch is tested for heavy metals, microbial purity, and active botanical compounds. 100% vegetarian & non-irradiated.
        </p>
      </div>

      {/* Product count */}
      <div className="text-center pt-2">
        <span className="text-[11px] text-stone-400">
          Showing <strong className="text-stone-700">{totalProducts}</strong> classical remedies
        </span>
      </div>

    </aside>
  );
};
