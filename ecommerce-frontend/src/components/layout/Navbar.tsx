
import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  User as UserIcon,
  Menu,
  LogOut,
  Package,
  ShieldCheck,
  ChevronDown,
  X,
  ArrowRight,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
}) => {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const toggleCart = useCartStore((state) => state.toggleCart);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const isAdmin = user?.roles?.includes('ROLE_ADMIN');
  const isCatalogPage = location.pathname === '/catalog';

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const query = searchQuery.trim();
    if (!query) return;

    setIsMobileSearchOpen(false);
    navigate(`/catalog?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
    navigate('/');
  };

  const searchForm = (mobile = false) => (
    <form
      onSubmit={handleSearchSubmit}
      className="relative w-full"
    >
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors" />

      <input
        type="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={
          mobile
            ? 'Search AuraStore...'
            : 'Search products, brands and categories...'
        }
        aria-label="Search products"
        className="w-full rounded-2xl border border-gray-200/80 bg-gray-50/90 py-3 pl-11 pr-12 text-sm text-gray-800 outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-indigo-200 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
      />

      <button
        type="submit"
        aria-label="Submit search"
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl bg-indigo-600 text-white transition-all hover:bg-indigo-700 active:scale-95"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-white/90 shadow-sm shadow-slate-900/[0.03] backdrop-blur-2xl">
      <div className="mx-auto max-w-[1600px] px-3 sm:px-6 lg:px-8">
        <div className="flex h-[68px] items-center justify-between gap-3 sm:gap-5">
          {/* BRAND */}
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="rounded-xl p-2.5 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-700 active:scale-95 lg:hidden"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link to="/" className="group flex items-center gap-2.5">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 group-hover:-rotate-3 group-hover:scale-105">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" />
              </div>

              <div>
                <div className="text-lg font-black leading-none tracking-tight text-gray-950 sm:text-xl">
                  PSRS <span className="text-indigo-600"> Shop</span>
                </div>
                <div className="mt-1 hidden text-[9px] font-bold uppercase tracking-[0.2em] text-gray-400 sm:block">
                  Modern Commerce
                </div>
              </div>
            </Link>
          </div>

          {/* DESKTOP SEARCH */}
          <div className="hidden max-w-xl flex-1 md:block">
            {searchForm()}
          </div>

          {/* NAV ACTIONS */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <Link
              to="/catalog"
              className={`hidden items-center rounded-xl px-4 py-2.5 text-sm font-bold transition-all duration-200 lg:inline-flex ${
                isCatalogPage
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-700'
              }`}
            >
              Catalog
            </Link>

            {/* MOBILE SEARCH */}
            <button
              type="button"
              onClick={() =>
                setIsMobileSearchOpen((current) => !current)
              }
              className={`rounded-xl p-2.5 transition-all md:hidden ${
                isMobileSearchOpen
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-700'
              }`}
              aria-label={isMobileSearchOpen ? 'Close search' : 'Open search'}
              aria-expanded={isMobileSearchOpen}
            >
              {isMobileSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>

            {/* CART */}
            <button
              type="button"
              onClick={toggleCart}
              className="group relative rounded-xl p-2.5 text-gray-600 transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 active:scale-95"
              aria-label={`Open cart, ${cartItemCount} items`}
            >
              <ShoppingBag className="h-5 w-5 transition-transform group-hover:-rotate-6" />

              {cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-black text-white ring-2 ring-white">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </button>

            {/* AUTHENTICATED USER */}
            {isAuthenticated && user ? (
              <div className="relative ml-1">
                <button
                  type="button"
                  onClick={() =>
                    setIsDropdownOpen((current) => !current)
                  }
                  className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-1.5 pr-2 transition-all hover:border-indigo-200 hover:bg-indigo-50/50 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 sm:pr-3"
                  aria-expanded={isDropdownOpen}
                  aria-label="Open account menu"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-violet-100 text-sm font-black uppercase text-indigo-700">
                    {user.firstName?.[0] || 'U'}
                  </div>

                  <span className="hidden max-w-[100px] truncate text-xs font-bold text-gray-700 sm:block">
                    {user.firstName}
                  </span>

                  <ChevronDown
                    className={`hidden h-4 w-4 text-gray-400 transition-transform sm:block ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-10 cursor-default"
                      aria-label="Close account menu"
                      onClick={() => setIsDropdownOpen(false)}
                    />

                    <div className="absolute right-0 top-full z-20 mt-3 w-64 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-slate-900/10 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="border-b border-gray-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-base font-black uppercase text-white shadow-md shadow-indigo-600/20">
                            {user.firstName?.[0] || 'U'}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-extrabold text-gray-900">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="truncate text-xs text-gray-500">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="p-2">
                        <Link
                          to="/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          <UserIcon className="h-4 w-4" />
                          Account Profile
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 rounded-xl bg-amber-50 px-3 py-2.5 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                          >
                            <ShieldCheck className="h-4 w-4" />
                            Admin Portal
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-gray-100 p-2">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* GUEST ACTIONS */
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="hidden rounded-xl px-3 py-2.5 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-700 sm:inline-flex"
                >
                  Sign In
                </Link>

                <Link
                  to="/register"
                  className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-600/25 active:translate-y-0 sm:px-4 sm:text-sm"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE SEARCH */}
        {isMobileSearchOpen && (
          <div className="border-t border-gray-100 py-3 md:hidden">
            {searchForm(true)}
          </div>
        )}
      </div>
    </header>
  );
};
