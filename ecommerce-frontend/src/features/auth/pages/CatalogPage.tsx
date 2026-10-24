import React, { useEffect, useState } from 'react';

import {
  ShoppingBag,
  Star,
  Package,
} from 'lucide-react';

import { Navbar } from '../../../components/layout/Navbar';
import { Sidebar } from '../../../components/layout/Sidebar';
import { apiClient } from '../../../config/api.config';


interface Product {
  id: number;
  sku: string;
  name: string;
  slug: string;
  shortDescription: string;
  price: number;
  salePrice: number | null;
  categoryName: string;
  availableStock: number;
  averageRating: number;
  reviewCount: number;
  imageUrls: string[];
}

interface ProductApiResponse {
  success: boolean;
  message: string;
  data: {
    content: Product[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  };
}

export const CatalogPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        let url = '/products';

        if (selectedCategory) {
          const categoryResponse = await apiClient.get(
            `/categories/${selectedCategory}`
          );

          const categoryId = categoryResponse.data.data.id;

          url += `?categoryId=${categoryId}`;
        }

        const response =
          await apiClient.get<ProductApiResponse>(url);

        if (response.data.success) {
          setProducts(response.data.data.content);
        }
      } catch (error) {
        console.error('Failed to load products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
  onToggleSidebar={() => setIsSidebarOpen(true)}
/>

      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          selectedCategorySlug={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <main className="flex-1 p-6 sm:p-8 lg:p-10">
          <div className="max-w-7xl mx-auto">

            {/* Page Header */}
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold">
                <ShoppingBag className="w-3.5 h-3.5" />
                AuraStore Catalog
              </span>

              <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">
                {selectedCategory
                  ? `Products in ${selectedCategory}`
                  : 'All Products'}
              </h1>

              <p className="mt-2 text-gray-500">
                Browse our latest products and discover something you love.
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <p className="text-gray-500">
                  Loading products...
                </p>
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Package className="w-12 h-12 mx-auto text-gray-300" />

                <h2 className="mt-4 text-lg font-bold text-gray-900">
                  No products available
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Products will appear here once they are added to the store.
                </p>
              </div>
            )}

            {/* Product Grid */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    {/* Product Image */}
                    <div className="h-56 bg-gray-100 flex items-center justify-center">
                      {product.imageUrls?.length > 0 ? (
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-14 h-14 text-gray-300" />
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-5">
                      <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                        {product.categoryName}
                      </p>

                      <h2 className="mt-2 text-lg font-bold text-gray-900">
                        {product.name}
                      </h2>

                      <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                        {product.shortDescription}
                      </p>

                      {/* Rating */}
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-current text-yellow-500" />
                          <span className="text-sm font-semibold text-gray-700">
                            {product.averageRating ?? 0}
                          </span>
                        </div>

                        <span className="text-xs text-gray-400">
                          ({product.reviewCount ?? 0} reviews)
                        </span>
                      </div>

                      {/* Price */}
                      <div className="mt-4 flex items-center gap-3">
                        {product.salePrice ? (
                          <>
                            <span className="text-xl font-extrabold text-gray-900">
                              ₹{product.salePrice}
                            </span>

                            <span className="text-sm text-gray-400 line-through">
                              ₹{product.price}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-extrabold text-gray-900">
                            ₹{product.price}
                          </span>
                        )}
                      </div>

                      {/* Stock */}
                      <p
                        className={`mt-3 text-xs font-medium ${
                          product.availableStock > 0
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {product.availableStock > 0
                          ? `${product.availableStock} items available`
                          : 'Out of stock'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};