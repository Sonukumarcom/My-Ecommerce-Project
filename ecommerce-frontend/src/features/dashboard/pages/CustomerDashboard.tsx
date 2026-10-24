import React from 'react';
import {
  Package,
  Clock,
  MapPin,
  CreditCard,
  ChevronRight,
  Sparkles,
  Truck,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';

import { useAuthStore } from '../../../store/useAuthStore';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuthStore();

  const mockRecentOrder = {
    orderNumber: 'ORD-98B2A10C',
    date: 'March 28, 2025',
    status: 'In Transit',
    total: 349.99,
    itemsCount: 2,
    carrier: 'FedEx Express',
    trackingNumber: 'FX-982183921',
    estimatedDelivery: 'Tomorrow by 4:00 PM',
  };

  const statCards = [
    {
      title: 'Total Orders',
      value: '18',
      sub: '3 this month',
      icon: Package,
      color: 'text-indigo-600 bg-indigo-50',
    },
    {
      title: 'Reward AuraPoints',
      value: '1,450',
      sub: '≈ $14.50 reward value',
      icon: Sparkles,
      color: 'text-amber-600 bg-amber-50',
    },
    {
      title: 'Saved Addresses',
      value: '2 Locations',
      sub: '1 Primary shipping',
      icon: MapPin,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Active Payment Cards',
      value: '2 Stored',
      sub: 'Visa & Mastercard',
      icon: CreditCard,
      color: 'text-violet-600 bg-violet-50',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

        {/* Welcome Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">

          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              AuraStore VIP Member
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Hello, {user?.firstName || 'Valued Shopper'} 👋
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your current package shipments, track payment history,
              and update profile settings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/catalog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-all"
            >
              Browse Catalog
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          {statCards.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={index}
                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {stat.title}
                  </p>

                  <p className="text-xl font-bold text-gray-900 mt-0.5">
                    {stat.value}
                  </p>

                  <p className="text-[11px] text-gray-500">
                    {stat.sub}
                  </p>
                </div>
              </div>
            );
          })}

        </div>

        {/* Live Active Shipment Tracking */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm mb-8">

          <div className="flex items-center justify-between pb-6 border-b border-gray-100">

            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Live Package Update
              </span>

              <h2 className="text-lg font-bold text-gray-900 mt-0.5">
                Order #{mockRecentOrder.orderNumber}
              </h2>
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              {mockRecentOrder.status}
            </span>

          </div>

          <div className="py-6 grid grid-cols-1 md:grid-cols-3 gap-6">

            <div>
              <p className="text-xs text-gray-400 font-medium">
                Estimated Arrival
              </p>

              <p className="text-sm font-bold text-gray-900 mt-1">
                {mockRecentOrder.estimatedDelivery}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium">
                Shipping Carrier & Tracking
              </p>

              <p className="text-sm font-semibold text-gray-900 mt-1">
                {mockRecentOrder.carrier}
                {' '}
                (
                <span className="text-indigo-600 font-mono text-xs">
                  {mockRecentOrder.trackingNumber}
                </span>
                )
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400 font-medium">
                Order Total
              </p>

              <p className="text-sm font-bold text-gray-900 mt-1">
                ${mockRecentOrder.total}
                {' '}
                ({mockRecentOrder.itemsCount} items)
              </p>
            </div>

          </div>

          {/* Stepper Timeline */}
          <div className="relative pt-4">

            <div className="flex items-center justify-between text-xs font-semibold">

              <div className="flex items-center gap-2 text-indigo-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmed</span>
              </div>

              <div className="flex items-center gap-2 text-indigo-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Packed</span>
              </div>

              <div className="flex items-center gap-2 text-indigo-600">
                <Truck className="w-4 h-4 animate-bounce" />
                <span>Out for Delivery</span>
              </div>

              <div className="flex items-center gap-2 text-gray-400">
                <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                <span>Delivered</span>
              </div>

            </div>

            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-indigo-600 h-full w-3/4 rounded-full" />
            </div>

          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Addresses */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-indigo-100 transition-colors">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Manage Delivery Addresses
                </h3>

                <p className="text-xs text-gray-500 mt-0.5">
                  Primary: 742 Evergreen Terrace, Springfield
                </p>
              </div>

            </div>

            <a
              href="/profile/addresses"
              className="p-2 rounded-xl text-gray-400 hover:text-indigo-600 hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5" />
            </a>

          </div>

          {/* Orders */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-indigo-100 transition-colors">

            <div className="flex items-center gap-4">

              <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Order & Invoices History
                </h3>

                <p className="text-xs text-gray-500 mt-0.5">
                  Download receipts & return requests
                </p>
              </div>

            </div>

            <a
              href="/orders"
              className="p-2 rounded-xl text-gray-400 hover:text-violet-600 hover:bg-gray-50"
            >
              <ChevronRight className="w-5 h-5" />
            </a>

          </div>

        </div>

      </div>
    </div>
  );
};