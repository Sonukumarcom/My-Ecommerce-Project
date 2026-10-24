import React, { useEffect, useState } from 'react';
import { ProductCard } from '../products/ProductCard';
import {
    ArrowRight,
    ShoppingBag,
    Package,
} from 'lucide-react';

import {
    productService,
    type Product,
} from '../../features/products/services/productService';



export const FeaturedProducts: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeaturedProducts = async () => {
            try {
                const response = await productService.getProducts({
                    page: 0,
                    size: 8,
                    sortBy: 'featured',
                });

                if (response.success) {
                    setProducts(response.data.content.slice(0, 4));
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error(
                    'Failed to load featured products:',
                    error
                );

                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadFeaturedProducts();
    }, []);


 
    return (
        <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16">

            {/* Section Header */}
            <div className="flex items-end justify-between mb-8">

                <div>
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                        <Package className="w-4 h-4" />
                        AuraStore Picks
                    </div>

                    <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
                        Featured Products
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Discover some of our most popular products.
                    </p>
                </div>

                <a
                    href="/catalog"
                    className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                    View All
                    <ArrowRight className="w-4 h-4" />
                </a>

            </div>

            {/* Loading */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

                    {[1, 2, 3, 4].map((item) => (
                        <div
                            key={item}
                            className="bg-white rounded-3xl border border-gray-100 overflow-hidden"
                        >
                            <div className="h-64 bg-gray-100 animate-pulse" />

                            <div className="p-5 space-y-3">
                                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse" />
                                <div className="h-5 w-3/4 bg-gray-100 rounded animate-pulse" />
                                <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                            </div>
                        </div>
                    ))}

                </div>
            ) : products.length === 0 ? (
                /* Empty State */
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">

                    <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />

                    <h3 className="mt-4 font-bold text-gray-900">
                        No featured products available
                    </h3>

                    <p className="mt-2 text-sm text-gray-500">
                        Check the catalog for all available products.
                    </p>

                    <a
                        href="/catalog"
                        className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
                    >
                        Browse Catalog
                        <ArrowRight className="w-4 h-4" />
                    </a>

                </div>
            ) : (
                /* Product Grid */
             <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
  {products.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
    />
  ))}
</div>
            )}

            {/* Mobile View All */}
            <div className="mt-6 sm:hidden">

                <a
                    href="/catalog"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600"
                >
                    View All Products
                    <ArrowRight className="w-4 h-4" />
                </a>

            </div>

        </section>
    );
};