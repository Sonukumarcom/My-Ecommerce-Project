import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  Filter,
  Search,
  SlidersHorizontal,
  Grid3X3,
  List,
  Star,
  ShoppingBag,
  Check,
  ChevronDown,
  X,

  Sparkles,
  RotateCcw,
} from 'lucide-react';

import {
  Link,
  useSearchParams,
} from 'react-router-dom';

import { useCartStore } from '../../../store/useCartStore';

import {
  productService,
  type Product,
} from '../services/productService';

import { apiClient } from '../../../config/api.config';

import { ProductCard } from '../../../components/products/ProductCard';

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  displayOrder: number;
}

interface CategoryApiResponse {
  success: boolean;
  message: string;
  data: Category[];
}

export const CatalogPage: React.FC = () => {
  /* =========================================================
     URL PARAMS
  ========================================================= */

  const [searchParams, setSearchParams] =
    useSearchParams();

  /* =========================================================
     STATE
  ========================================================= */

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] =
    useState<Category[]>([]);

  const [selectedCategoryId, setSelectedCategoryId] =
    useState<number | null>(null);

  const [searchQuery, setSearchQuery] =
    useState('');

  const [sortBy, setSortBy] = useState<
    'featured' | 'priceLow' | 'priceHigh' | 'rating'
  >('featured');

  const [inStockOnly, setInStockOnly] =
    useState(false);

  const [priceRange, setPriceRange] =
    useState<number>(70000);

  const [mobileFilterOpen, setMobileFilterOpen] =
    useState(false);

  const [viewMode, setViewMode] =
    useState<'grid' | 'list'>('grid');

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState('');

  /* =========================================================
     FORMAT PRICE
  ========================================================= */

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  /* =========================================================
     CART
  ========================================================= */

  const handleAddToCart = (product: Product) => {
    if (product.availableStock <= 0) {
      return;
    }

    const cartState =
      useCartStore.getState();

    const existingItem =
      cartState.items.find(
        (item) =>
          item.productId === product.id
      );

    const currentQuantity =
      existingItem?.quantity ?? 0;

    if (
      currentQuantity >=
      product.availableStock
    ) {
      return;
    }

    cartState.addItem(
      {
        id: product.id,
        productId: product.id,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        price: product.price,
        salePrice: product.salePrice,
        imageUrl:
          product.imageUrls?.[0] ?? '',
        maxStock:
          product.availableStock,
      },
      1
    );
  };

  /* =========================================================
     LOAD CATEGORIES
  ========================================================= */

  useEffect(() => {
    const fetchCategories =
      async () => {
        try {
          const response =
            await apiClient.get<CategoryApiResponse>(
              '/categories'
            );

          if (response.data.success) {
            setCategories(
              response.data.data
            );
          }
        } catch (error) {
          console.error(
            'Failed to load categories:',
            error
          );
        }
      };

    fetchCategories();
  }, []);

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

  useEffect(() => {
    const fetchProducts =
      async () => {
        setLoading(true);
        setErrorMessage('');

        try {
          const response =
            await productService.getProducts({
              page: 0,
              size: 100,
            });

          if (response.success) {
            setProducts(
              response.data.content
            );
          } else {
            setProducts([]);
          }
        } catch (error) {
          console.error(
            'Failed to load products:',
            error
          );

          setProducts([]);

          setErrorMessage(
            'Unable to load products. Please try again.'
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProducts();
  }, []);

  /* =========================================================
     APPLY URL PARAMS
  ========================================================= */

  useEffect(() => {
    const urlSearch =
      searchParams.get('search');

    const urlCategory =
      searchParams.get('category');

    if (urlSearch !== null) {
      setSearchQuery(urlSearch);
    }

    if (
      urlCategory &&
      categories.length > 0
    ) {
      const matchedCategory =
        categories.find(
          (category) =>
            category.slug ===
              urlCategory ||
            category.name
              .toLowerCase()
              .replace(/\s+/g, '-') ===
              urlCategory
        );

      setSelectedCategoryId(
        matchedCategory?.id ?? null
      );
    }
  }, [searchParams, categories]);

  /* =========================================================
     SELECTED CATEGORY
  ========================================================= */

  const selectedCategory =
    useMemo(() => {
      if (
        selectedCategoryId === null
      ) {
        return null;
      }

      return (
        categories.find(
          (category) =>
            category.id ===
            selectedCategoryId
        ) ?? null
      );
    }, [
      categories,
      selectedCategoryId,
    ]);

  /* =========================================================
     FILTER + SEARCH + SORT
  ========================================================= */

  const filteredProducts =
    useMemo(() => {
      const query =
        searchQuery
          .trim()
          .toLowerCase();

      return [...products]
        .filter((product) => {
          const categoryMatch =
            selectedCategoryId ===
              null ||
            categories.some(
              (category) =>
                category.id ===
                  selectedCategoryId &&
                category.name ===
                  product.categoryName
            );

          const searchMatch =
            !query ||
            product.name
              .toLowerCase()
              .includes(query) ||
            product.sku
              .toLowerCase()
              .includes(query) ||
            product.categoryName
              .toLowerCase()
              .includes(query);

          const currentPrice =
            product.salePrice &&
            product.salePrice > 0
              ? product.salePrice
              : product.price;

          const priceMatch =
            currentPrice <= priceRange;

          const stockMatch =
            !inStockOnly ||
            product.availableStock > 0;

          return (
            categoryMatch &&
            searchMatch &&
            priceMatch &&
            stockMatch
          );
        })
        .sort((a, b) => {
          const priceA =
            a.salePrice &&
            a.salePrice > 0
              ? a.salePrice
              : a.price;

          const priceB =
            b.salePrice &&
            b.salePrice > 0
              ? b.salePrice
              : b.price;

          if (sortBy === 'priceLow') {
            return priceA - priceB;
          }

          if (sortBy === 'priceHigh') {
            return priceB - priceA;
          }

          if (sortBy === 'rating') {
            return (
              (b.averageRating ?? 0) -
              (a.averageRating ?? 0)
            );
          }

          return 0;
        });
    }, [
      products,
      categories,
      selectedCategoryId,
      searchQuery,
      priceRange,
      inStockOnly,
      sortBy,
    ]);

  /* =========================================================
     ACTIVE FILTER COUNT
  ========================================================= */

  const activeFilterCount =
    Number(
      selectedCategoryId !== null
    ) +
    Number(searchQuery.trim() !== '') +
    Number(inStockOnly) +
    Number(priceRange < 70000);

  /* =========================================================
     RESET FILTERS
  ========================================================= */

  const resetFilters = () => {
    setSelectedCategoryId(null);
    setSearchQuery('');
    setPriceRange(70000);
    setInStockOnly(false);
    setSortBy('featured');

    setSearchParams({});
  };

  /* =========================================================
     CATEGORY SELECT
  ========================================================= */

  const handleCategoryChange = (
    categoryId: number | null
  ) => {
    setSelectedCategoryId(
      categoryId
    );

    const newParams =
      new URLSearchParams(
        searchParams
      );

    newParams.delete('category');

    if (categoryId !== null) {
      const category =
        categories.find(
          (item) =>
            item.id === categoryId
        );

      if (category) {
        newParams.set(
          'category',
          category.slug
        );
      }
    }

    setSearchParams(newParams);
  };

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchChange = (
    value: string
  ) => {
    setSearchQuery(value);

    const newParams =
      new URLSearchParams(
        searchParams
      );

    if (value.trim()) {
      newParams.set(
        'search',
        value.trim()
      );
    } else {
      newParams.delete('search');
    }

    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      {/* =====================================================
          PREMIUM HEADER
      ====================================================== */}

      <section className="relative overflow-hidden border-b border-gray-100 bg-white">

        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />

        <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-violet-100/40 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                <Sparkles className="h-3.5 w-3.5" />
                AuraStore Collection
              </div>

              <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                Explore Our{' '}
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  Collection
                </span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Discover carefully selected products
                across electronics, fashion, home,
                beauty and more.
              </p>
            </div>

            <div className="flex items-center gap-3">

              <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Products
                </p>

                <p className="mt-0.5 text-lg font-extrabold text-gray-900">
                  {products.length}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Showing
                </p>

                <p className="mt-0.5 text-lg font-extrabold text-indigo-600">
                  {filteredProducts.length}
                </p>
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 pt-7 sm:px-6 lg:px-8">

        <div className="flex flex-col gap-7 lg:flex-row">

          {/* =================================================
              DESKTOP FILTER
          ================================================== */}

          <aside className="hidden w-56 shrink-0 lg:block">

            <div className="sticky top-24 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

              {/* Filter header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">

                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50">
                    <Filter className="h-4 w-4 text-indigo-600" />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Filters
                    </h3>

                    {activeFilterCount > 0 && (
                      <p className="text-[10px] text-indigo-500">
                        {activeFilterCount}{' '}
                        active
                      </p>
                    )}
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Reset
                  </button>
                )}

              </div>

              <div className="space-y-6 p-5">

                {/* Categories */}
                <div>

                  <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    Categories
                  </label>

                  <div className="space-y-1">

                    <button
                      type="button"
                      onClick={() =>
                        handleCategoryChange(
                          null
                        )
                      }
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                        selectedCategoryId ===
                        null
                          ? 'bg-indigo-50 font-semibold text-indigo-700 shadow-sm'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span>
                        All Products
                      </span>

                      {selectedCategoryId ===
                        null && (
                        <Check className="h-4 w-4" />
                      )}
                    </button>

                    {categories.map(
                      (category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() =>
                            handleCategoryChange(
                              category.id
                            )
                          }
                          className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-all ${
                            selectedCategoryId ===
                            category.id
                              ? 'bg-indigo-50 font-semibold text-indigo-700 shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span>
                            {category.name}
                          </span>

                          {selectedCategoryId ===
                            category.id && (
                            <Check className="h-4 w-4" />
                          )}
                        </button>
                      )
                    )}

                  </div>

                </div>

                {/* Price */}
                <div className="border-t border-gray-100 pt-5">

                  <div className="mb-3 flex items-center justify-between">

                    <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
                      Max Price
                    </label>

                    <span className="rounded-lg bg-gray-50 px-2 py-1 text-xs font-bold text-gray-900">
                      {formatPrice(
                        priceRange
                      )}
                    </span>

                  </div>

                  <input
                    type="range"
                    min="500"
                    max="70000"
                    step="500"
                    value={priceRange}
                    onChange={(e) =>
                      setPriceRange(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="w-full cursor-pointer accent-indigo-600"
                  />

                  <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                    <span>₹500</span>
                    <span>₹70,000</span>
                  </div>

                </div>

                {/* Stock */}
                <div className="border-t border-gray-100 pt-5">

                  <label className="flex cursor-pointer select-none items-center gap-3">

                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) =>
                        setInStockOnly(
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />

                    <span className="text-sm font-medium text-gray-700">
                      In Stock Only
                    </span>

                  </label>

                </div>

              </div>

            </div>

          </aside>

          {/* =================================================
              PRODUCTS
          ================================================== */}

          <main className="min-w-0 flex-1">

            {/* Toolbar */}
            <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm sm:p-4">

              <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

                {/* Search */}
                <div className="relative w-full xl:max-w-md">

                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Search products, SKU or category..."
                    value={searchQuery}
                    onChange={(e) =>
                      handleSearchChange(
                        e.target.value
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() =>
                        handleSearchChange(
                          ''
                        )
                      }
                      className="absolute right-3 top-2.5 rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                </div>

                {/* Controls */}
                <div className="flex w-full items-center justify-between gap-2 xl:w-auto">

                  <button
                    type="button"
                    onClick={() =>
                      setMobileFilterOpen(
                        true
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2.5 text-xs font-bold text-gray-700 transition-colors hover:bg-gray-50 lg:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4 text-indigo-600" />
                    Filters

                    {activeFilterCount >
                      0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] text-white">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  <div className="relative">

                    <select
                      value={sortBy}
                      onChange={(e) =>
                        setSortBy(
                          e.target.value as
                            | 'featured'
                            | 'priceLow'
                            | 'priceHigh'
                            | 'rating'
                        )
                      }
                      className="appearance-none rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-3 pr-9 text-xs font-bold text-gray-700 outline-none transition-all focus:border-indigo-500 focus:bg-white"
                    >
                      <option value="featured">
                        Featured First
                      </option>

                      <option value="priceLow">
                        Price: Low to High
                      </option>

                      <option value="priceHigh">
                        Price: High to Low
                      </option>

                      <option value="rating">
                        Highest Rated
                      </option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-2.5 top-3 h-3.5 w-3.5 text-gray-400" />

                  </div>

                  <div className="hidden items-center rounded-xl border border-gray-200 bg-gray-100 p-1 sm:flex">

                    <button
                      type="button"
                      onClick={() =>
                        setViewMode(
                          'grid'
                        )
                      }
                      className={`rounded-lg p-2 transition-all ${
                        viewMode ===
                        'grid'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                      aria-label="Grid view"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setViewMode(
                          'list'
                        )
                      }
                      className={`rounded-lg p-2 transition-all ${
                        viewMode ===
                        'list'
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                      aria-label="List view"
                    >
                      <List className="h-4 w-4" />
                    </button>

                  </div>

                </div>

              </div>

              {/* Active filters */}
              {(selectedCategory ||
                searchQuery ||
                priceRange < 70000 ||
                inStockOnly) && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-gray-100 pt-3">

                  <span className="text-[11px] font-semibold text-gray-400">
                    Active:
                  </span>

                  {selectedCategory && (
                    <button
                      type="button"
                      onClick={() =>
                        handleCategoryChange(
                          null
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700"
                    >
                      {selectedCategory.name}
                      <X className="h-3 w-3" />
                    </button>
                  )}

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() =>
                        handleSearchChange(
                          ''
                        )
                      }
                      className="inline-flex max-w-[220px] items-center gap-1.5 truncate rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700"
                    >
                      Search: {searchQuery}
                      <X className="h-3 w-3 shrink-0" />
                    </button>
                  )}

                  {priceRange <
                    70000 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPriceRange(
                          70000
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-[11px] font-semibold text-gray-700"
                    >
                      Up to{' '}
                      {formatPrice(
                        priceRange
                      )}
                      <X className="h-3 w-3" />
                    </button>
                  )}

                  {inStockOnly && (
                    <button
                      type="button"
                      onClick={() =>
                        setInStockOnly(
                          false
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700"
                    >
                      In Stock
                      <X className="h-3 w-3" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-500 hover:text-indigo-600"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Clear all
                  </button>

                </div>
              )}

            </div>

            {/* Result bar */}
            <div className="flex items-center justify-between px-1 py-4">

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {filteredProducts.length}{' '}
                  {filteredProducts.length ===
                  1
                    ? 'product'
                    : 'products'}
                </p>

                <p className="text-xs text-gray-400">
                  Curated for you
                </p>
              </div>

              {selectedCategory && (
                <div className="hidden rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 sm:block">
                  {selectedCategory.name}
                </div>
              )}

            </div>

            {/* Error */}
            {errorMessage && (
              <div className="mb-6 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {Array.from({
                  length: 6,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
                  >

                    <div className="aspect-square animate-pulse bg-gray-100" />

                    <div className="space-y-3 p-5">
                      <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
                      <div className="h-5 w-3/4 animate-pulse rounded bg-gray-100" />
                      <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                      <div className="h-6 w-28 animate-pulse rounded bg-gray-100" />
                    </div>

                  </div>
                ))}

              </div>
            ) : filteredProducts.length ===
              0 ? (

              /* Empty */
              <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gray-50">
                  <ShoppingBag className="h-9 w-9 text-gray-300" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-gray-900">
                  No products found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Try changing your search,
                  category, price or stock
                  filters to discover more
                  products.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset Filters
                </button>

              </div>

            ) : viewMode === 'grid' ? (

              /* =================================================
                 GRID
              ================================================== */

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  )
                )}

              </div>

            ) : (

              /* =================================================
                 LIST
              ================================================== */

              <div className="space-y-4">

                {filteredProducts.map(
                  (product) => {
                    const isOutOfStock =
                      product.availableStock <=
                      0;

                    const currentPrice =
                      product.salePrice &&
                      product.salePrice > 0
                        ? product.salePrice
                        : product.price;

                    const hasSale =
                      product.salePrice !==
                        null &&
                      product.salePrice > 0 &&
                      product.salePrice <
                        product.price;

                    return (
                      <div
                        key={product.id}
                        className="group overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-5"
                      >

                        <div className="flex flex-col gap-5 sm:flex-row">

                          {/* Image */}
                          <Link
                            to={`/product/${product.slug}`}
                            className="relative shrink-0 overflow-hidden rounded-xl"
                          >

                            {product.imageUrls?.[0] ? (
                              <img
                                src={
                                  product.imageUrls[0]
                                }
                                alt={
                                  product.name
                                }
                                className="h-40 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-36 sm:w-36"
                              />
                            ) : (
                              <div className="flex h-40 w-full items-center justify-center rounded-xl bg-gray-50 sm:h-36 sm:w-36">
                                <ShoppingBag className="h-9 w-9 text-gray-300" />
                              </div>
                            )}

                            {hasSale && (
                              <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
                                {Math.round(
                                  ((product.price -
                                    product.salePrice!) /
                                    product.price) *
                                    100
                                )}
                                % OFF
                              </span>
                            )}

                          </Link>

                          {/* Info */}
                          <div className="min-w-0 flex-1">

                            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-500">
                              {product.categoryName}
                            </span>

                            <Link
                              to={`/product/${product.slug}`}
                            >
                              <h3 className="mt-1 text-base font-bold text-gray-900 transition-colors hover:text-indigo-600 sm:text-lg">
                                {product.name}
                              </h3>
                            </Link>

                            <p className="mt-1 line-clamp-2 text-sm leading-6 text-gray-500">
                              {
                                product.shortDescription
                              }
                            </p>

                            <div className="mt-3 flex items-center gap-2">

                              <div className="flex items-center gap-0.5">
                                {Array.from({
                                  length: 5,
                                }).map(
                                  (_, index) => (
                                    <Star
                                      key={
                                        index
                                      }
                                      className={`h-3.5 w-3.5 ${
                                        index <
                                        Math.round(
                                          product.averageRating ??
                                            0
                                        )
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-gray-200'
                                      }`}
                                    />
                                  )
                                )}
                              </div>

                              <span className="text-xs font-bold text-gray-700">
                                {(
                                  product.averageRating ??
                                  0
                                ).toFixed(1)}
                              </span>

                              <span className="text-xs text-gray-400">
                                (
                                {product.reviewCount ??
                                  0}{' '}
                                reviews)
                              </span>

                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-3">

                              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                                {formatPrice(
                                  currentPrice
                                )}
                              </span>

                              {hasSale && (
                                <span className="text-sm text-gray-400 line-through">
                                  {formatPrice(
                                    product.price
                                  )}
                                </span>
                              )}

                              {!isOutOfStock && (
                                <span
                                  className={`text-xs font-semibold ${
                                    product.availableStock <=
                                    5
                                      ? 'text-orange-600'
                                      : 'text-emerald-600'
                                  }`}
                                >
                                  {product.availableStock <=
                                  5
                                    ? `Only ${product.availableStock} left`
                                    : 'In Stock'}
                                </span>
                              )}

                            </div>

                          </div>

                          {/* Actions */}
                          <div className="flex shrink-0 flex-row items-center gap-2 sm:flex-col sm:items-stretch sm:justify-center">

                            <Link
                              to={`/product/${product.slug}`}
                              className="rounded-xl bg-indigo-50 px-4 py-2.5 text-center text-xs font-bold text-indigo-700 transition-colors hover:bg-indigo-100"
                            >
                              View Details
                            </Link>

                            <button
                              type="button"
                              disabled={
                                isOutOfStock
                              }
                              onClick={() =>
                                handleAddToCart(
                                  product
                                )
                              }
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <ShoppingBag className="h-3.5 w-3.5" />
                              Add to Bag
                            </button>

                          </div>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>
            )}

          </main>
        </div>
      </div>

      {/* =====================================================
          MOBILE FILTER DRAWER
      ====================================================== */}

      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">

          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() =>
              setMobileFilterOpen(false)
            }
          />

          {/* Drawer */}
          <div className="absolute bottom-0 left-0 top-0 w-80 max-w-[88%] overflow-y-auto bg-white shadow-2xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white/95 px-5 py-4 backdrop-blur">

              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Filters
                </h3>

                <p className="text-xs text-gray-400">
                  Refine your products
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileFilterOpen(
                    false
                  )
                }
                className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="space-y-7 p-5">

              {/* Categories */}
              <div>

                <label className="mb-3 block text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
                  Categories
                </label>

                <div className="space-y-1">

                  <button
                    type="button"
                    onClick={() =>
                      handleCategoryChange(
                        null
                      )
                    }
                    className={`w-full rounded-xl px-3 py-2.5 text-left text-sm ${
                      selectedCategoryId ===
                      null
                        ? 'bg-indigo-50 font-semibold text-indigo-700'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    All Products
                  </button>

                  {categories.map(
                    (category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() =>
                          handleCategoryChange(
                            category.id
                          )
                        }
                        className={`w-full rounded-xl px-3 py-2.5 text-left text-sm ${
                          selectedCategoryId ===
                          category.id
                            ? 'bg-indigo-50 font-semibold text-indigo-700'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {category.name}
                      </button>
                    )
                  )}

                </div>

              </div>

              {/* Price */}
              <div>

                <div className="mb-3 flex items-center justify-between">

                  <label className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
                    Max Price
                  </label>

                  <span className="text-sm font-bold text-gray-900">
                    {formatPrice(
                      priceRange
                    )}
                  </span>

                </div>

                <input
                  type="range"
                  min="500"
                  max="70000"
                  step="500"
                  value={priceRange}
                  onChange={(e) =>
                    setPriceRange(
                      Number(
                        e.target.value
                      )
                    )
                  }
                  className="w-full accent-indigo-600"
                />

                <div className="mt-1 flex justify-between text-[10px] text-gray-400">
                  <span>₹500</span>
                  <span>₹70,000</span>
                </div>

              </div>

              {/* Stock */}
              <label className="flex cursor-pointer items-center gap-3">

                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) =>
                    setInStockOnly(
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600"
                />

                <span className="text-sm font-medium text-gray-700">
                  In Stock Only
                </span>

              </label>

              {/* Buttons */}
              <div className="space-y-2">

                <button
                  type="button"
                  onClick={() =>
                    setMobileFilterOpen(
                      false
                    )
                  }
                  className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700"
                >
                  Apply Filters
                </button>

                {activeFilterCount >
                  0 && (
                  <button
                    type="button"
                    onClick={() => {
                      resetFilters();
                      setMobileFilterOpen(
                        false
                      );
                    }}
                    className="w-full rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    Clear All
                  </button>
                )}

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};