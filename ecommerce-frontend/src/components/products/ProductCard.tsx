import React from 'react';
import { Link } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Star,
  ArrowUpRight,
} from 'lucide-react';

import type { Product } from '../../features/products/services/productService';
import { useCartStore } from '../../store/useCartStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
}) => {
  const addItem = useCartStore((state) => state.addItem);

  const activePrice =
    product.salePrice && product.salePrice > 0
      ? product.salePrice
      : product.price;

  const hasSale =
    product.salePrice !== null &&
    product.salePrice > 0 &&
    product.salePrice < product.price;

  const discountPercentage = hasSale
    ? Math.round(
        ((product.price - product.salePrice!) /
          product.price) *
          100
      )
    : 0;

  const isOutOfStock = product.availableStock <= 0;

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) {
      return;
    }

    const cartState = useCartStore.getState();

    const existingItem = cartState.items.find(
      (item) => item.productId === product.id
    );

    const currentQuantity =
      existingItem?.quantity ?? 0;

    if (currentQuantity >= product.availableStock) {
      return;
    }

    addItem(
      {
        id: product.id,
        productId: product.id,
        sku: product.sku,
        name: product.name,
        slug: product.slug,
        price: product.price,
        salePrice: product.salePrice,
        imageUrl: product.imageUrls?.[0] ?? '',
        maxStock: product.availableStock,
      },
      1
    );
  };

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gray-200/70">

      {/* =====================================================
          IMAGE
      ====================================================== */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">

        <Link
          to={`/product/${product.slug}`}
          className="block h-full w-full"
        >
          {product.imageUrls?.[0] ? (
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No Image
            </div>
          )}
        </Link>

        {/* Dark image overlay on hover */}
        <div className="pointer-events-none absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/5" />

        {/* SALE BADGE */}
        {hasSale && (
          <div className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
            {discountPercentage}% OFF
          </div>
        )}

        {/* OUT OF STOCK */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* WISHLIST */}
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-white hover:text-red-500"
        >
          <Heart className="h-4 w-4" />
        </button>

        {/* QUICK ADD */}
        {!isOutOfStock && (
          <button
            type="button"
            onClick={handleAddToCart}
            className="absolute bottom-3 left-3 right-3 flex translate-y-3 items-center justify-center gap-2 rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white opacity-0 shadow-xl transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:bg-indigo-600"
          >
            <ShoppingBag className="h-4 w-4" />
            Quick Add
          </button>
        )}
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="p-4 sm:p-5">

        {/* CATEGORY */}
        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-indigo-500">
          {product.categoryName}
        </p>

        {/* PRODUCT NAME */}
        <Link
          to={`/product/${product.slug}`}
          className="group/title flex items-start justify-between gap-2"
        >
          <h3 className="min-h-[3rem] text-sm font-semibold leading-6 text-gray-900 transition-colors group-hover/title:text-indigo-600 sm:text-base">
            {product.name}
          </h3>

          <ArrowUpRight className="mt-1 h-4 w-4 flex-shrink-0 text-gray-300 transition-all duration-300 group-hover/title:-translate-y-0.5 group-hover/title:translate-x-0.5 group-hover/title:text-indigo-500" />
        </Link>

        {/* RATING */}
        <div className="mt-2 flex items-center gap-2">

          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <Star
                  key={index}
                  className={`h-3.5 w-3.5 ${
                    index <
                    Math.round(product.averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              )
            )}
          </div>

          <span className="text-xs font-semibold text-gray-700">
            {product.averageRating?.toFixed(1)}
          </span>

          <span className="text-xs text-gray-400">
            ({product.reviewCount})
          </span>
        </div>

        {/* PRICE */}
        <div className="mt-4 flex items-end gap-2">
          <span className="text-lg font-extrabold tracking-tight text-gray-900">
            ₹{activePrice.toLocaleString('en-IN')}
          </span>

          {hasSale && (
            <span className="text-sm text-gray-400 line-through">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* STOCK INFO */}
        <div className="mt-2 flex items-center justify-between">

          {!isOutOfStock ? (
            <span
              className={`text-xs font-medium ${
                product.availableStock <= 5
                  ? 'text-orange-600'
                  : 'text-emerald-600'
              }`}
            >
              {product.availableStock <= 5
                ? `Only ${product.availableStock} left`
                : 'In Stock'}
            </span>
          ) : (
            <span className="text-xs font-medium text-red-500">
              Currently unavailable
            </span>
          )}

          <span className="text-[10px] font-medium uppercase tracking-wider text-gray-300">
            {product.sku}
          </span>
        </div>

      </div>
    </article>
  );
};