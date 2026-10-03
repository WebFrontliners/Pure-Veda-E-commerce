import React, { useState } from 'react';
import { Star, ShoppingBag, Eye, Check, AlertCircle } from 'lucide-react';
import { Product } from '../types';
import { useCartStore } from '../store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [addedAnimation, setAddedAnimation] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const setQuickViewProduct = useCartStore((state) => state.setQuickViewProduct);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const isLowStock = product.stock > 0 && product.stock <= 12;
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      onClick={() => setQuickViewProduct(product)}
      className="group relative bg-white rounded-2xl border border-stone-200 hover:border-veda-300 transition-all duration-300 hover:shadow-lift flex flex-col overflow-hidden cursor-pointer"
      id={`product-card-${product.id}`}
    >
      {/* Image Container with fixed aspect ratio to prevent CLS */}
      <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Category Pill Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
          <span className="bg-white/90 backdrop-blur-md text-[10px] uppercase font-bold tracking-wider text-veda-900 px-2.5 py-1 rounded-full shadow-xs border border-white/50">
            {product.category_name || 'Ayurvedic'}
          </span>
          {isLowStock && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
              <AlertCircle className="w-2.5 h-2.5" />
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Rating Badge Overlay */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full shadow-xs flex items-center gap-1 border border-white/50">
          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
          <span className="text-[11px] font-bold text-stone-800">{product.rating.toFixed(1)}</span>
        </div>

        {/* Quick View Button Hover Overlay (Desktop) */}
        <div className="hidden sm:flex absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 items-center justify-center p-4">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="bg-white/95 text-stone-900 hover:bg-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
            id={`quick-view-btn-${product.id}`}
          >
            <Eye className="w-4 h-4 text-veda-800" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-serif font-bold text-base sm:text-lg text-stone-900 line-clamp-1 group-hover:text-veda-800 transition-colors">
            {product.name}
          </h3>
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              Price
            </span>
            <span className="text-lg sm:text-xl font-serif font-bold text-stone-900">
              ${product.price.toFixed(2)}
            </span>
          </div>

          <div className="text-right">
            <span className={`text-[11px] font-semibold ${isOutOfStock ? 'text-rose-600' : 'text-emerald-700'}`}>
              {isOutOfStock ? 'Out of Stock' : 'In Stock'}
            </span>
          </div>
        </div>

        {/* Thumb-friendly Add to Cart Trigger (48px height on mobile touch screens) */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full min-h-[48px] rounded-xl font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-sm ${
            isOutOfStock
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
              : addedAnimation
              ? 'bg-emerald-700 text-white shadow-lift scale-[0.99]'
              : 'bg-stone-900 hover:bg-veda-800 text-white active:scale-95'
          }`}
          id={`add-to-cart-${product.id}`}
          aria-label={`Add ${product.name} to cart`}
        >
          {addedAnimation ? (
            <>
              <Check className="w-4 h-4 animate-scale-check" />
              <span>Added to Bag!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-4 h-4 text-emerald-300" />
              <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
