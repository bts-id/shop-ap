import React, { useState } from "react";

const ProductCard = ({ product, index }) => {
  const [imgError, setImgError] = useState(false);

  const getImage = () => {
    if (imgError) return `https://placehold.co/400x300/1A1A2E/F5F0E8?text=${encodeURIComponent(product.title?.[0] || "?")}`;
    const img = Array.isArray(product.images) ? product.images[0] : product.images;
    if (!img) return `https://placehold.co/400x300/1A1A2E/F5F0E8?text=${encodeURIComponent(product.title?.[0] || "?")}`;
    // Clean up malformed image URLs from the API
    try {
      const cleaned = img.replace(/[\[\]"]/g, "").trim();
      new URL(cleaned);
      return cleaned;
    } catch {
      return `https://placehold.co/400x300/1A1A2E/F5F0E8?text=${encodeURIComponent(product.title?.[0] || "?")}`;
    }
  };

  return (
    <div
      className="card-product animate-fade-up"
      style={{ animationDelay: `${(index % 8) * 0.07}s`, opacity: 0 }}
    >
      {/* Image container */}
      <div className="relative overflow-hidden aspect-[4/3] bg-ink/5">
        <img
          src={getImage()}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={() => setImgError(true)}
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3 bg-ink text-cream px-2 py-1">
          <span className="font-mono text-xs uppercase tracking-widest">
            {product.category?.name || "General"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-semibold text-ink text-lg leading-tight line-clamp-2 mb-3 group-hover:text-vermillion transition-colors duration-300">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xl font-medium text-ink">
            ${Number(product.price).toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </span>
          <div className="w-8 h-8 bg-cream border border-ink/10 flex items-center justify-center group-hover:bg-vermillion group-hover:border-vermillion transition-all duration-300">
            <svg className="w-4 h-4 text-ink group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductCardSkeleton = () => (
  <div className="bg-white border border-ink/5 overflow-hidden">
    <div className="aspect-[4/3] shimmer" />
    <div className="p-5 space-y-3">
      <div className="h-4 shimmer rounded w-3/4" />
      <div className="h-4 shimmer rounded w-1/2" />
      <div className="flex justify-between items-center mt-4">
        <div className="h-6 shimmer rounded w-1/4" />
        <div className="w-8 h-8 shimmer rounded" />
      </div>
    </div>
  </div>
);

export default ProductCard;
