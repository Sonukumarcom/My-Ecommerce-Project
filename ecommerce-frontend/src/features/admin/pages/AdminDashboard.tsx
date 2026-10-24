import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Loader2,
  Package,
  RefreshCw,
  ShieldCheck,
  Truck,
  Users,
} from 'lucide-react';
import { adminService } from '../services/adminService';
import type {
  AdminCustomer,
  AdminOrder,
} from '../services/adminService';

type OrderStatus =
  | 'PENDING'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

const nextStatusMap: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: 'PROCESSING',
  PROCESSING: 'SHIPPED',
  SHIPPED: 'DELIVERED',
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'Pending';

    case 'PROCESSING':
      return 'Processing';

    case 'SHIPPED':
      return 'Shipped';

    case 'DELIVERED':
      return 'Delivered';

    case 'CANCELLED':
      return 'Cancelled';

    case 'REFUNDED':
      return 'Refunded';

    default:
      return status;
  }
};

const getStatusClasses = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-amber-50 text-amber-700 border-amber-200';

    case 'PROCESSING':
      return 'bg-blue-50 text-blue-700 border-blue-200';

    case 'SHIPPED':
      return 'bg-violet-50 text-violet-700 border-violet-200';

    case 'DELIVERED':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';

    case 'CANCELLED':
      return 'bg-red-50 text-red-700 border-red-200';

    case 'REFUNDED':
      return 'bg-gray-100 text-gray-700 border-gray-200';

    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatDate = (value: string) => {
  return new Date(value).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const getCustomerStatusClasses = (active: boolean) => {
  return active
    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
    : 'bg-red-50 text-red-700 border-red-200';
};

export const AdminDashboard: React.FC = () => {
  // =========================
  // ORDERS STATE
  // =========================

  const [orders, setOrders] = useState<AdminOrder[]>([]);

  // =========================
  // CUSTOMERS STATE
  // =========================

  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [customerTotal, setCustomerTotal] = useState(0);

  // =========================
  // COMMON STATE
  // =========================

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // =========================
  // LOAD ORDERS + CUSTOMERS
  // =========================

  const loadDashboard = async (showRefreshLoader = false) => {
    try {
      setErrorMessage(null);

      if (showRefreshLoader) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const [ordersResponse, customersResponse] =
        await Promise.all([
          adminService.getAllOrders(0, 50),
          adminService.getAllCustomers(0, 50),
        ]);

      // =========================
      // ORDERS
      // =========================

      if (ordersResponse.success) {
        setOrders(ordersResponse.data.content);
      } else {
        setErrorMessage(
          ordersResponse.message ||
            'Unable to load orders.'
        );
      }

      // =========================
      // CUSTOMERS
      // =========================

      if (customersResponse.success) {
        setCustomers(customersResponse.data.content);
        setCustomerTotal(
          customersResponse.data.totalElements
        );
      } else {
        setErrorMessage(
          customersResponse.message ||
            'Unable to load customers.'
        );
      }
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          'Unable to load admin dashboard data.'
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // =========================
  // ORDER STATISTICS
  // =========================

  const statistics = useMemo(() => {
    return {
      total: orders.length,

      pending: orders.filter(
        (order) => order.orderStatus === 'PENDING'
      ).length,

      processing: orders.filter(
        (order) => order.orderStatus === 'PROCESSING'
      ).length,

      shipped: orders.filter(
        (order) => order.orderStatus === 'SHIPPED'
      ).length,

      delivered: orders.filter(
        (order) => order.orderStatus === 'DELIVERED'
      ).length,
    };
  }, [orders]);

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const updateStatus = async (
    order: AdminOrder,
    newStatus: OrderStatus
  ) => {
    try {
      setUpdatingOrder(order.orderNumber);
      setErrorMessage(null);

      const updatedOrder =
        await adminService.updateOrderStatus(
          order.orderNumber,
          newStatus
        );

      setOrders((currentOrders) =>
        currentOrders.map((currentOrder) =>
          currentOrder.orderNumber ===
          order.orderNumber
            ? updatedOrder
            : currentOrder
        )
      );
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message ||
          'Unable to update order status.'
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">
                    AuraStore
                  </p>

                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                    Admin Dashboard
                  </h1>

                </div>

              </div>

              <p className="mt-2 text-sm text-slate-500">
                Manage orders, customers and delivery status
                from one place.
              </p>

            </div>

            <button
              type="button"
              onClick={() => loadDashboard(true)}
              disabled={isRefreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  isRefreshing ? 'animate-spin' : ''
                }`}
              />

              Refresh
            </button>

          </div>

        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* ===================================================== */}
        {/* ERROR */}
        {/* ===================================================== */}

        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">

            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />

            <div>

              <p className="font-semibold">
                Something went wrong
              </p>

              <p className="mt-1 text-sm">
                {errorMessage}
              </p>

            </div>

          </div>
        )}

        {/* ===================================================== */}
        {/* STATISTICS */}
        {/* ===================================================== */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">

          <StatCard
            icon={<Package className="h-5 w-5" />}
            label="Total Orders"
            value={statistics.total}
          />

          <StatCard
            icon={<Users className="h-5 w-5" />}
            label="Customers"
            value={customerTotal}
          />

          <StatCard
            icon={<Clock3 className="h-5 w-5" />}
            label="Pending"
            value={statistics.pending}
          />

          <StatCard
            icon={<Loader2 className="h-5 w-5" />}
            label="Processing"
            value={statistics.processing}
          />

          <StatCard
            icon={<Truck className="h-5 w-5" />}
            label="Shipped"
            value={statistics.shipped}
          />

          <StatCard
            icon={<CheckCircle2 className="h-5 w-5" />}
            label="Delivered"
            value={statistics.delivered}
          />

        </section>

        {/* ===================================================== */}
        {/* ALL ORDERS */}
        {/* ===================================================== */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  All Orders
                </h2>

                <p className="text-sm text-slate-500">
                  View customer details and manage order status.
                </p>

              </div>

              <div className="text-sm font-semibold text-slate-600">
                {orders.length} orders
              </div>

            </div>

          </div>

          {isLoading ? (

            <div className="flex min-h-80 items-center justify-center">

              <div className="flex flex-col items-center gap-3">

                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

                <p className="text-sm text-slate-500">
                  Loading dashboard...
                </p>

              </div>

            </div>

          ) : orders.length === 0 ? (

            <div className="flex min-h-80 items-center justify-center px-6 text-center">

              <div>

                <Package className="mx-auto h-10 w-10 text-slate-300" />

                <h3 className="mt-3 font-semibold text-slate-900">
                  No orders yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Customer orders will appear here.
                </p>

              </div>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-[1250px] w-full text-left">

                <thead className="bg-slate-50">

                  <tr className="border-b border-slate-200">

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Order
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Product
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Total
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Payment
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {orders.map((order) => {

                    const nextStatus =
                      nextStatusMap[
                        order.orderStatus as OrderStatus
                      ];

                    const isUpdating =
                      updatingOrder ===
                      order.orderNumber;

                    return (

                      <tr
                        key={order.id}
                        className="transition hover:bg-slate-50/80"
                      >

                        {/* ORDER */}

                        <td className="px-5 py-5 align-top">

                          <div className="font-bold text-slate-900">
                            {order.orderNumber}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            {formatDate(order.placedAt)}
                          </div>

                        </td>

                        {/* CUSTOMER */}

                        <td className="px-5 py-5 align-top">

                          <div className="font-semibold text-slate-900">
                            {order.customerName || 'N/A'}
                          </div>

                          <div className="mt-1 text-sm text-slate-500">
                            {order.customerEmail}
                          </div>

                        </td>

                        {/* CONTACT */}

                        <td className="px-5 py-5 align-top">

                          <div className="text-sm font-medium text-slate-800">
                            {order.customerPhone || 'N/A'}
                          </div>

                          <div className="mt-2 max-w-[220px] text-xs leading-5 text-slate-500">

                            {order.shippingStreet1}
                            {', '}
                            {order.shippingCity}
                            {', '}
                            {order.shippingState}
                            {', '}
                            {order.shippingPostalCode}

                          </div>

                        </td>

                        {/* PRODUCT */}

                        <td className="px-5 py-5 align-top">

                          <div className="max-w-[240px] space-y-2">

                            {order.items.map((item) => (

                              <div
                                key={`${order.id}-${item.productSku}`}
                                className="rounded-xl border border-slate-100 bg-slate-50 p-3"
                              >

                                <div className="font-semibold text-slate-900">
                                  {item.productName}
                                </div>

                                <div className="mt-1 text-xs text-slate-500">
                                  SKU: {item.productSku}
                                </div>

                                <div className="mt-2 text-xs font-medium text-slate-600">
                                  Qty: {item.quantity} ×{' '}
                                  {formatCurrency(
                                    item.unitPrice
                                  )}
                                </div>

                              </div>

                            ))}

                          </div>

                        </td>

                        {/* TOTAL */}

                        <td className="px-5 py-5 align-top">

                          <div className="font-bold text-slate-900">
                            {formatCurrency(
                              order.totalAmount
                            )}
                          </div>

                          <div className="mt-1 text-xs text-slate-500">
                            GST:{' '}
                            {formatCurrency(
                              order.taxAmount
                            )}
                          </div>

                        </td>

                        {/* PAYMENT */}

                        <td className="px-5 py-5 align-top">

                          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">
                            {order.paymentStatus}
                          </span>

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-5 align-top">

                          <span
                            className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-bold ${getStatusClasses(
                              order.orderStatus
                            )}`}
                          >
                            {getStatusLabel(
                              order.orderStatus
                            )}
                          </span>

                        </td>

                        {/* ACTION */}

                        <td className="px-5 py-5 align-top">

                          {nextStatus ? (

                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus(
                                  order,
                                  nextStatus
                                )
                              }
                              className="inline-flex min-w-[145px] items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                            >

                              {isUpdating ? (

                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Updating...
                                </>

                              ) : (

                                <>
                                  Move to{' '}
                                  {getStatusLabel(
                                    nextStatus
                                  )}
                                </>

                              )}

                            </button>

                          ) : (

                            <span className="text-xs font-semibold text-slate-400">
                              No action
                            </span>

                          )}

                        </td>

                      </tr>

                    );

                  })}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* ===================================================== */}
        {/* ALL CUSTOMERS */}
        {/* ===================================================== */}

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-200 px-5 py-4">

            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  All Customers
                </h2>

                <p className="text-sm text-slate-500">
                  View registered customer accounts and activity.
                </p>

              </div>

              <div className="text-sm font-semibold text-slate-600">
                {customerTotal} customers
              </div>

            </div>

          </div>

          {isLoading ? (

            <div className="flex min-h-64 items-center justify-center">

              <div className="flex flex-col items-center gap-3">

                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />

                <p className="text-sm text-slate-500">
                  Loading customers...
                </p>

              </div>

            </div>

          ) : customers.length === 0 ? (

            <div className="flex min-h-64 items-center justify-center px-6 text-center">

              <div>

                <Users className="mx-auto h-10 w-10 text-slate-300" />

                <h3 className="mt-3 font-semibold text-slate-900">
                  No customers yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Registered customers will appear here.
                </p>

              </div>

            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="min-w-[1050px] w-full text-left">

                <thead className="bg-slate-50">

                  <tr className="border-b border-slate-200">

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Customer
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Role
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Account
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Orders
                    </th>

                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Joined
                    </th>

                  </tr>

                </thead>

                <tbody className="divide-y divide-slate-100">

                  {customers.map((customer) => (

                    <tr
                      key={customer.id}
                      className="transition hover:bg-slate-50/80"
                    >

                      {/* CUSTOMER */}

                      <td className="px-5 py-5 align-top">

                        <div className="font-semibold text-slate-900">
                          {customer.name || 'N/A'}
                        </div>

                        <div className="mt-1 text-sm text-slate-500">
                          ID: #{customer.id}
                        </div>

                      </td>

                      {/* CONTACT */}

                      <td className="px-5 py-5 align-top">

                        <div className="text-sm font-medium text-slate-800">
                          {customer.email}
                        </div>

                        <div className="mt-1 text-sm text-slate-500">
                          {customer.phoneNumber || 'No phone number'}
                        </div>

                      </td>

                      {/* ROLE */}

                      <td className="px-5 py-5 align-top">

                        <span className="inline-flex rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-700">
                          {customer.roles || 'ROLE_USER'}
                        </span>

                      </td>

                      {/* ACCOUNT STATUS */}

                      <td className="px-5 py-5 align-top">

                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${getCustomerStatusClasses(
                            customer.active
                          )}`}
                        >
                          {customer.active
                            ? 'Active'
                            : 'Inactive'}
                        </span>

                      </td>

                      {/* TOTAL ORDERS */}

                      <td className="px-5 py-5 align-top">

                        <span className="text-sm font-bold text-slate-900">
                          {customer.totalOrders}
                        </span>

                      </td>

                      {/* JOINED */}

                      <td className="px-5 py-5 align-top">

                        <div className="text-sm font-medium text-slate-800">
                          {formatDate(
                            customer.createdAt
                          )}
                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* ===================================================== */}
        {/* SECURITY NOTE */}
        {/* ===================================================== */}

        <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4">

          <div className="flex items-start gap-3">

            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" />

            <div>

              <p className="text-sm font-bold text-indigo-900">
                Admin access
              </p>

              <p className="mt-1 text-xs leading-5 text-indigo-800">
                This dashboard is protected by the backend
                admin role. Customer passwords are never
                displayed here.
              </p>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};


// =====================================================
// STAT CARD
// =====================================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
}) => {

  return (

    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>

        <span className="text-2xl font-bold text-slate-900">
          {value}
        </span>

      </div>

      <p className="mt-4 text-sm font-medium text-slate-500">
        {label}
      </p>

    </div>

  );
};

export default AdminDashboard;