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
} from 'lucide-react';

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
      return Smartphone;
    case 'fashion':
      return Shirt;
    case 'home-kitchen':
      return Home;
    case 'beauty':
      return Sparkles;
    case 'sports':
      return Watch;
    case 'smartphones':
      return Smartphone;
    case 'laptops':
      return Laptop;
    case 'accessories':
      return Watch;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response =
          await apiClient.get<CategoryApiResponse>('/categories');

        if (response.data.success) {
          setCategories(response.data.data);
        }
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (slug: string) => {
    onSelectCategory?.(slug);

    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-indigo-600" />

            <h2 className="text-base font-bold text-gray-900 tracking-tight">
              Categories
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Explore Catalog
          </p>

          {/* All Products */}
          <button
            type="button"
            onClick={() => handleCategorySelect('')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              selectedCategorySlug === ''
                ? 'bg-indigo-50 text-indigo-700 font-semibold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles
                className={`w-4 h-4 ${
                  selectedCategorySlug === ''
                    ? 'text-indigo-600'
                    : 'text-gray-400'
                }`}
              />

              <span>All Products</span>
            </div>
          </button>

          {/* API Categories */}
          {loading ? (
            <div className="px-3 py-4 text-sm text-gray-400">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="px-3 py-4 text-sm text-gray-400">
              No categories found.
            </div>
          ) : (
            categories.map((cat) => {
              const Icon = getCategoryIcon(cat.slug);
              const isSelected = selectedCategorySlug === cat.slug;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`w-full flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-700 font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 ${
                        isSelected
                          ? 'text-indigo-600'
                          : 'text-gray-400'
                      }`}
                    />

                    <span>{cat.name}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Promo Card */}
        <div className="p-4 m-4 bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl border border-indigo-100/60">
          <span className="text-[11px] font-bold text-indigo-700 tracking-wider uppercase bg-white/80 px-2 py-0.5 rounded-md">
            Member Exclusive
          </span>

          <h4 className="mt-2 text-sm font-bold text-gray-900">
            Spring Tech Sale
          </h4>

          <p className="mt-1 text-xs text-gray-600">
            Save up to 35% on flagship electronics and laptops.
          </p>

          <a
            href="/catalog?discount=true"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            Browse Deals
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Support Footer */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <span>Need Help?</span>
          </div>

          <a
            href="/support"
            className="font-medium text-indigo-600 hover:underline"
          >
            Support Center
          </a>
        </div>
      </aside>
    </>
  );
};