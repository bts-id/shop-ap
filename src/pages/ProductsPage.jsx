import React, { useState, useEffect, useCallback } from "react";
import ProductCard, { ProductCardSkeleton } from "../components/ProductCard";

const LIMIT = 8;

const ProductsPage = ({ newProducts = [] }) => {
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchMode, setSearchMode] = useState(false);

  const fetchProducts = useCallback(async (pageNum) => {
    setLoading(true);
    try {
      const offset = (pageNum - 1) * LIMIT;
      const res = await fetch(
        `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${LIMIT}`
      );
      const data = await res.json();
      setProducts(data);

      // Get total count
      const allRes = await fetch(`https://api.escuelajs.co/api/v1/products?limit=0`);
      // The API doesn't return total in header easily, fetch a large batch for count
      const countRes = await fetch(`https://api.escuelajs.co/api/v1/products?limit=200`);
      const countData = await countRes.json();
      setTotal(countData.length);
      setAllProducts(countData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  // Merge new products added locally
  const allLocalProducts = [...newProducts, ...allProducts];

  // Filter by search
  const filtered = search.trim()
    ? allLocalProducts.filter((p) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const displayProducts = filtered
    ? filtered.slice((page - 1) * LIMIT, page * LIMIT)
    : [...newProducts.slice(0, newProducts.length), ...products];

  const totalItems = filtered ? filtered.length : total + newProducts.length;
  const totalPages = Math.ceil(totalItems / LIMIT);

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
    setSearchMode(!!e.target.value.trim());
  };

  const handlePage = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-vermillion mb-2">
          Catalogue
        </p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-ink">
            All Products
          </h1>
          <p className="font-body text-ink/40 text-sm">
            {totalItems} items found
          </p>
        </div>
      </div>

      {/* Search bar */}
      <div className="mb-8 relative">
        <div className="flex items-center border-b-2 border-ink/20 focus-within:border-vermillion transition-colors">
          <svg className="w-5 h-5 text-ink/30 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={handleSearch}
            placeholder="Search products by name..."
            className="w-full bg-transparent py-3 font-body text-ink placeholder-ink/30 focus:outline-none text-base"
          />
          {search && (
            <button
              onClick={() => { setSearch(""); setPage(1); setSearchMode(false); }}
              className="text-ink/40 hover:text-vermillion transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        {search && (
          <p className="mt-2 font-body text-xs text-ink/50">
            {filtered?.length || 0} results for "<em>{search}</em>"
          </p>
        )}
      </div>

      {/* New Products Banner */}
      {newProducts.length > 0 && !search && page === 1 && (
        <div className="mb-6 px-4 py-3 bg-sage/10 border border-sage/30 flex items-center gap-2">
          <span className="w-2 h-2 bg-sage rounded-full animate-pulse" />
          <p className="font-mono text-xs uppercase tracking-widest text-sage">
            {newProducts.length} new product{newProducts.length > 1 ? "s" : ""} added this session
          </p>
        </div>
      )}

      {/* Grid */}
      {loading && !searchMode ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(LIMIT)].map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      ) : displayProducts.length === 0 ? (
        <div className="text-center py-24">
          <div className="font-display text-8xl text-ink/10 mb-4">∅</div>
          <p className="font-body text-ink/40 text-lg">No products found</p>
          {search && (
            <button onClick={() => { setSearch(""); setPage(1); }} className="mt-4 btn-secondary text-xs py-2 px-4">
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePage(page - 1)}
            disabled={page === 1}
            className="w-10 h-10 border border-ink/20 flex items-center justify-center text-ink/60 hover:border-ink hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ←
          </button>

          {[...Array(Math.min(totalPages, 7))].map((_, i) => {
            let p;
            if (totalPages <= 7) {
              p = i + 1;
            } else if (page <= 4) {
              p = i + 1;
            } else if (page >= totalPages - 3) {
              p = totalPages - 6 + i;
            } else {
              p = page - 3 + i;
            }

            return (
              <button
                key={p}
                onClick={() => handlePage(p)}
                className={`w-10 h-10 border font-mono text-sm transition-all ${
                  page === p
                    ? "bg-ink text-cream border-ink"
                    : "border-ink/20 text-ink/60 hover:border-ink hover:text-ink"
                }`}
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => handlePage(page + 1)}
            disabled={page === totalPages}
            className="w-10 h-10 border border-ink/20 flex items-center justify-center text-ink/60 hover:border-ink hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
