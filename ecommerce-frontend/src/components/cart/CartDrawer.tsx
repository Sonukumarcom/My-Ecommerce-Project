import React from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
} from 'lucide-react';

import { useCartStore } from '../../store/useCartStore';

export const CartDrawer: React.FC = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
  } = useCartStore();

  const subtotal = getSubtotal();

  const shipping =
    subtotal >= 5000 ? 0 : subtotal > 0 ? 100 : 0;

  const grandTotal = subtotal + shipping;

  const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div
      className={`fixed inset-0 z-[200] ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      {/* =====================================================
          BACKDROP
      ====================================================== */}
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={closeCart}
      />

      {/* =====================================================
          DRAWER
      ====================================================== */}
      <aside
        className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen
            ? 'translate-x-0'
            : 'translate-x-full'
        }`}
        aria-label="Shopping cart drawer"
      >

        {/* ===================================================
            HEADER
        ==================================================== */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>

            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Your Shopping Bag
              </h2>

              <p className="text-xs text-gray-400">
                {items.length === 0
                  ? 'No items'
                  : `${items.reduce(
                      (total, item) =>
                        total + item.quantity,
                      0
                    )} item${
                      items.reduce(
                        (total, item) =>
                          total + item.quantity,
                        0
                      ) === 1
                        ? ''
                        : 's'
                    }`}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={closeCart}
            className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>

        </div>

        {/* ===================================================
            FREE SHIPPING PROGRESS
        ==================================================== */}
        {items.length > 0 && (
          <div className="px-5 py-4 bg-slate-50 border-b border-gray-100">

            {subtotal >= 5000 ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">

                <Truck className="w-4 h-4" />

                Congratulations! You unlocked Free Shipping 🎉

              </div>
            ) : (
              <>
                <div className="flex items-center justify-between text-xs mb-2">

                  <span className="text-gray-500">
                    Add{' '}
                    <strong className="text-gray-900">
                      {formatINR(5000 - subtotal)}
                    </strong>{' '}
                    more for free shipping
                  </span>

                  <Truck className="w-4 h-4 text-indigo-600" />

                </div>

                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        (subtotal / 5000) * 100,
                        100
                      )}%`,
                    }}
                  />

                </div>
              </>
            )}

          </div>
        )}

        {/* ===================================================
            ITEMS
        ==================================================== */}
        <div className="flex-1 overflow-y-auto">

          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center px-8 text-center">

              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>

              <h3 className="mt-5 text-lg font-bold text-gray-900">
                Your bag is empty
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add products from the catalog and they will appear here.
              </p>

              <button
                type="button"
                onClick={() => {
                  closeCart();
                  window.location.href = '/catalog';
                }}
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
              >
                Start Shopping
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          ) : (
            <div className="px-5 py-4 space-y-4">

              {items.map((item) => {
                const activePrice =
                  item.salePrice &&
                  item.salePrice > 0
                    ? item.salePrice
                    : item.price;

                return (
                  <div
                    key={item.productId}
                    className="flex gap-3 p-3 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all"
                  >

                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-xl bg-gray-50 overflow-hidden shrink-0">

                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6 text-gray-300" />
                        </div>
                      )}

                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">

                      <div className="flex items-start justify-between gap-2">

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-gray-900 line-clamp-2">
                            {item.name}
                          </p>

                          <p className="mt-1 text-[11px] text-gray-400">
                            SKU: {item.sku}
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.productId
                            )
                          }
                          className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">

                        {/* Quantity */}
                        <div className="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden">

                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.quantity - 1
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                            disabled={
                              item.quantity <= 1
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <span className="w-8 text-center text-xs font-bold text-gray-900">
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
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>

                        </div>

                        {/* Price */}
                        <div className="text-right">

                          <p className="text-sm font-extrabold text-gray-900">
                            {formatINR(
                              activePrice *
                                item.quantity
                            )}
                          </p>

                          {item.quantity > 1 && (
                            <p className="text-[10px] text-gray-400">
                              {formatINR(activePrice)} each
                            </p>
                          )}

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

        {/* ===================================================
            FOOTER
        ==================================================== */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-white p-5 space-y-4">

            {/* Summary */}
            <div className="space-y-2">

              <div className="flex justify-between text-sm text-gray-500">

                <span>
                  Subtotal
                </span>

                <span className="font-semibold text-gray-900">
                  {formatINR(subtotal)}
                </span>

              </div>

              <div className="flex justify-between text-sm text-gray-500">

                <span>
                  Shipping
                </span>

                <span className="font-semibold text-gray-900">
                  {shipping === 0
                    ? 'FREE'
                    : formatINR(shipping)}
                </span>

              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between">

                <span className="text-base font-extrabold text-gray-900">
                  Total
                </span>

                <span className="text-xl font-black text-indigo-600">
                  {formatINR(grandTotal)}
                </span>

              </div>

            </div>

            {/* View Cart */}
            <button
              type="button"
              onClick={() => {
                closeCart();
                window.location.href = '/cart';
              }}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              View Shopping Bag
            </button>

            {/* Checkout */}
            <button
              type="button"
              onClick={() => {
                closeCart();
                window.location.href = '/checkout';
              }}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-100"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-[11px] text-gray-400">
              Secure checkout • Easy returns • Trusted shopping
            </p>

          </div>
        )}

      </aside>
    </div>
  );
};