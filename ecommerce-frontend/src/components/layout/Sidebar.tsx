
import React, { useEffect, useState } from 'react';
import {
  X,
  Smartphone,
  Laptop,
  Shirt,
  Watch,
  Sparkles,
  Home,
  HelpCircle,
  Tag,
  ArrowRight,
  ChevronRight,
  LoaderCircle,
  RefreshCw,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

import { apiClient } from '../../config/api.config';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategorySlug?: string;
  onSelectCategory?: (slug: string) => void;
}

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

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'electronics':
    case 'smartphones':
      return Smartphone;
    case 'fashion':
      return Shirt;
    case 'home-kitchen':
      return Home;
    case 'beauty':
      return Sparkles;
    case 'sports':
    case 'accessories':
      return Watch;
    case 'laptops':
      return Laptop;
    default:
      return Tag;
  }
};

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  selectedCategorySlug = '',
  onSelectCategory,
}) => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    setHasError(false);

    try {
      const response =
        await apiClient.get<CategoryApiResponse>('/categories');

      if (response.data.success && Array.isArray(response.data.data)) {
        setCategories(
          response.data.data
            .filter((category) => category.isActive !== false)
            .sort((a, b) => a.displayOrder - b.displayOrder)
        );
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCategories();
  }, []);

  const handleCategorySelect = (slug: string) => {
    onSelectCategory?.(slug);

    // Keep navigation working even if this sidebar is used
    // without a category-selection callback.
    if (!onSelectCategory) {
      navigate(slug ? `/catalog?category=${encodeURIComponent(slug)}` : '/catalog');
    }

    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const isAllSelected = selectedCategorySlug === '';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[3px] transition-opacity duration-300 lg:hidden"
        />
      )}

      {/* Sidebar drawer */}
      <aside
        aria-label="Product categories sidebar"
        className={`fixed bottom-0 left-0 top-0 z-50 flex w-[min(19rem,88vw)] flex-col border-r border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10 transition-transform duration-300 ease-out lg:sticky lg:top-[68px] lg:z-0 lg:h-[calc(100vh-68px)] lg:w-72 lg:shrink-0 lg:translate-x-0 lg:shadow-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar heading */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-100 px-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/20">
              <Tag className="h-4 w-4" />
            </div>

            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-slate-900">
                Categories
              </h2>
              <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                Find your favourites
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-xl p-2 text-slate-400 transition-all hover:bg-slate-100 hover:text-slate-800 active:scale-95 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable category section */}
        <div className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
          <div className="mb-3 flex items-center justify-between px-2">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
              Explore Store
            </p>

            {!loading && categories.length > 0 && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold tabular-nums text-slate-500">
                {categories.length}
              </span>
            )}
          </div>

          {/* All products */}
          <button
            type="button"
            onClick={() => handleCategorySelect('')}
            aria-current={isAllSelected ? 'page' : undefined}
            className={`group relative flex w-full items-center justify-between overflow-hidden rounded-2xl px-3 py-3 text-left text-sm transition-all duration-200 ${
              isAllSelected
                ? 'bg-indigo-50 font-bold text-indigo-700 ring-1 ring-inset ring-indigo-100'
                : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span
              className={`absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-indigo-600 transition-opacity ${
                isAllSelected ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <span className="flex items-center gap-3">
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all ${
                  isAllSelected
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-600'
                }`}
              >
                <Sparkles className="h-[17px] w-[17px]" />
              </span>

              <span>All Products</span>
            </span>

            <ChevronRight
              className={`h-4 w-4 transition-all ${
                isAllSelected
                  ? 'translate-x-0 text-indigo-500'
                  : '-translate-x-1 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
              }`}
            />
          </button>

          {/* Loading state */}
          {loading && (
            <div className="flex items-center gap-3 rounded-xl px-3 py-5 text-sm text-slate-400">
              <LoaderCircle className="h-4 w-4 animate-spin text-indigo-500" />
              Loading categories...
            </div>
          )}

          {/* Error state */}
          {!loading && hasError && (
            <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4">
              <p className="text-xs font-semibold text-rose-700">
                Could not load categories.
              </p>

              <button
                type="button"
                onClick={() => void fetchCategories()}
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-rose-700 hover:text-rose-900"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Try again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !hasError && categories.length === 0 && (
            <p className="rounded-xl bg-slate-50 px-3 py-4 text-xs leading-5 text-slate-500">
              No categories are available right now.
            </p>
          )}

          {/* API categories */}
          {!loading &&
            !hasError &&
            categories.map((category) => {
              const Icon = getCategoryIcon(category.slug);
              const isSelected =
                selectedCategorySlug === category.slug;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category.slug)}
                  aria-current={isSelected ? 'page' : undefined}
                  className={`group relative flex w-full items-center justify-between overflow-hidden rounded-2xl px-3 py-3 text-left text-sm transition-all duration-200 ${
                    isSelected
                      ? 'bg-indigo-50 font-bold text-indigo-700 ring-1 ring-inset ring-indigo-100'
                      : 'font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span
                    className={`absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-indigo-600 transition-opacity ${
                      isSelected ? 'opacity-100' : 'opacity-0'
                    }`}
                  />

                  <span className="flex min-w-0 items-center gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 ${
                        isSelected
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-600'
                      }`}
                    >
                      <Icon className="h-[17px] w-[17px]" />
                    </span>

                    <span className="truncate">{category.name}</span>
                  </span>

                  <ChevronRight
                    className={`ml-2 h-4 w-4 shrink-0 transition-all ${
                      isSelected
                        ? 'translate-x-0 text-indigo-500'
                        : '-translate-x-1 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                    }`}
                  />
                </button>
              );
            })}

          {/* Deals promo */}
          <div className="relative mt-7 overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4">
            <div className="pointer-events-none absolute -right-7 -top-7 h-24 w-24 rounded-full bg-indigo-200/30 blur-2xl" />

            <div className="relative">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-100 bg-white/90 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-indigo-700">
                <Sparkles className="h-3 w-3" />
                Special Offers
              </span>

              <h3 className="mt-3 text-sm font-extrabold tracking-tight text-slate-900">
                A little something extra.
              </h3>

              <p className="mt-1.5 text-xs leading-5 text-slate-500">
                Explore our collection and find something you love.
              </p>

              <Link
                to="/catalog"
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 active:translate-y-0"
              >
                Explore Catalog
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Support footer */}
        <div className="shrink-0 border-t border-slate-100 bg-white p-4">
          <Link
            to="/"
            onClick={() => {
              if (window.innerWidth < 1024) onClose();
            }}
            className="group flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
                <HelpCircle className="h-4 w-4" />
              </span>

              <span>
                <span className="block text-xs font-bold text-slate-700">
                  Need help?
                </span>
                <span className="mt-0.5 block text-[10px] text-slate-400">
                  We're here for you
                </span>
              </span>
            </span>

            <ArrowRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-indigo-600" />
          </Link>
        </div>
      </aside>
    </>
  );
};
