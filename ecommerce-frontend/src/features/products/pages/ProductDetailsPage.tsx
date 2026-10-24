import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  Zap,
} from 'lucide-react';

import {
  Link,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { Navbar } from '../../../components/layout/Navbar';

import {
  productService,
  type Product,
} from '../services/productService';

import { useCartStore } from '../../../store/useCartStore';

import { ProductCard } from '../../../components/products/ProductCard';


export const ProductDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  /* =========================================================
     CART
  ========================================================= */

  const addItem = useCartStore(
    (state) => state.addItem
  );

  /* =========================================================
     PRODUCT STATE
  ========================================================= */

  const [product, setProduct] =
    useState<Product | null>(null);

  const [relatedProducts, setRelatedProducts] =
    useState<Product[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState('');

  /* =========================================================
     UI STATE
  ========================================================= */

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [quantity, setQuantity] =
    useState(1);

  const [isWishlisted, setIsWishlisted] =
    useState(false);

  /* =========================================================
     LOAD PRODUCT
  ========================================================= */

  useEffect(() => {
    const loadProduct = async () => {
      if (!slug) {
        setErrorMessage(
          'Product was not found.'
        );
        setProduct(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage('');
      setProduct(null);
      setRelatedProducts([]);

      try {
        const data =
          await productService.getProductBySlug(
            slug
          );

        setProduct(data);
        setSelectedImage(0);
        setQuantity(1);
        setIsWishlisted(false);
      } catch (error) {
        console.error(
          'Failed to load product:',
          error
        );

        setProduct(null);

        setErrorMessage(
          'Unable to load this product.'
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  /* =========================================================
     LOAD RELATED PRODUCTS
  ========================================================= */

  useEffect(() => {
    const loadRelatedProducts =
      async () => {
        if (!product) {
          return;
        }

        try {
          const response =
            await productService.getProducts({
              page: 0,
              size: 20,
              sortBy: 'featured',
            });

          if (response.success) {
            const related =
              response.data.content
                .filter(
                  (item: Product) =>
                    item.id !== product.id &&
                    item.categoryName ===
                      product.categoryName
                )
                .slice(0, 4);

            setRelatedProducts(
              related
            );
          } else {
            setRelatedProducts([]);
          }
        } catch (error) {
          console.error(
            'Failed to load related products:',
            error
          );

          setRelatedProducts([]);
        }
      };

    loadRelatedProducts();
  }, [product]);

  /* =========================================================
     PRICE
  ========================================================= */

  const activePrice = useMemo(() => {
    if (!product) {
      return 0;
    }

    return product.salePrice &&
      product.salePrice > 0
      ? product.salePrice
      : product.price;
  }, [product]);

  const hasSale =
    !!product &&
    product.salePrice !== null &&
    product.salePrice > 0 &&
    product.salePrice < product.price;

  const discountPercentage =
    product && hasSale
      ? Math.round(
          ((product.price -
            product.salePrice!) /
            product.price) *
            100
        )
      : 0;

  const maxStock =
    product?.availableStock ?? 0;

  const isOutOfStock =
    maxStock <= 0;

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
     ADD TO CART
  ========================================================= */

  const handleAddToCart = () => {
    if (!product || isOutOfStock) {
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

    const remainingStock =
      product.availableStock -
      currentQuantity;

    if (remainingStock <= 0) {
      return;
    }

    const safeQuantity = Math.min(
      quantity,
      remainingStock
    );

    addItem(
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
      safeQuantity
    );
  };

  /* =========================================================
     BUY NOW
  ========================================================= */

  const handleBuyNow = () => {
    if (!product || isOutOfStock) {
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

    const remainingStock =
      product.availableStock -
      currentQuantity;

    if (remainingStock <= 0) {
      return;
    }

    const safeQuantity = Math.min(
      quantity,
      remainingStock
    );

    addItem(
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
      safeQuantity
    );

    navigate('/checkout');
  };

  /* =========================================================
     QUANTITY
  ========================================================= */

  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(1, current - 1)
    );
  };

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(maxStock, current + 1)
    );
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">

        <Navbar />

        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">

          <div className="grid animate-pulse gap-8 lg:grid-cols-2">

            <div className="aspect-square rounded-3xl bg-gray-200" />

            <div className="space-y-5 py-6">

              <div className="h-4 w-28 rounded bg-gray-200" />

              <div className="h-10 w-3/4 rounded bg-gray-200" />

              <div className="h-20 w-full rounded bg-gray-200" />

              <div className="h-9 w-40 rounded bg-gray-200" />

              <div className="h-16 w-full rounded bg-gray-200" />

              <div className="h-14 w-full rounded bg-gray-200" />

            </div>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     ERROR / PRODUCT NOT FOUND
  ========================================================= */

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50">

        <Navbar />

        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4 text-center">

          <div>

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-white shadow-sm">
              <ShoppingBag className="h-9 w-9 text-gray-300" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-gray-900">
              Product not found
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {errorMessage ||
                'The product you are looking for is unavailable.'}
            </p>

            <Link
              to="/catalog"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </Link>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     IMAGES
  ========================================================= */

  const images =
    product.imageUrls?.filter(Boolean) ?? [];

  const galleryImages =
    images.length > 0
      ? images
      : [''];

  const currentImage =
    galleryImages[
      Math.min(
        selectedImage,
        galleryImages.length - 1
      )
    ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* =====================================================
          BREADCRUMB
      ====================================================== */}

      <div className="border-b border-gray-100 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-2 text-xs text-gray-400">

            <Link
              to="/"
              className="transition-colors hover:text-indigo-600"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              to="/catalog"
              className="transition-colors hover:text-indigo-600"
            >
              Catalog
            </Link>

            <span>/</span>

            <span className="max-w-[180px] truncate font-medium text-gray-600">
              {product.name}
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN PRODUCT SECTION
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">

          {/* =================================================
              LEFT — GALLERY
          ================================================== */}

          <section>

            <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

              {/* Main Image */}
              <div className="relative aspect-square bg-gray-50">

                {currentImage ? (
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-16 w-16 text-gray-200" />
                  </div>
                )}

                {/* Sale */}
                {hasSale && (
                  <div className="absolute left-5 top-5 rounded-full bg-red-500 px-4 py-2 text-xs font-black tracking-wide text-white shadow-lg">
                    {discountPercentage}% OFF
                  </div>
                )}

                {/* Wishlist */}
                <button
                  type="button"
                  onClick={() =>
                    setIsWishlisted(
                      (current) => !current
                    )
                  }
                  aria-label="Add to wishlist"
                  className={`absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/95 shadow-lg backdrop-blur transition-all hover:scale-105 ${
                    isWishlisted
                      ? 'text-red-500'
                      : 'text-gray-500 hover:text-red-500'
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isWishlisted
                        ? 'fill-red-500'
                        : ''
                    }`}
                  />
                </button>

                {/* Previous */}
                {galleryImages.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        (current) =>
                          current === 0
                            ? galleryImages.length - 1
                            : current - 1
                      )
                    }
                    className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur transition-all hover:scale-105"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                )}

                {/* Next */}
                {galleryImages.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImage(
                        (current) =>
                          current ===
                          galleryImages.length - 1
                            ? 0
                            : current + 1
                      )
                    }
                    className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-gray-700 shadow-lg backdrop-blur transition-all hover:scale-105"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                )}

              </div>

            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">

                {galleryImages.map(
                  (image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all ${
                        selectedImage ===
                        index
                          ? 'border-indigo-600 ring-4 ring-indigo-50'
                          : 'border-gray-100 hover:border-gray-300'
                      }`}
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={`${product.name} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="mx-auto h-6 w-6 text-gray-200" />
                      )}
                    </button>
                  )
                )}

              </div>
            )}

          </section>

          {/* =================================================
              RIGHT — PRODUCT INFO
          ================================================== */}

          <section className="lg:py-2">

            {/* Category */}
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
              {product.categoryName}
            </p>

            {/* Name */}
            <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
              {product.name}
            </h1>

            {/* SKU */}
            <p className="mt-2 text-xs font-medium text-gray-400">
              SKU: {product.sku}
            </p>

            {/* Rating */}
            <div className="mt-5 flex flex-wrap items-center gap-3">

              <div className="flex items-center gap-0.5">

                {Array.from({
                  length: 5,
                }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      index <
                      Math.round(
                        product.averageRating ?? 0
                      )
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}

              </div>

              <span className="text-sm font-bold text-gray-800">
                {(
                  product.averageRating ?? 0
                ).toFixed(1)}
              </span>

              <span className="text-sm text-gray-400">
                {product.reviewCount ?? 0} reviews
              </span>

            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-gray-100" />

            {/* Description */}
            <p className="text-sm leading-7 text-gray-600 sm:text-base">
              {product.shortDescription}
            </p>

            {/* Price */}
            <div className="mt-6 flex flex-wrap items-end gap-3">

              <span className="text-3xl font-black tracking-tight text-gray-950">
                {formatPrice(
                  activePrice
                )}
              </span>

              {hasSale && (
                <>
                  <span className="mb-1 text-lg text-gray-400 line-through">
                    {formatPrice(
                      product.price
                    )}
                  </span>

                  <span className="mb-1 rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-600">
                    Save{' '}
                    {formatPrice(
                      product.price -
                        product.salePrice!
                    )}
                  </span>
                </>
              )}

            </div>

            {/* Stock */}
            <div className="mt-4">

              {isOutOfStock ? (
                <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
                  Out of Stock
                </span>
              ) : product.availableStock <= 5 ? (
                <span className="inline-flex items-center rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600">
                  Only {product.availableStock} left in stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
                  <Check className="h-3.5 w-3.5" />
                  In Stock
                </span>
              )}

            </div>

            {/* Quantity */}
            {!isOutOfStock && (
              <div className="mt-7">

                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                  Quantity
                </p>

                <div className="inline-flex items-center overflow-hidden rounded-xl border border-gray-200 bg-white">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1
                    }
                    className="flex h-11 w-11 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="flex h-11 min-w-12 items-center justify-center border-x border-gray-200 px-3 text-sm font-bold text-gray-900">
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      quantity >= maxStock
                    }
                    className="flex h-11 w-11 items-center justify-center text-gray-600 transition-colors hover:bg-gray-50 disabled:opacity-30"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>

                </div>

              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-6 grid gap-3 sm:grid-cols-2">

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={isOutOfStock}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3.5 text-sm font-bold text-gray-900 shadow-sm transition-all hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Bag
              </button>

              <button
                type="button"
                onClick={
                  handleBuyNow
                }
                disabled={isOutOfStock}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Zap className="h-4 w-4" />
                Buy Now
              </button>

            </div>

            {/* Benefits */}
            <div className="mt-7 overflow-hidden rounded-2xl border border-gray-100 bg-white">

              <div className="grid divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">

                {/* Delivery */}
                <div className="flex items-start gap-3 p-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                    <Truck className="h-4 w-4 text-indigo-600" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      Fast Delivery
                    </p>

                    <p className="mt-0.5 text-[11px] leading-5 text-gray-400">
                      Reliable shipping across India
                    </p>
                  </div>

                </div>

                {/* Secure Payment */}
                <div className="flex items-start gap-3 p-4">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      Secure Payment
                    </p>

                    <p className="mt-0.5 text-[11px] leading-5 text-gray-400">
                      Safe and protected checkout
                    </p>
                  </div>

                </div>

              </div>

              {/* Returns */}
              <div className="border-t border-gray-100 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50">
                    <RotateCcw className="h-4 w-4 text-violet-600" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-900">
                      Easy Returns
                    </p>

                    <p className="mt-0.5 text-[11px] leading-5 text-gray-400">
                      Hassle-free return experience
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </section>

        </div>

        {/* =====================================================
            PRODUCT DETAILS
        ====================================================== */}

        <section className="mt-10 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
              <ShoppingBag className="h-5 w-5 text-indigo-600" />
            </div>

            <div>

              <h2 className="text-lg font-bold text-gray-900">
                Product Details
              </h2>

              <p className="text-xs text-gray-400">
                More information about this product
              </p>

            </div>

          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">

            {/* Product */}
            <div className="rounded-xl bg-gray-50 px-4 py-3">

              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Product
              </span>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {product.name}
              </p>

            </div>

            {/* Category */}
            <div className="rounded-xl bg-gray-50 px-4 py-3">

              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Category
              </span>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {product.categoryName}
              </p>

            </div>

            {/* SKU */}
            <div className="rounded-xl bg-gray-50 px-4 py-3">

              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                SKU
              </span>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {product.sku}
              </p>

            </div>

            {/* Availability */}
            <div className="rounded-xl bg-gray-50 px-4 py-3">

              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Availability
              </span>

              <p className="mt-1 text-sm font-semibold text-gray-800">
                {isOutOfStock
                  ? 'Out of Stock'
                  : `${product.availableStock} units available`}
              </p>

            </div>

          </div>

        </section>

        {/* =====================================================
            RELATED PRODUCTS
        ====================================================== */}

        {relatedProducts.length > 0 && (
          <section className="mt-12">

            <div className="mb-6 flex items-end justify-between">

              <div>

                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                  More to Explore
                </p>

                <h2 className="mt-1 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                  You May Also Like
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  More products from the same category
                </p>

              </div>

              <Link
                to="/catalog"
                className="hidden text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-700 sm:inline-flex"
              >
                View All →
              </Link>

            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {relatedProducts.map(
                (item) => (
                  <ProductCard
                    key={item.id}
                    product={item}
                  />
                )
              )}

            </div>

            <div className="mt-5 sm:hidden">

              <Link
                to="/catalog"
                className="inline-flex text-sm font-bold text-indigo-600"
              >
                View All Products →
              </Link>

            </div>

          </section>
        )}

      </main>

    </div>
  );
};