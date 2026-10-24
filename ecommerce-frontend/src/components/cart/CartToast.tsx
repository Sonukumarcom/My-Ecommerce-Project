import React from 'react';
import { CheckCircle2, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';

export const CartToast: React.FC = () => {
  const toast = useCartStore((state) => state.toast);
  const clearToast = useCartStore(
    (state) => state.clearToast
  );

  if (!toast) {
    return null;
  }

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-[100] animate-in slide-in-from-right-8 fade-in duration-300">
      <div className="w-[calc(100vw-2rem)] sm:w-96 rounded-2xl bg-white border border-gray-100 shadow-2xl shadow-gray-300/40 p-4">

        <div className="flex items-start gap-3">

          {/* Success Icon */}
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">

            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-indigo-600" />

              <p className="text-sm font-bold text-gray-900">
                Added to cart
              </p>
            </div>

            <p className="mt-1 text-sm text-gray-500 truncate">
              {toast.name}
            </p>

            <button
              type="button"
              onClick={() => {
                clearToast();
                useCartStore
                  .getState()
                  .openCart();
              }}
              className="mt-3 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              View Cart →
            </button>

          </div>

          {/* Close */}
          <button
            type="button"
            onClick={clearToast}
            className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>

        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full animate-[toastProgress_2.5s_linear_forwards]" />
        </div>

      </div>
    </div>
  );
};