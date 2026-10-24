
import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Link,
} from 'react-router-dom';
import {
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Truck,
  Headphones,
  Sparkles,
  ShoppingBag,
  Zap,
  Star,
  Heart,
  TrendingUp,
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
  const isAuthenticated = useAuthStore(
    (state) => state.isAuthenticated
  );

  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
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
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900">
      <Navbar
        onToggleSidebar={() => setIsSidebarOpen(true)}
      />

    <div className="relative flex w-full min-w-0">
 {/* SIDEBAR: MOBILE ONLY */}
<div className="lg:hidden">
  <Sidebar
    isOpen={isSidebarOpen}
    onClose={() => setIsSidebarOpen(false)}
    selectedCategorySlug={selectedCategory}
    onSelectCategory={(slug) => {
      setSelectedCategory(slug);
    }}
  />
</div>

  <main className="min-w-0 flex-1" >

          {/* HERO SECTION */}
          <section className="aura-hero relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 text-white">
            <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-blue-400/20 blur-3xl" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(129,140,248,0.18),transparent_55%)]" />

            <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-10">

                {/* HERO CONTENT */}
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-indigo-100 shadow-lg backdrop-blur-md">
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    Welcome to AuraStore
                    <span className="ml-1 h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                  </div>

                  <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                    Discover.
                    <br />
                    Shop.
                    <br />
                    <span className="bg-gradient-to-r from-blue-300 via-indigo-300 to-violet-300 bg-clip-text text-transparent">
                      Love it.
                    </span>
                  </h1>

                  <p className="mt-6 max-w-xl text-base leading-7 text-indigo-100/90 sm:text-lg sm:leading-8">
                    Discover products you'll love, from everyday
                    essentials to the latest trends — all in one
                    beautiful shopping experience.
                  </p>

                  <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                    <Link
                      to="/catalog"
                      className="aura-animated-button group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-extrabold text-indigo-800 shadow-xl transition-all hover:bg-indigo-50"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Shop Now
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>

                    <Link
                      to="/catalog"
                      className="aura-animated-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-md hover:bg-white/20"
                    >
                      Explore Categories
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>

                  {/* STATS */}
                  <div className="mt-10 grid max-w-lg grid-cols-3 gap-3 sm:gap-4">
                    <div className="aura-glass-card rounded-2xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-sm sm:p-4">
                      <p className="text-xl font-black sm:text-2xl">
                        5+
                      </p>
                      <p className="mt-1 text-[11px] text-indigo-200 sm:text-xs">
                        Categories
                      </p>
                    </div>

                    <div className="aura-glass-card rounded-2xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-sm sm:p-4">
                      <p className="text-xl font-black sm:text-2xl">
                        100%
                      </p>
                      <p className="mt-1 text-[11px] text-indigo-200 sm:text-xs">
                        Secure Shopping
                      </p>
                    </div>

                    <div className="aura-glass-card rounded-2xl border border-white/10 bg-white/[0.07] p-3 backdrop-blur-sm sm:p-4">
                      <p className="text-xl font-black sm:text-2xl">
                        24/7
                      </p>
                      <p className="mt-1 text-[11px] text-indigo-200 sm:text-xs">
                        Customer Support
                      </p>
                    </div>
                  </div>
                </div>

                {/* HERO IMAGE */}
                <div className="flex justify-center lg:justify-end">
                  <div className="aura-hero-image group relative w-full max-w-lg">
                    <div className="absolute -inset-3 rounded-[2.5rem] bg-gradient-to-r from-violet-500/40 to-indigo-400/40 opacity-70 blur-2xl transition duration-500 group-hover:opacity-100" />

                    <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur-md sm:p-4">
                      <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1000&q=80"
                        alt="AuraStore shopping collection"
                        loading="eager"
                        className="h-64 w-full rounded-[1.5rem] object-cover transition-transform duration-700 group-hover:scale-105 sm:h-80 lg:h-[420px]"
                      />

                      <div className="pointer-events-none absolute inset-3 rounded-[1.5rem] bg-gradient-to-t from-black/50 via-transparent to-transparent sm:inset-4" />

                      <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/70 bg-white/95 p-3 text-gray-900 shadow-xl backdrop-blur-md sm:bottom-7 sm:left-7 sm:right-7 sm:p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="text-xs font-semibold text-indigo-600">
                              FEATURED COLLECTION
                            </p>
                            <p className="mt-1 text-base font-black sm:text-lg">
                              Everything you need
                            </p>
                            <p className="mt-1 text-xs text-gray-500">
                              Discover your everyday favorites.
                            </p>
                          </div>

                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
                            <ShoppingBag className="h-6 w-6" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="aura-floating-badge absolute -right-2 -top-3 hidden items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-xs font-bold text-white shadow-xl backdrop-blur-xl sm:flex lg:-right-5">
                      <Sparkles className="h-4 w-4 text-amber-300" />
                      Discover something new
                    </div>

                    <div className="aura-floating-badge aura-floating-badge-delay absolute -bottom-5 -left-2 hidden items-center gap-2 rounded-2xl border border-white/20 bg-slate-900/90 px-4 py-3 text-xs font-bold text-white shadow-xl sm:flex lg:-left-5">
                      <Zap className="h-4 w-4 text-yellow-300" />
                      Your next favorite is here
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* CATEGORY SECTION */}
          <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10" id="categories" >
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                  Explore Collections
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                  Shop by Category
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Find everything you need in one place.
                </p>
              </div>

              <Link
                to="/catalog"
                className="hidden items-center gap-1 whitespace-nowrap text-sm font-bold text-indigo-600 transition-colors hover:text-indigo-800 sm:inline-flex"
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

              {/* ELECTRONICS */}
              <Link
                to="/catalog?category=electronics"
                className="aura-category-card group relative h-72 overflow-hidden rounded-[1.75rem] bg-gray-900 shadow-md"
              >
                <img
                  src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80"
                  alt="Electronics"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-colors duration-500 group-hover:from-indigo-950/95" />

                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                  <TrendingUp className="mr-1 inline h-3.5 w-3.5" />
                  Trending
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                    Smart Tech
                  </p>
                  <h3 className="mt-1 text-2xl font-black">
                    Electronics
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    Phones, laptops & gadgets
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold">
                    Shop Now
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>

              {/* FASHION */}
              <Link
                to="/catalog?category=fashion"
                className="aura-category-card group relative h-72 overflow-hidden rounded-[1.75rem] bg-gray-900 shadow-md"
              >
                <img
                  src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80"
                  alt="Fashion"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-colors duration-500 group-hover:from-pink-950/95" />

                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                  <Star className="mr-1 inline h-3.5 w-3.5" />
                  New Styles
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                    Latest Trends
                  </p>
                  <h3 className="mt-1 text-2xl font-black">
                    Fashion
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    Everyday & premium styles
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold">
                    Shop Now
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>

              {/* HOME & KITCHEN */}
              <Link
                to="/catalog?category=home-kitchen"
                className="aura-category-card group relative h-72 overflow-hidden rounded-[1.75rem] bg-gray-900 shadow-md"
              >
                <img
                  src="https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=800&q=80"
                  alt="Home and Kitchen"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-colors duration-500 group-hover:from-amber-950/95" />

                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                  Home Picks
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                    Make It Beautiful
                  </p>
                  <h3 className="mt-1 text-2xl font-black">
                    Home & Kitchen
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    Essentials for your space
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold">
                    Shop Now
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>

              {/* SPORTS */}
              <Link
                to="/catalog?category=sports"
                className="aura-category-card group relative h-72 overflow-hidden rounded-[1.75rem] bg-gray-900 shadow-md"
              >
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80"
                  alt="Sports and fitness"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent transition-colors duration-500 group-hover:from-emerald-950/95" />

                <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-white backdrop-blur-md">
                  Stay Active
                </span>

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                    Fitness & More
                  </p>
                  <h3 className="mt-1 text-2xl font-black">
                    Sports
                  </h3>
                  <p className="mt-1 text-sm text-white/80">
                    Gear for your active life
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-extrabold">
                    Shop Now
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
                  </div>
                </div>
              </Link>

            </div>

            <div className="mt-6 sm:hidden">
              <Link
                to="/catalog"
                className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600"
              >
                View All Categories
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* FEATURED PRODUCTS: EXISTING COMPONENT */}
          <FeaturedProducts />

          {/* PROMO BANNER */}
          <section className="mx-auto max-w-7xl px-5 pb-14 sm:px-8 lg:px-10">
            <div className="aura-promo relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-r from-violet-700 via-indigo-600 to-blue-600 p-7 text-white shadow-xl sm:p-10">

              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10 blur-sm" />
              <div className="pointer-events-none absolute -bottom-24 right-20 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.18),transparent_55%)]" />

              <div className="relative flex flex-col justify-between gap-7 md:flex-row md:items-center">
                <div>
                  <span className="aura-promo-badge inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/15 px-3 py-1.5 text-xs font-black">
                    <Zap className="h-3.5 w-3.5 text-yellow-300" />
                    LIMITED TIME OFFER
                  </span>

                  <h2 className="mt-4 text-2xl font-black sm:text-3xl">
                    Save more on your next order
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-indigo-100">
                    Enjoy exclusive deals across selected products.
                  </p>
                </div>

                <Link
                  to="/catalog"
                  className="aura-animated-button inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-6 py-3.5 text-sm font-black text-indigo-700 shadow-lg hover:bg-indigo-50"
                >
                  Start Shopping
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

          {/* WHY AURASTORE */}
          <section className="border-y border-gray-100 bg-white">
            <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">

              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">
                  Why AuraStore
                </p>

                <h2 className="mt-2 text-2xl font-black text-gray-900 sm:text-3xl">
                  Shopping made simple
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-500">
                  Everything you need for a smooth and enjoyable
                  shopping experience.
                </p>
              </div>

              <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">

                {/* SECURE SHOPPING */}
                <div className="aura-feature-card group rounded-3xl border border-gray-100 bg-slate-50 p-7 hover:border-indigo-100 hover:bg-white">
                  <div className="aura-feature-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600">
                    <ShieldCheck className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-base font-black text-gray-900">
                    Secure Shopping
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Your account and shopping experience are
                    protected with modern security practices.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-bold text-indigo-600">
                    <ShieldCheck className="h-4 w-4" />
                    Shop with confidence
                  </div>
                </div>

                {/* FAST DELIVERY */}
                <div className="aura-feature-card group rounded-3xl border border-gray-100 bg-slate-50 p-7 hover:border-emerald-100 hover:bg-white">
                  <div className="aura-feature-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                    <Truck className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-base font-black text-gray-900">
                    Fast Delivery
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    Choose standard or express delivery during
                    checkout based on your needs.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-bold text-emerald-600">
                    <Truck className="h-4 w-4" />
                    Delivery options at checkout
                  </div>
                </div>

                {/* CUSTOMER SUPPORT */}
                <div className="aura-feature-card group rounded-3xl border border-gray-100 bg-slate-50 p-7 hover:border-violet-100 hover:bg-white">
                  <div className="aura-feature-icon flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                    <Headphones className="h-6 w-6" />
                  </div>

                  <h3 className="mt-5 text-base font-black text-gray-900">
                    Customer Support
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-gray-500">
                    A clean and simple experience from product
                    discovery to final checkout.
                  </p>

                  <div className="mt-5 flex items-center gap-2 text-xs font-bold text-violet-600">
                    <Heart className="h-4 w-4" />
                    Your experience matters
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* FINAL CALL TO ACTION */}
          <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-16 lg:px-10">
            <div className="aura-final-cta relative isolate overflow-hidden rounded-[2rem] bg-gray-950 p-8 text-center text-white sm:p-12">

              <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-indigo-600/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-64 w-64 rounded-full bg-violet-600/25 blur-3xl" />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(79,70,229,0.12),transparent_65%)]" />

              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10">
                  <ShoppingBag className="h-7 w-7" />
                </div>

                <p className="mt-5 text-xs font-black uppercase tracking-[0.2em] text-indigo-300">
                  Your next discovery awaits
                </p>

                <h2 className="mx-auto mt-3 max-w-3xl text-2xl font-black sm:text-3xl lg:text-4xl">
                  Ready to discover your next favorite product?
                </h2>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-400">
                  Explore the catalog and start building your bag.
                </p>

                <Link
                  to="/catalog"
                  className="aura-animated-button mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-black text-white hover:bg-indigo-500"
                >
                  Explore Catalog
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>

        </main>
      </div>
      
          {/* AURASTORE FOOTER */}
          <footer className="relative overflow-hidden bg-slate-950 text-slate-300">
            {/* Background glow */}
            <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-indigo-600/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-violet-600/15 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-5 pt-14 sm:px-8 sm:pt-16 lg:px-10">

              {/* Main footer columns */}
              <div className="grid grid-cols-1 gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-4">

                {/* Brand */}
                <div>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-3"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/20">
                      <ShoppingBag className="h-6 w-6" />
                    </div>

                    <div>
                      <span className="block text-2xl font-black tracking-tight text-white">
                        PSRS<span className="text-indigo-400"> Shop</span>
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                        Shop. Discover. Love.
                      </span>
                    </div>
                  </Link>

                  <p className="mt-5 max-w-xs text-sm leading-7 text-slate-400">
                    Discover your everyday favorites with a smooth,
                    simple and enjoyable online shopping experience.
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Your shopping journey starts here
                  </div>
                </div>

                {/* Quick links */}
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">
                    Quick Links
                  </h3>

                  <ul className="mt-5 space-y-3 text-sm">
                    <li>
                      <Link
                        to="/"
                        className="inline-flex items-center gap-2 transition-colors hover:text-indigo-400"
                      >
                        <ChevronRight className="h-4 w-4" />
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/catalog"
                        className="inline-flex items-center gap-2 transition-colors hover:text-indigo-400"
                      >
                        <ChevronRight className="h-4 w-4" />
                        All Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/cart"
                        className="inline-flex items-center gap-2 transition-colors hover:text-indigo-400"
                      >
                        <ChevronRight className="h-4 w-4" />
                        Shopping Cart
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/orders"
                        className="inline-flex items-center gap-2 transition-colors hover:text-indigo-400"
                      >
                        <ChevronRight className="h-4 w-4" />
                        My Orders
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/login"
                        className="inline-flex items-center gap-2 transition-colors hover:text-indigo-400"
                      >
                        <ChevronRight className="h-4 w-4" />
                        Sign In
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">
                    Shop Categories
                  </h3>

                  <ul className="mt-5 space-y-3 text-sm">
                    <li>
                      <Link
                        to="/catalog?category=electronics"
                        className="transition-colors hover:text-indigo-400"
                      >
                        Electronics
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/catalog?category=fashion"
                        className="transition-colors hover:text-indigo-400"
                      >
                        Fashion
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/catalog?category=home-kitchen"
                        className="transition-colors hover:text-indigo-400"
                      >
                        Home & Kitchen
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/catalog?category=beauty"
                        className="transition-colors hover:text-indigo-400"
                      >
                        Beauty
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/catalog?category=sports"
                        className="transition-colors hover:text-indigo-400"
                      >
                        Sports
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Developer contact */}
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-widest text-white">
                    Connect with Developer
                  </h3>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-indigo-400/30">
                    <p className="text-lg font-black text-white">
                      Sonu Kumar
                    </p>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Full Stack Java Developer
                    </p>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Java · Spring Boot · React · SQL
                    </p>

                    <div className="mt-5 flex flex-col gap-3">
                      <a
                        href="https://github.com/Sonukumarcom"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-white"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-5 w-5"
                            aria-hidden="true"
                          >
                            <path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.29-1.24-1.63-1.24-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.98 1.95 3.3 1.95.47 0 .86-.05 1.19-.15.1-.72.39-1.21.7-1.49-2.47-.28-5.06-1.24-5.06-5.51 0-1.22.43-2.21 1.14-2.99-.11-.28-.5-1.42.11-2.96 0 0 .93-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.12-1.44 3.05-1.14 3.05-1.14.61 1.54.22 2.68.11 2.96.71.78 1.14 1.77 1.14 2.99 0 4.28-2.6 5.22-5.08 5.5.4.35.75 1.02.75 2.06v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" />
                          </svg>
                        </span>

                        <span className="flex-1">
                          <span className="block">GitHub</span>
                          <span className="block text-xs font-normal text-slate-500">
                            Explore my projects
                          </span>
                        </span>

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>

                      <a
                        href="https://www.linkedin.com/in/sonu-kumar-833292347/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm font-semibold text-slate-200 transition-all hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-white"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/15 text-sm font-black text-blue-400">
                          in
                        </span>

                        <span className="flex-1">
                          <span className="block">LinkedIn</span>
                          <span className="block text-xs font-normal text-slate-500">
                            Connect professionally
                          </span>
                        </span>

                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer bottom */}
              <div className="flex flex-col gap-4 border-t border-white/10 py-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  © {new Date().getFullYear()} PSRS Shop. All rights reserved.
                </p>

                <p className="flex flex-wrap items-center gap-2">
                  Crafted with
                  <Heart className="h-3.5 w-3.5 fill-pink-500 text-pink-500" />
                  by
                  <span className="font-bold text-slate-300">
                    Sonu Kumar
                  </span>
                </p>

                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-1 font-semibold text-indigo-400 transition-colors hover:text-indigo-300"
                >
                  Start Shopping
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </footer>

    </div>
  );
};

const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/catalog" element={<CatalogPage />} />

        <Route
          path="/product/:slug"
          element={<ProductDetailsPage />}
        />

        <Route
          path="/dashboard"
          element={<CustomerDashboard />}
        />

        <Route path="/cart" element={<CartPage />} />

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

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>
      </Routes>

      <CartDrawer />
      <CartToast />
    </BrowserRouter>
  );
};

export default AppRoutes;
