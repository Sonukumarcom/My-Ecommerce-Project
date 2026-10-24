import React, { useMemo, useState } from 'react';

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
  Truck,
  X,
  Sparkles,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import { Navbar } from '../../../components/layout/Navbar';

import { useCartStore } from '../../../store/useCartStore';

export const CartPage: React.FC = () => {
  /* =========================================================
     CART STORE
  ========================================================= */

  const items = useCartStore(
    (state) => state.items
  );

  const updateQuantity = useCartStore(
    (state) => state.updateQuantity
  );

  const removeItem = useCartStore(
    (state) => state.removeItem
  );

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  /* =========================================================
     PROMO STATE
  ========================================================= */

  const [promoCode, setPromoCode] =
    useState('');

  const [promoApplied, setPromoApplied] =
    useState(false);

  const [promoError, setPromoError] =
    useState('');

  /* =========================================================
     PRICE CALCULATIONS
  ========================================================= */

  const subtotal = useMemo(() => {
    return items.reduce(
      (total, item) => {
        const price =
          item.salePrice &&
          item.salePrice > 0
            ? item.salePrice
            : item.price;

        return (
          total + price * item.quantity
        );
      },
      0
    );
  }, [items]);

  const discountAmount = promoApplied
    ? subtotal * 0.2
    : 0;

  const discountedSubtotal =
    Math.max(
      subtotal - discountAmount,
      0
    );

  const freeShippingThreshold = 5000;

  const shippingCost =
    discountedSubtotal >=
    freeShippingThreshold
      ? 0
      : 100;

  const taxAmount =
    discountedSubtotal * 0.18;

  const finalTotal =
    discountedSubtotal +
    shippingCost +
    taxAmount;

  const progressToFreeShipping =
    Math.min(
      (discountedSubtotal /
        freeShippingThreshold) *
        100,
      100
    );

  const amountForFreeShipping =
    Math.max(
      freeShippingThreshold -
        discountedSubtotal,
      0
    );

  const totalItems = items.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

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
     PROMO
  ========================================================= */

  const handleApplyPromo = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setPromoError('');

    const code =
      promoCode.trim().toUpperCase();

    if (!code) {
      setPromoApplied(false);

      setPromoError(
        'Please enter a promo code.'
      );

      return;
    }

    if (code === 'SPRING20') {
      setPromoCode('SPRING20');
      setPromoApplied(true);
      setPromoError('');

      return;
    }

    setPromoApplied(false);

    setPromoError(
      'Invalid coupon code. Try SPRING20 for 20% off.'
    );
  };

  const removePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoError('');
  };

  /* =========================================================
     EMPTY CART
  ========================================================= */

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50">

        <Navbar />

        <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-2xl items-center justify-center px-4 py-12">

          <div className="w-full rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl sm:p-12">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50">
              <ShoppingBag className="h-9 w-9 text-indigo-600" />
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
              <Sparkles className="h-3.5 w-3.5" />
              AuraStore
            </div>

            <h1 className="mt-4 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
              Your shopping bag is empty
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You haven't added anything yet. Explore our collection and find something you love.
            </p>

            <Link
              to="/catalog"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl"
            >
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </main>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-gray-100 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
                <ShoppingBag className="h-3.5 w-3.5" />
                Your Bag
              </div>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                Shopping Bag
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Review your items before secure checkout.
              </p>

            </div>

            <div className="flex items-center gap-3">

              <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3">

                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  Items
                </p>

                <p className="mt-0.5 text-lg font-black text-gray-900">
                  {totalItems}
                </p>

              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50 px-4 py-3">

                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-500">
                  Total
                </p>

                <p className="mt-0.5 text-lg font-black text-indigo-700">
                  {formatPrice(
                    finalTotal
                  )}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

        <div className="grid gap-7 lg:grid-cols-[1fr_390px]">

          {/* =================================================
              LEFT — CART ITEMS
          ================================================== */}

          <section className="space-y-5">

            {/* Free Shipping Progress */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

              <div className="p-4 sm:p-5">

                <div className="flex items-start justify-between gap-4">

                  <div className="flex items-start gap-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                      <Truck className="h-4 w-4 text-indigo-600" />
                    </div>

                    <div>

                      {amountForFreeShipping >
                      0 ? (
                        <>
                          <p className="text-xs font-bold text-gray-900 sm:text-sm">
                            Add{' '}
                            <span className="text-indigo-600">
                              {formatPrice(
                                amountForFreeShipping
                              )}
                            </span>{' '}
                            more for FREE shipping
                          </p>

                          <p className="mt-1 text-[11px] text-gray-400">
                            Free delivery on orders above ₹5,000
                          </p>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-1.5">

                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                            <p className="text-xs font-bold text-emerald-700 sm:text-sm">
                              You unlocked Free Shipping
                            </p>

                          </div>

                          <p className="mt-1 text-[11px] text-gray-400">
                            Great choice! Your delivery is on us.
                          </p>
                        </>
                      )}

                    </div>

                  </div>

                  <span className="shrink-0 text-xs font-black text-indigo-600">
                    {Math.round(
                      progressToFreeShipping
                    )}
                    %
                  </span>

                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 transition-all duration-500"
                    style={{
                      width: `${progressToFreeShipping}%`,
                    }}
                  />

                </div>

              </div>

            </div>

            {/* Cart Items Card */}
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">

                <div>

                  <h2 className="text-sm font-black text-gray-900">
                    Your Items
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {totalItems}{' '}
                    {totalItems === 1
                      ? 'item'
                      : 'items'}{' '}
                    selected
                  </p>

                </div>

                <button
                  type="button"
                  onClick={clearCart}
                  className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear Bag
                </button>

              </div>

              <div className="divide-y divide-gray-100">

                {items.map((item) => {

                  const effectivePrice =
                    item.salePrice &&
                    item.salePrice > 0
                      ? item.salePrice
                      : item.price;

                  const itemTotal =
                    effectivePrice *
                    item.quantity;

                  const hasSale =
                    item.salePrice != null &&
                    item.salePrice > 0 &&
                    item.salePrice <
                      item.price;

                  return (
                    <div
                      key={item.productId}
                      className="p-4 sm:p-6"
                    >

                      <div className="flex flex-col gap-4 sm:flex-row">

                        {/* Image */}
                        <Link
                          to={`/product/${item.slug}`}
                          className="group shrink-0"
                        >

                          <div className="relative h-28 w-full overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 sm:h-28 sm:w-28">

                            {item.imageUrl ? (
                              <img
                                src={
                                  item.imageUrl
                                }
                                alt={
                                  item.name
                                }
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ShoppingBag className="h-8 w-8 text-gray-300" />
                              </div>
                            )}

                            {hasSale && (
                              <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-1 text-[9px] font-black text-white">
                                SALE
                              </span>
                            )}

                          </div>

                        </Link>

                        {/* Product Information */}
                        <div className="min-w-0 flex-1">

                          <div className="flex items-start justify-between gap-3">

                            <div className="min-w-0">

                              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                                SKU: {item.sku}
                              </p>

                              <Link
                                to={`/product/${item.slug}`}
                              >
                                <h3 className="mt-1 line-clamp-2 text-base font-bold text-gray-900 transition-colors hover:text-indigo-600 sm:text-lg">
                                  {item.name}
                                </h3>
                              </Link>

                            </div>

                            {/* Remove */}
                            <button
                              type="button"
                              onClick={() =>
                                removeItem(
                                  item.productId
                                )
                              }
                              className="shrink-0 rounded-lg p-2 text-gray-300 transition-colors hover:bg-red-50 hover:text-red-500"
                              aria-label={`Remove ${item.name}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>

                          </div>

                          {/* Price */}
                          <div className="mt-2 flex flex-wrap items-center gap-2">

                            <span className="text-sm font-black text-indigo-600">
                              {formatPrice(
                                effectivePrice
                              )}
                            </span>

                            {hasSale && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(
                                  item.price
                                )}
                              </span>
                            )}

                            <span className="text-[10px] text-gray-400">
                              each
                            </span>

                          </div>

                          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">

                            {/* Quantity */}
                            <div>

                              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Quantity
                              </p>

                              <div className="inline-flex items-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-1">

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity - 1
                                    )
                                  }
                                  disabled={
                                    item.quantity <=
                                    1
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                                  aria-label={`Decrease ${item.name}`}
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>

                                <span className="flex h-8 min-w-9 items-center justify-center px-2 text-xs font-black text-gray-900">
                                  {item.quantity}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.productId,
                                      item.quantity + 1
                                    )
                                  }
                                  disabled={
                                    item.quantity >=
                                    item.maxStock
                                  }
                                  className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-30"
                                  aria-label={`Increase ${item.name}`}
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>

                              </div>

                            </div>

                            {/* Item Total */}
                            <div className="text-right">

                              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                Item Total
                              </p>

                              <p className="mt-1 text-lg font-black text-gray-900">
                                {formatPrice(
                                  itemTotal
                                )}
                              </p>

                            </div>

                          </div>

                        </div>

                      </div>

                    </div>
                  );
                })}

              </div>

            </div>

            {/* Continue Shopping */}
            <Link
              to="/catalog"
              className="inline-flex items-center gap-2 rounded-xl px-1 py-2 text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-700"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>

          </section>

          {/* =================================================
              RIGHT — SUMMARY
          ================================================== */}

          <aside>

            <div className="sticky top-24 space-y-5">

              {/* Summary Card */}
              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg">

                <div className="border-b border-gray-100 px-6 py-5">

                  <h2 className="text-base font-black text-gray-900">
                    Order Summary
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    Review your total before checkout
                  </p>

                </div>

                <div className="space-y-5 p-6">

                  {/* Coupon */}
                  <div>

                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                      Have a promo code?
                    </label>

                    {promoApplied ? (
                      <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-3">

                        <div className="flex items-center gap-2">

                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white">
                            <Tag className="h-3.5 w-3.5 text-emerald-600" />
                          </div>

                          <div>

                            <p className="text-xs font-bold text-emerald-700">
                              SPRING20
                            </p>

                            <p className="text-[10px] text-emerald-600">
                              20% discount applied
                            </p>

                          </div>

                        </div>

                        <button
                          type="button"
                          onClick={
                            removePromo
                          }
                          className="rounded-lg p-1.5 text-emerald-600 transition-colors hover:bg-emerald-100"
                          aria-label="Remove promo code"
                        >
                          <X className="h-4 w-4" />
                        </button>

                      </div>
                    ) : (
                      <form
                        onSubmit={
                          handleApplyPromo
                        }
                        className="flex gap-2"
                      >

                        <div className="relative flex-1">

                          <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                          <input
                            type="text"
                            value={
                              promoCode
                            }
                            onChange={(e) =>
                              setPromoCode(
                                e.target
                                  .value
                              )
                            }
                            placeholder="SPRING20"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-xs font-semibold uppercase outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                          />

                        </div>

                        <button
                          type="submit"
                          className="rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-black"
                        >
                          Apply
                        </button>

                      </form>
                    )}

                    {promoError && (
                      <p className="mt-2 text-[11px] font-medium text-red-500">
                        {promoError}
                      </p>
                    )}

                  </div>

                  {/* Price Breakdown */}
                  <div className="space-y-3 border-t border-gray-100 pt-4">

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-gray-500">
                        Subtotal
                      </span>

                      <span className="font-semibold text-gray-900">
                        {formatPrice(
                          subtotal
                        )}
                      </span>

                    </div>

                    {discountAmount >
                      0 && (
                      <div className="flex items-center justify-between text-sm">

                        <span className="text-emerald-600">
                          Discount
                        </span>

                        <span className="font-bold text-emerald-600">
                          -
                          {formatPrice(
                            discountAmount
                          )}
                        </span>

                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-gray-500">
                        Shipping
                      </span>

                      {shippingCost ===
                      0 ? (
                        <span className="text-xs font-black uppercase text-emerald-600">
                          Free
                        </span>
                      ) : (
                        <span className="font-semibold text-gray-900">
                          {formatPrice(
                            shippingCost
                          )}
                        </span>
                      )}

                    </div>

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-gray-500">
                        GST (18%)
                      </span>

                      <span className="font-semibold text-gray-900">
                        {formatPrice(
                          taxAmount
                        )}
                      </span>

                    </div>

                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-100 pt-4">

                    <div className="flex items-end justify-between gap-4">

                      <div>

                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Total Payable
                        </p>

                        <p className="mt-1 text-2xl font-black tracking-tight text-gray-950">
                          {formatPrice(
                            finalTotal
                          )}
                        </p>

                      </div>

                      <div className="rounded-xl bg-indigo-50 px-3 py-2 text-right">

                        <p className="text-[9px] font-bold uppercase tracking-wider text-indigo-400">
                          Currency
                        </p>

                        <p className="text-xs font-black text-indigo-700">
                          INR
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Checkout */}
                  <Link
                    to="/checkout"
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl"
                  >
                    Proceed to Checkout

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                </div>

              </div>

              {/* Trust Card */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <div className="grid grid-cols-2 gap-4">

                  <div className="flex items-start gap-2.5">

                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <div>

                      <p className="text-[11px] font-bold text-gray-800">
                        Secure Checkout
                      </p>

                      <p className="mt-0.5 text-[10px] leading-4 text-gray-400">
                        Protected payment
                      </p>

                    </div>

                  </div>

                  <div className="flex items-start gap-2.5">

                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                    <div>

                      <p className="text-[11px] font-bold text-gray-800">
                        Fast Delivery
                      </p>

                      <p className="mt-0.5 text-[10px] leading-4 text-gray-400">
                        Reliable shipping
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};