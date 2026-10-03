import React from 'react';
import { Category } from '../types';
import { Sparkles } from 'lucide-react';

interface CategoryPillsProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-3 px-4 sm:px-6 lg:px-8 border-b border-stone-200/80 bg-white/80 backdrop-blur sticky top-20 z-30">
      <div className="flex items-center gap-2 max-w-7xl mx-auto min-w-max">
        <button
          onClick={() => onSelectCategory('all')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
            selectedCategory === 'all'
              ? 'bg-veda-800 text-white shadow-sm ring-2 ring-veda-700/20'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
          }`}
          id="filter-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>All Remedies</span>
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-veda-800 text-white shadow-sm ring-2 ring-veda-700/20'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
              }`}
              id={`filter-${cat.slug}`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
