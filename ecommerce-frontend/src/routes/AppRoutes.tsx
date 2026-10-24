import React from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Truck,
  Headphones,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';


import { Navbar } from '../components/layout/Navbar';
import { Sidebar } from '../components/layout/Sidebar';

import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { CatalogPage } from '../features/products/pages/CatalogPage';
import { CustomerDashboard } from '../features/dashboard/pages/CustomerDashboard';
import { CartPage } from '../features/cart/pages/CartPage';
import { CheckoutPage } from '../features/checkout/pages/CheckoutPage';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { CartDrawer } from '../components/cart/CartDrawer';
import { CartToast } from '../components/cart/CartToast';
import { useAuthStore } from '../store/useAuthStore';
import { MyOrdersPage } from '../features/orders/pages/MyOrdersPage';
import { OrderDetailsPage } from '../features/orders/pages/OrderDetailsPage';
import { ProductDetailsPage } from '../features/products/pages/ProductDetailsPage';
import AdminRoute from './AdminRoute';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const isAuthenticated =
    useAuthStore(
      (state) => state.isAuthenticated
    );

  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname +
            location.search,
        }}
      />
    );
  }

  return <>{children}</>;
};

const HomePage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] =
    React.useState(false);

  const [selectedCategory, setSelectedCategory] =
    React.useState('');

  return (
    <div className="min-h-screen bg-slate-50">

      {/* =====================================================
          NAVBAR
      ====================================================== */}
      <Navbar
        onToggleSidebar={() =>
          setIsSidebarOpen(true)
        }
      />

      {/* =====================================================
          LAYOUT
      ====================================================== */}
      <div className="flex">

        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() =>
            setIsSidebarOpen(false)
          }
          selectedCategorySlug={selectedCategory}
          onSelectCategory={(slug) =>
            setSelectedCategory(slug)
          }
        />

        <main className="flex-1 min-w-0">

          {/* =================================================
              HERO SECTION
          ================================================= */}
          <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-violet-900 text-white">

            {/* Decorative shapes */}
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-32 -left-20 w-80 h-80 bg-indigo-400/10 rounded-full blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-20 lg:py-24">

              <div className="grid lg:grid-cols-2 gap-12 items-center">

                {/* Hero Text */}
                <div>

                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-indigo-100 text-xs font-semibold backdrop-blur-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    Welcome to AuraStore
                  </div>

                  <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                    Discover.
                    <br />
                    Shop.
                    <br />
                    <span className="text-indigo-300">
                      Love it.
                    </span>
                  </h1>

                  <p className="mt-6 max-w-xl text-base sm:text-lg text-indigo-100 leading-relaxed">
                    Discover products you'll love, from everyday
                    essentials to the latest trends — all in one
                    beautiful shopping experience.
                  </p>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3">

                    <a
                      href="/catalog"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition-all shadow-xl"
                    >
                      Shop Now
                      <ArrowRight className="w-4 h-4" />
                    </a>

                    <a
                      href="/catalog"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-semibold text-sm hover:bg-white/15 transition-all"
                    >
                      Explore Categories
                    </a>

                  </div>

                  {/* Mini stats */}
                  <div className="mt-10 flex flex-wrap gap-8">

                    <div>
                      <p className="text-2xl font-extrabold">
                        5+
                      </p>
                      <p className="text-xs text-indigo-200">
                        Categories
                      </p>
                    </div>

                    <div>
                      <p className="text-2xl font-extrabold">
                        100%
                      </p>
                      <p className="text-xs text-indigo-200">
                        Secure Shopping
                      </p>
                    </div>

                    <div>
                      <p className="text-2xl font-extrabold">
                        24/7
                      </p>
                      <p className="text-xs text-indigo-200">
                        Customer Support
                      </p>
                    </div>

                  </div>

                </div>

                {/* Hero Visual */}
                <div className="hidden lg:flex justify-end">

                  <div className="relative w-full max-w-lg">

                    {/* Main Card */}
                    <div className="relative rounded-[2rem] overflow-hidden bg-white/10 border border-white/10 backdrop-blur-sm p-4 shadow-2xl">

                      <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=80"
                        alt="AuraStore shopping"
                        className="w-full h-[420px] object-cover rounded-[1.5rem]"
                      />

                      <div className="absolute left-8 bottom-8 right-8 bg-white/95 backdrop-blur-md rounded-2xl p-4 text-gray-900 shadow-xl">

                        <div className="flex items-center justify-between">

                          <div>
                            <p className="text-xs text-gray-400 font-medium">
                              Featured Collection
                            </p>

                            <p className="mt-1 text-sm font-extrabold">
                              Everything you need
                            </p>
                          </div>

                          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5" />
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </div>
          </section>

          {/* =================================================
    PREMIUM CATEGORY CARDS
================================================== */}
<section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16">

  {/* Section Header */}
  <div className="flex items-end justify-between mb-8">

    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
        Explore Collections
      </p>

      <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
        Shop by Category
      </h2>

      <p className="mt-2 text-sm text-gray-500">
        Find everything you need in one place.
      </p>
    </div>

    <a
      href="/catalog"
      className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
    >
      View All
      <ChevronRight className="w-4 h-4" />
    </a>

  </div>

  {/* Category Cards */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

    {/* Electronics */}
    <a
      href="/catalog?category=electronics"
      className="group relative h-72 overflow-hidden rounded-[1.75rem] bg-gray-900 shadow-sm hover:shadow-2xl transition-all duration-500"
    >

      <img
        src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80"
        alt="Electronics"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute top-5 left-5">
        <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
          Trending
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

        <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">
          Smart Tech
        </p>

        <h3 className="mt-1 text-2xl font-extrabold">
          Electronics
        </h3>

        <p className="mt-1 text-sm text-white/70">
          Phones, laptops & gadgets
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
          Shop Now
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>

      </div>

    </a>

    {/* Fashion */}
    <a
      href="/catalog?category=fashion"
      className="group relative h-72 overflow-hidden rounded-[1.75rem] bg-gray-900 shadow-sm hover:shadow-2xl transition-all duration-500"
    >

      <img
        src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80"
        alt="Fashion"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute top-5 left-5">
        <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
          New Styles
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

        <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">
          Latest Trends
        </p>

        <h3 className="mt-1 text-2xl font-extrabold">
          Fashion
        </h3>

        <p className="mt-1 text-sm text-white/70">
          Everyday & premium styles
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
          Shop Now
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>

      </div>

    </a>

    {/* Home & Kitchen */}
    <a
      href="/catalog?category=home-kitchen"
      className="group relative h-72 overflow-hidden rounded-[1.75rem] bg-gray-900 shadow-sm hover:shadow-2xl transition-all duration-500"
    >

      <img
        src="https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800&q=80"
        alt="Home and Kitchen"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute top-5 left-5">
        <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
          Home Picks
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

        <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">
          Make It Beautiful
        </p>

        <h3 className="mt-1 text-2xl font-extrabold">
          Home & Kitchen
        </h3>

        <p className="mt-1 text-sm text-white/70">
          Essentials for your space
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
          Shop Now
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>

      </div>

    </a>

    {/* Sports */}
    <a
      href="/catalog?category=sports"
      className="group relative h-72 overflow-hidden rounded-[1.75rem] bg-gray-900 shadow-sm hover:shadow-2xl transition-all duration-500"
    >

      <img
        src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"
        alt="Sports"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute top-5 left-5">
        <span className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold uppercase tracking-wider">
          Stay Active
        </span>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

        <p className="text-xs text-white/70 uppercase tracking-widest font-semibold">
          Fitness & More
        </p>

        <h3 className="mt-1 text-2xl font-extrabold">
          Sports
        </h3>

        <p className="mt-1 text-sm text-white/70">
          Gear for your active life
        </p>

        <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold">
          Shop Now
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>

      </div>

    </a>

  </div>

  {/* Mobile View All */}
  <div className="mt-6 sm:hidden">
    <a
      href="/catalog"
      className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600"
    >
      View All Categories
      <ChevronRight className="w-4 h-4" />
    </a>
  </div>

</section>

<FeaturedProducts />

          {/* =================================================
              PROMO BANNER
          ================================================== */}
          <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 pb-14">

            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-600 to-indigo-600 text-white p-7 sm:p-10">

              <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-white/10" />
              <div className="absolute right-20 -bottom-24 w-64 h-64 rounded-full bg-white/5" />

              <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-7">

                <div>

                  <span className="inline-flex px-3 py-1 rounded-full bg-white/15 text-xs font-bold">
                    LIMITED TIME OFFER
                  </span>

                  <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold">
                    Save more on your next order
                  </h2>

                  <p className="mt-2 text-sm text-indigo-100">
                    Enjoy exclusive deals across selected products.
                  </p>

                </div>

                <a
                  href="/catalog"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-indigo-700 text-sm font-bold hover:bg-indigo-50 transition-colors whitespace-nowrap"
                >
                  Start Shopping
                  <ArrowRight className="w-4 h-4" />
                </a>

              </div>

            </div>

          </section>

          {/* =================================================
              WHY AURASTORE
          ================================================== */}
          <section className="bg-white border-y border-gray-100">

            <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14">

              <div className="text-center max-w-2xl mx-auto">

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                  Why AuraStore
                </p>

                <h2 className="mt-2 text-2xl sm:text-3xl font-extrabold text-gray-900">
                  Shopping made simple
                </h2>

                <p className="mt-3 text-sm text-gray-500">
                  Everything you need for a smooth and enjoyable
                  shopping experience.
                </p>

              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Feature 1 */}
                <div className="rounded-3xl bg-slate-50 border border-gray-100 p-7">

                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>

                  <h3 className="mt-5 text-base font-extrabold text-gray-900">
                    Secure Shopping
                  </h3>

                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    Your account and shopping experience are
                    protected with modern security practices.
                  </p>

                </div>

                {/* Feature 2 */}
                <div className="rounded-3xl bg-slate-50 border border-gray-100 p-7">

                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Truck className="w-6 h-6" />
                  </div>

                  <h3 className="mt-5 text-base font-extrabold text-gray-900">
                    Fast Delivery
                  </h3>

                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    Choose standard or express delivery during
                    checkout based on your needs.
                  </p>

                </div>

                {/* Feature 3 */}
                <div className="rounded-3xl bg-slate-50 border border-gray-100 p-7">

                  <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
                    <Headphones className="w-6 h-6" />
                  </div>

                  <h3 className="mt-5 text-base font-extrabold text-gray-900">
                    Customer Support
                  </h3>

                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                    A clean and simple experience from product
                    discovery to final checkout.
                  </p>

                </div>

              </div>

            </div>

          </section>

          {/* =================================================
              FINAL CTA
          ================================================== */}
          <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-14">

            <div className="rounded-[2rem] bg-gray-900 text-white p-8 sm:p-12 text-center">

              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7" />
              </div>

              <h2 className="mt-5 text-2xl sm:text-3xl font-extrabold">
                Ready to discover your next favorite product?
              </h2>

              <p className="mt-3 max-w-xl mx-auto text-sm text-gray-400">
                Explore the catalog and start building your bag.
              </p>

              <a
                href="/catalog"
                className="mt-7 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold transition-colors"
              >
                Explore Catalog
                <ArrowRight className="w-4 h-4" />
              </a>

            </div>

          </section>

        </main>
      </div>
    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* Home */}
        <Route
          path="/"
          element={<HomePage />}
        />

        {/* Catalog */}
        <Route
          path="/catalog"
          element={<CatalogPage />}
        />
<Route
  path="/product/:slug"
  element={<ProductDetailsPage />}
/>
        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={<CustomerDashboard />}
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={<CartPage />}
        />
        <Route
  path="/orders"
  element={
    <ProtectedRoute>
      <MyOrdersPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/orders/:orderNumber"
  element={
    <ProtectedRoute>
      <OrderDetailsPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <CheckoutPage />
    </ProtectedRoute>
  }
/>

        {/* Login */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<RegisterPage />}
        />
<Route element={<AdminRoute />}>
  <Route
    path="/admin"
    element={<AdminDashboard />}
  />
</Route>
      </Routes>
      
{/* Global Cart Drawer */}
<CartDrawer />

<CartToast />
    </BrowserRouter>
  );
};

export default AppRoutes;