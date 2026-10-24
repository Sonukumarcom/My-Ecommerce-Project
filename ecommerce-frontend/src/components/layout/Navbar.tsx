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
} from 'lucide-react';

import {
  useLocation,
} from 'react-router-dom';

import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleSidebar,
}) => {
  const location = useLocation();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuthStore();

  const cartItems = useCartStore(
    (state) => state.items
  );

  const toggleCart = useCartStore(
    (state) => state.toggleCart
  );

  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);

  const [isMobileSearchOpen, setIsMobileSearchOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState('');

  const cartItemCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  const isAdmin =
    user?.roles?.includes('ROLE_ADMIN');

  const isCatalogPage =
    location.pathname === '/catalog';

  /* =========================================================
     SEARCH
  ========================================================= */

  const handleSearchSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    const query =
      searchQuery.trim();

    if (!query) {
      return;
    }

    window.location.href =
      `/catalog?search=${encodeURIComponent(query)}`;
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-xl">

      {/* =====================================================
          DESKTOP / MAIN NAV
      ====================================================== */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="flex h-16 items-center justify-between gap-3">

          {/* =================================================
              LEFT
          ================================================== */}

          <div className="flex items-center gap-2.5">

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={onToggleSidebar}
              className="rounded-xl p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 lg:hidden"
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Brand */}
            <a
              href="/"
              className="group flex items-center gap-2"
            >

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-200 transition-transform duration-300 group-hover:scale-105">
                <ShoppingBag className="h-5 w-5" />
              </div>

              <div className="hidden xs:block sm:block">

                <div className="text-lg font-black tracking-tight text-gray-900 leading-none">
                  Aura
                  <span className="text-indigo-600">
                    Store
                  </span>
                </div>

                <div className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                  Modern Commerce
                </div>

              </div>

            </a>

          </div>

          {/* =================================================
              DESKTOP SEARCH
          ================================================== */}

          <div className="hidden flex-1 max-w-xl md:flex">

            <form
              onSubmit={
                handleSearchSubmit
              }
              className="relative w-full"
            >

              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search products, brands and categories..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />

            </form>

          </div>

          {/* =================================================
              RIGHT ACTIONS
          ================================================== */}

          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* Desktop Catalog */}
            <a
              href="/catalog"
              className={`hidden rounded-xl px-3 py-2 text-sm font-semibold transition-colors lg:inline-flex ${
                isCatalogPage
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-indigo-600'
              }`}
            >
              Catalog
            </a>

            {/* Mobile Search */}
            <button
              type="button"
              onClick={() =>
                setIsMobileSearchOpen(
                  (current) => !current
                )
              }
              className="rounded-xl p-2.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-indigo-600 md:hidden"
              aria-label="Toggle search"
            >
              {isMobileSearchOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </button>

            {/* Cart */}
            <button
              type="button"
              onClick={toggleCart}
              className="group relative rounded-xl p-2.5 text-gray-600 transition-all hover:bg-indigo-50 hover:text-indigo-600"
              aria-label="Open shopping cart"
            >

              <ShoppingBag className="h-5 w-5 transition-transform duration-300 group-hover:scale-105" />

              {cartItemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 animate-pulse items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-black text-white ring-2 ring-white">
                  {cartItemCount > 99
                    ? '99+'
                    : cartItemCount}
                </span>
              )}

            </button>

            {/* =================================================
                USER
            ================================================== */}

            {isAuthenticated && user ? (

              <div className="relative">

                <button
                  type="button"
                  onClick={() =>
                    setIsDropdownOpen(
                      (current) => !current
                    )
                  }
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-2 py-1.5 transition-all hover:border-indigo-200 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-indigo-50 sm:px-2.5"
                >

                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-xs font-black uppercase text-indigo-700">
                    {user.firstName?.[0] ||
                      'U'}
                  </div>

                  <span className="hidden max-w-[90px] truncate text-xs font-bold text-gray-700 sm:block">
                    {user.firstName}
                  </span>

                  <ChevronDown
                    className={`hidden h-3.5 w-3.5 text-gray-400 transition-transform sm:block ${
                      isDropdownOpen
                        ? 'rotate-180'
                        : ''
                    }`}
                  />

                </button>

                {isDropdownOpen && (
                  <>

                    {/* Overlay */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() =>
                        setIsDropdownOpen(
                          false
                        )
                      }
                    />

                    {/* Dropdown */}
                    <div className="absolute right-0 top-full z-20 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl shadow-gray-300/30">

                      {/* User Header */}
                      <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm font-black uppercase text-indigo-700 shadow-sm">
                            {user.firstName?.[0] ||
                              'U'}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-bold text-gray-900">
                              {user.firstName}{' '}
                              {user.lastName}
                            </p>

                            <p className="truncate text-xs text-gray-500">
                              {user.email}
                            </p>

                          </div>

                        </div>

                      </div>

                      {/* Profile */}
                      <a
                        href="/profile"
                        onClick={() =>
                          setIsDropdownOpen(
                            false
                          )
                        }
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-indigo-600"
                      >
                        <UserIcon className="h-4 w-4 text-gray-400" />
                        Account Profile
                      </a>

                      {/* Orders */}
                      <a
                        href="/orders"
                        onClick={() =>
                          setIsDropdownOpen(
                            false
                          )
                        }
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-indigo-600"
                      >
                        <Package className="h-4 w-4 text-gray-400" />
                        My Orders
                      </a>

                      {/* Admin */}
                      {isAdmin && (
                        <a
                          href="/admin"
                          onClick={() =>
                            setIsDropdownOpen(
                              false
                            )
                          }
                          className="flex items-center gap-3 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700 transition-colors hover:bg-amber-100"
                        >
                          <ShieldCheck className="h-4 w-4 text-amber-600" />
                          Admin Portal
                        </a>
                      )}

                      {/* Logout */}
                      <div className="border-t border-gray-100">

                        <button
                          type="button"
                          onClick={
                            handleLogout
                          }
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
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

              /* =================================================
                 GUEST
              ================================================== */

              <div className="flex items-center gap-1.5">

                <a
                  href="/login"
                  className="hidden rounded-xl px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600 sm:inline-flex"
                >
                  Sign In
                </a>

                <a
                  href="/register"
                  className="rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-md sm:px-4 sm:text-sm"
                >
                  Get Started
                </a>

              </div>

            )}

          </div>

        </div>

        {/* =====================================================
            MOBILE SEARCH BAR
        ====================================================== */}

        {isMobileSearchOpen && (
          <div className="border-t border-gray-100 py-3 md:hidden">

            <form
              onSubmit={
                handleSearchSubmit
              }
              className="relative"
            >

              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search AuraStore..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
              />

            </form>

          </div>
        )}

      </div>

    </header>
  );
};