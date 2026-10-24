import React, { useEffect, useState } from 'react';
import {
  Package,
  ArrowRight,
  CalendarDays,
  CreditCard,
  ShoppingBag,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock3,
  Truck,
  XCircle,
} from 'lucide-react';

import { Navbar } from '../../../components/layout/Navbar';
import {
  orderService,
  type Order,
} from '../services/orderService';

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date: string) => {
  if (!date) return 'Date unavailable';

  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const getStatusClasses = (status: string) => {
  switch (status.toUpperCase()) {
    case 'DELIVERED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';

    case 'SHIPPED':
      return 'bg-blue-50 text-blue-700 border-blue-200';

    case 'PROCESSING':
      return 'bg-amber-50 text-amber-700 border-amber-200';

    case 'CANCELLED':
      return 'bg-red-50 text-red-700 border-red-200';

    case 'REFUNDED':
      return 'bg-violet-50 text-violet-700 border-violet-200';

    case 'PENDING':
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
};

const getStatusIcon = (status: string) => {
  switch (status.toUpperCase()) {
    case 'DELIVERED':
      return <CheckCircle2 className="w-4 h-4" />;

    case 'SHIPPED':
      return <Truck className="w-4 h-4" />;

    case 'PROCESSING':
      return <Clock3 className="w-4 h-4" />;

    case 'CANCELLED':
      return <XCircle className="w-4 h-4" />;

    default:
      return <Clock3 className="w-4 h-4" />;
  }
};

export const MyOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage('');

      const response = await orderService.getMyOrders(0, 20);

      if (response.success) {
        setOrders(response.data?.content ?? []);
      } else {
        setOrders([]);
        setErrorMessage(
          response.message || 'Unable to load your orders.'
        );
      }
    } catch (error) {
      console.error('Failed to load orders:', error);

      setOrders([]);
      setErrorMessage(
        'Unable to load your orders. Please try again.'
      );
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
                <Package className="w-3.5 h-3.5" />
                Order History
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                My Orders
              </h1>

              <p className="mt-2 text-sm sm:text-base text-gray-500">
                View and track all your AuraStore orders.
              </p>
            </div>

            <button
              type="button"
              onClick={() => loadOrders(true)}
              disabled={refreshing || isLoading}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  refreshing ? 'animate-spin' : ''
                }`}
              />
              Refresh
            </button>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse"
                >
                  <div className="h-5 w-40 bg-gray-200 rounded mb-4" />
                  <div className="h-4 w-64 bg-gray-100 rounded mb-3" />
                  <div className="h-4 w-32 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!isLoading && errorMessage && (
            <div className="bg-white border border-red-100 rounded-2xl p-6 text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-red-500" />
              </div>

              <h2 className="text-lg font-bold text-gray-900">
                Something went wrong
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={() => loadOrders()}
                className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-black transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!isLoading &&
            !errorMessage &&
            orders.length === 0 && (
              <div className="bg-white rounded-3xl border border-gray-100 p-10 sm:p-16 text-center shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-5">
                  <ShoppingBag className="w-8 h-8 text-indigo-600" />
                </div>

                <h2 className="text-xl font-extrabold text-gray-900">
                  No orders yet
                </h2>

                <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                  You haven't placed any orders yet. Start shopping and
                  your orders will appear here.
                </p>

                <a
                  href="/catalog"
                  className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition"
                >
                  Start Shopping
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            )}

          {/* Orders */}
          {!isLoading &&
            !errorMessage &&
            orders.length > 0 && (
              <div className="space-y-5">

                {orders.map((order) => {
                  const itemCount = order.items?.reduce(
                    (total, item) =>
                      total + (item.quantity || 0),
                    0
                  ) ?? 0;

                  return (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >

                      {/* Order Header */}
                      <div className="p-5 sm:p-6 border-b border-gray-100">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                          <div>
                            <p className="text-xs uppercase tracking-wider font-semibold text-gray-400">
                              Order Number
                            </p>

                            <h2 className="mt-1 text-lg font-extrabold text-gray-900">
                              #{order.orderNumber}
                            </h2>
                          </div>

                          <div className="flex flex-wrap items-center gap-3">

                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${getStatusClasses(
                                order.orderStatus
                              )}`}
                            >
                              {getStatusIcon(order.orderStatus)}
                              {order.orderStatus}
                            </span>

                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-gray-600 text-xs font-bold">
                              <CreditCard className="w-3.5 h-3.5" />
                              {order.paymentStatus}
                            </span>

                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-gray-500">
                          <span className="inline-flex items-center gap-2">
                            <CalendarDays className="w-4 h-4 text-gray-400" />
                            {formatDate(order.placedAt)}
                          </span>

                          <span className="inline-flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" />
                            {itemCount}{' '}
                            {itemCount === 1 ? 'item' : 'items'}
                          </span>
                        </div>
                      </div>

                      {/* Order Content */}
                      <div className="p-5 sm:p-6">

                        <div className="space-y-4">
                          {order.items?.map((item, index) => (
                            <div
                              key={`${order.id}-${index}`}
                              className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50/80 p-4"
                            >
                              <div className="min-w-0">
                                <h3 className="text-sm font-bold text-gray-900 truncate">
                                  {item.productName}
                                </h3>

                                <p className="mt-1 text-xs text-gray-500">
                                  SKU: {item.productSku}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>

                              <div className="text-right shrink-0">
                                <p className="text-sm font-extrabold text-gray-900">
                                  {formatPrice(item.totalPrice)}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">
                                  {formatPrice(item.unitPrice)} / item
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Bottom Summary */}
                        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                          <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">
                              Order Total
                            </p>

                            <p className="mt-1 text-2xl font-extrabold text-indigo-600">
                              {formatPrice(order.totalAmount)}
                            </p>
                          </div>

                          <a
                            href={`/orders/${order.orderNumber}`}
                            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition"
                          >
                            View Order
                            <ArrowRight className="w-4 h-4" />
                          </a>

                        </div>

                      </div>
                    </div>
                  );
                })}

              </div>
            )}

        </div>
      </main>
    </>
  );
};

export default MyOrdersPage;