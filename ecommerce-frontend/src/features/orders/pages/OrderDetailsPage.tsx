import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Package,
  CalendarDays,
  CreditCard,
  CheckCircle2,
  Clock3,
  Truck,
  XCircle,
  AlertCircle,
  MapPin,
  Phone,
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
  }).format(Number(amount || 0));
};

const formatDate = (date: string) => {
  if (!date) {
    return 'Date unavailable';
  }

  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
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

export const OrderDetailsPage: React.FC = () => {
  const { orderNumber } = useParams<{
    orderNumber: string;
  }>();

  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderNumber) {
        setErrorMessage('Order number is missing.');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setErrorMessage('');

        const data =
          await orderService.getOrderByNumber(
            orderNumber
          );

        setOrder(data);
      } catch (error) {
        console.error(
          'Failed to load order details:',
          error
        );

        setOrder(null);
        setErrorMessage(
          'Unable to load this order. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [orderNumber]);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-50/70">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

          {/* Back */}
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-indigo-600 transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to My Orders
          </Link>

          {/* Loading */}
          {isLoading && (
            <div className="space-y-6 animate-pulse">

              <div className="bg-white rounded-3xl border border-gray-100 p-6 sm:p-8">
                <div className="h-4 w-28 bg-gray-200 rounded mb-4" />
                <div className="h-8 w-64 bg-gray-200 rounded mb-4" />
                <div className="h-4 w-80 bg-gray-100 rounded" />
              </div>

              <div className="bg-white rounded-3xl border border-gray-100 p-6">
                <div className="h-5 w-40 bg-gray-200 rounded mb-5" />
                <div className="h-20 w-full bg-gray-100 rounded-2xl" />
              </div>

            </div>
          )}

          {/* Error */}
          {!isLoading && errorMessage && (
            <div className="bg-white rounded-3xl border border-red-100 p-8 text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                <AlertCircle className="w-7 h-7 text-red-500" />
              </div>

              <h1 className="text-xl font-extrabold text-gray-900">
                Order not found
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                {errorMessage}
              </p>

              <Link
                to="/orders"
                className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900 text-white text-sm font-bold hover:bg-black transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Orders
              </Link>

            </div>
          )}

          {/* Order Content */}
          {!isLoading && !errorMessage && order && (
            <div className="space-y-6">

              {/* Header */}
              <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-3">
                      <Package className="w-3.5 h-3.5" />
                      Order Details
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                      #{order.orderNumber}
                    </h1>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">

                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="w-4 h-4" />
                        {formatDate(order.placedAt)}
                      </span>

                      <span className="inline-flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        {order.items?.reduce(
                          (count, item) =>
                            count + Number(item.quantity || 0),
                          0
                        ) ?? 0}{' '}
                        items
                      </span>

                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">

                    <span
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${getStatusClasses(
                        order.orderStatus
                      )}`}
                    >
                      {getStatusIcon(order.orderStatus)}
                      {order.orderStatus}
                    </span>

                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-gray-50 text-gray-700 text-sm font-bold">
                      <CreditCard className="w-4 h-4" />
                      {order.paymentStatus}
                    </span>

                  </div>

                </div>

              </section>

              {/* Items */}
              <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-lg font-extrabold text-gray-900">
                    Order Items
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Products included in this order.
                  </p>
                </div>

                <div className="p-5 sm:p-6 space-y-4">

                  {order.items?.map((item, index) => (
                    <div
                      key={`${order.id}-${index}`}
                      className="rounded-2xl border border-gray-100 p-4 sm:p-5"
                    >

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                        <div className="flex items-start gap-4">

                          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                            <Package className="w-6 h-6 text-indigo-600" />
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-gray-900">
                              {item.productName}
                            </h3>

                            <p className="text-xs text-gray-500 mt-1">
                              SKU: {item.productSku}
                            </p>

                            <p className="text-xs text-gray-500 mt-1">
                              Quantity: {item.quantity}
                            </p>
                          </div>

                        </div>

                        <div className="text-left sm:text-right">

                          <p className="text-lg font-extrabold text-gray-900">
                            {formatPrice(item.totalPrice)}
                          </p>

                          <p className="text-xs text-gray-400 mt-1">
                            {formatPrice(item.unitPrice)} ×{' '}
                            {item.quantity}
                          </p>

                        </div>

                      </div>

                    </div>
                  ))}

                </div>

              </section>

              {/* Status */}
              <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                <h2 className="text-lg font-extrabold text-gray-900">
                  Order Status
                </h2>

                <div className="mt-6">

                  <div className="flex items-start gap-4">

                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        Order Placed
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Your order was successfully placed.
                      </p>
                    </div>

                  </div>

                  <div className="ml-5 h-8 border-l border-dashed border-gray-200" />

                  <div className="flex items-start gap-4">

                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center shrink-0">
                      {getStatusIcon(order.orderStatus)}
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-gray-900">
                        Current Status
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Your order is currently{' '}
                        <span className="font-semibold text-gray-800">
                          {order.orderStatus.toLowerCase()}
                        </span>
                        .
                      </p>
                    </div>

                  </div>

                </div>

              </section>

              {/* Summary + Payment */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Order Summary */}
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

                  <h2 className="text-lg font-extrabold text-gray-900">
                    Order Summary
                  </h2>

                  <div className="mt-5 space-y-4">

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Subtotal
                      </span>

                      <span className="font-semibold text-gray-900">
                        {formatPrice(order.subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        GST (18%)
                      </span>

                      <span className="font-semibold text-gray-900">
                        {formatPrice(order.taxAmount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        Shipping
                      </span>

                      <span
                        className={`font-semibold ${
                          Number(order.shippingFee) === 0
                            ? 'text-emerald-600'
                            : 'text-gray-900'
                        }`}
                      >
                        {Number(order.shippingFee) === 0
                          ? 'Free'
                          : formatPrice(order.shippingFee)}
                      </span>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">

                      <span className="font-extrabold text-gray-900">
                        Total
                      </span>

                      <span className="text-2xl font-extrabold text-indigo-600">
                        {formatPrice(order.totalAmount)}
                      </span>

                    </div>

                  </div>

                </section>

                {/* Payment */}
                <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">

                  <h2 className="text-lg font-extrabold text-gray-900">
                    Payment Information
                  </h2>

                  <div className="mt-5 rounded-2xl bg-slate-50 p-5 space-y-4">

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Payment Status
                      </span>

                      <span className="text-sm font-bold text-gray-900">
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        Payment Method
                      </span>

                      <span className="text-sm font-bold text-gray-900">
                        Cash on Delivery
                      </span>
                    </div>

                  </div>

                </section>

              </div>

              {/* Delivery Address */}
              <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

                <div className="flex items-start gap-4">

                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-lg font-extrabold text-gray-900">
                      Delivery Address
                    </h2>

                    <div className="mt-4 text-sm text-gray-600 leading-6">

                      <p className="font-bold text-gray-900">
                        {order.shippingRecipientName}
                      </p>

                      <p>
                        {order.shippingStreet1}
                      </p>

                      <p>
                        {order.shippingCity},{' '}
                        {order.shippingState}{' '}
                        {order.shippingPostalCode}
                      </p>

                      <p>
                        {order.shippingCountry}
                      </p>

                      <p className="mt-2 inline-flex items-center gap-2 font-medium text-gray-700">
                        <Phone className="w-4 h-4" />
                        {order.shippingPhone}
                      </p>

                    </div>

                  </div>

                </div>

              </section>

            </div>
          )}

        </div>
      </main>
    </>
  );
};

export default OrderDetailsPage;