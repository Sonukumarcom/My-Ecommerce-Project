import React, { useState } from 'react';

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  Lock,
  MapPin,
  Package,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Truck,
  User,
  X,
  Zap,
} from 'lucide-react';

import { Link } from 'react-router-dom';

import { Navbar } from '../../../components/layout/Navbar';

import { useCartStore } from '../../../store/useCartStore';

import { useAuthStore } from '../../../store/useAuthStore';

import { apiClient } from '../../../config/api.config';

type CheckoutStep =
  | 'shipping'
  | 'payment'
  | 'review';

type ShippingMethod =
  | 'standard'
  | 'express';

type PaymentMethod =
  | 'card'
  | 'upi'
  | 'cod';

interface ShippingData {
  recipientName: string;
  phoneNumber: string;
  streetAddress1: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
}

export const CheckoutPage: React.FC = () => {
  /* =========================================================
     STORES
  ========================================================= */

  const items = useCartStore(
    (state) => state.items
  );

  const getSubtotal = useCartStore(
    (state) => state.getSubtotal
  );

  const clearCart = useCartStore(
    (state) => state.clearCart
  );

  const { user } = useAuthStore();

  /* =========================================================
     CHECKOUT STATE
  ========================================================= */

  const [step, setStep] =
    useState<CheckoutStep>('shipping');

  const [shippingMethod, setShippingMethod] =
    useState<ShippingMethod>('standard');

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>('upi');

  const [isLoading, setIsLoading] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState('');

  const [orderComplete, setOrderComplete] =
    useState<string | null>(null);

  /* =========================================================
     SHIPPING FORM
  ========================================================= */

  const [shippingData, setShippingData] =
    useState<ShippingData>({
      recipientName: user
        ? `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
        : '',
      phoneNumber: '',
      streetAddress1: '',
      city: '',
      stateProvince: '',
      postalCode: '',
      country: 'India',
    });

  /* =========================================================
     PAYMENT FORM
  ========================================================= */

  const [cardData, setCardData] =
    useState({
      cardNumber: '',
      cardHolder: '',
      expiry: '',
      cvv: '',
    });

  const [upiId, setUpiId] =
    useState('');

  /* =========================================================
     PROMO
  ========================================================= */

  const [promoCode, setPromoCode] =
    useState('');

  const [promoApplied, setPromoApplied] =
    useState(false);

  const [promoError, setPromoError] =
    useState('');

  /* =========================================================
     PRICE CALCULATIONS
  ========================================================= */

  const subtotal = getSubtotal();

  const discountAmount = promoApplied
    ? subtotal * 0.2
    : 0;

  const discountedSubtotal =
    subtotal - discountAmount;

  const shippingFee =
    shippingMethod === 'express'
      ? 199
      : discountedSubtotal >= 5000
        ? 0
        : 100;

  const taxAmount =
    discountedSubtotal * 0.18;

  const grandTotal =
    discountedSubtotal +
    shippingFee +
    taxAmount;

  /* =========================================================
     FORMAT PRICE
  ========================================================= */

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  /* =========================================================
     FREE SHIPPING PROGRESS
  ========================================================= */

  const freeShippingProgress =
    Math.min(
      (discountedSubtotal / 5000) * 100,
      100
    );

  const amountForFreeShipping =
    Math.max(
      5000 - discountedSubtotal,
      0
    );

  /* =========================================================
     FORM VALIDATION
  ========================================================= */

  const validateShipping = () => {
    if (
      !shippingData.recipientName.trim() ||
      !shippingData.phoneNumber.trim() ||
      !shippingData.streetAddress1.trim() ||
      !shippingData.city.trim() ||
      !shippingData.stateProvince.trim() ||
      !shippingData.postalCode.trim()
    ) {
      setErrorMessage(
        'Please complete all required shipping fields.'
      );

      return false;
    }

    return true;
  };

  const validatePayment = () => {
    if (paymentMethod === 'upi') {
      if (!upiId.trim()) {
        setErrorMessage(
          'Please enter your UPI ID.'
        );

        return false;
      }

      return true;
    }

    if (paymentMethod === 'card') {
      if (
        !cardData.cardNumber.trim() ||
        !cardData.cardHolder.trim() ||
        !cardData.expiry.trim() ||
        !cardData.cvv.trim()
      ) {
        setErrorMessage(
          'Please complete all card details.'
        );

        return false;
      }

      return true;
    }

    return true;
  };

  /* =========================================================
     PROMO
  ========================================================= */

  const handleApplyPromo = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setPromoError('');

    const normalizedCode =
      promoCode.trim().toUpperCase();

    if (!normalizedCode) {
      setPromoApplied(false);

      setPromoError(
        'Please enter a promo code.'
      );

      return;
    }

    if (normalizedCode === 'SPRING20') {
      setPromoCode('SPRING20');
      setPromoApplied(true);
      setPromoError('');

      return;
    }

    setPromoApplied(false);

    setPromoError(
      'Invalid promo code. Try SPRING20.'
    );
  };

  const removePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoError('');
  };

  /* =========================================================
     NEXT STEP
  ========================================================= */

  const handleContinue = () => {
    setErrorMessage('');

    if (step === 'shipping') {
      if (!validateShipping()) {
        return;
      }

      setStep('payment');
      return;
    }

    if (step === 'payment') {
      if (!validatePayment()) {
        return;
      }

      setStep('review');
      return;
    }
  };

  /* =========================================================
     BACK STEP
  ========================================================= */

  const handleBack = () => {
    setErrorMessage('');

    if (step === 'payment') {
      setStep('shipping');
      return;
    }

    if (step === 'review') {
      setStep('payment');
    }
  };

  /* =========================================================
     PLACE ORDER
  ========================================================= */

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setErrorMessage(
        'Your shopping bag is empty.'
      );

      return;
    }

    setIsLoading(true);
    setErrorMessage('');

  const orderPayload = {
  recipientName: shippingData.recipientName,
  phoneNumber: shippingData.phoneNumber,
  streetAddress1: shippingData.streetAddress1,
  streetAddress2: '',
  city: shippingData.city,
  stateProvince: shippingData.stateProvince,
  postalCode: shippingData.postalCode,
  country: shippingData.country,

  items: items.map((i) => ({
    productId: i.productId,
    quantity: i.quantity,
  })),
};

    try {
      const response =
        await apiClient.post(
          '/orders',
          orderPayload
        );

      const generatedOrderNumber =
        response.data?.data?.orderNumber ||
        `ORD-${Math.random()
          .toString(36)
          .substring(2, 10)
          .toUpperCase()}`;

      clearCart();

      setOrderComplete(
        generatedOrderNumber
      );
  } catch (error) {
  console.error(
    'Order placement failed:',
    error
  );

  setErrorMessage(
    'Order could not be placed. Please try again.'
  );
} finally {
      setIsLoading(false);
    }
  };

  /* =========================================================
     EMPTY CART
  ========================================================= */

  if (
    items.length === 0 &&
    !orderComplete
  ) {
    return (
      <div className="min-h-screen bg-slate-50">

        <Navbar />

        <div className="mx-auto flex min-h-[75vh] max-w-2xl items-center justify-center px-4">

          <div className="w-full rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-xl sm:p-12">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50">
              <ShoppingBag className="h-9 w-9 text-indigo-500" />
            </div>

            <h1 className="mt-6 text-2xl font-black text-gray-900">
              Your bag is empty
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Add some products to your shopping bag before proceeding to checkout.
            </p>

            <Link
              to="/catalog"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>

          </div>

        </div>

      </div>
    );
  }

  /* =========================================================
     ORDER SUCCESS
  ========================================================= */

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-slate-50">

        <Navbar />

        <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-2xl items-center justify-center px-4 py-12">

          <div className="w-full rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-2xl sm:p-10">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2 className="h-11 w-11 text-emerald-600" />
            </div>

            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <Check className="h-3.5 w-3.5" />
              Order Processing
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-gray-900">
              Thank you for your order!
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Your order request has been processed successfully.
            </p>

            <div className="mt-7 rounded-2xl border border-gray-100 bg-gray-50 p-5 text-left">

              <div className="flex items-center justify-between gap-4">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Order Reference
                  </p>

                  <p className="mt-1 font-mono text-sm font-black text-gray-900">
                    {orderComplete}
                  </p>
                </div>

                <Package className="h-6 w-6 text-indigo-500" />

              </div>

            </div>

            {orderComplete.startsWith('DEMO-') && (
              <p className="mt-4 rounded-xl bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-700">
                Demo confirmation generated because the order API was unavailable. This reference does not confirm a database order.
              </p>
            )}

            <div className="mt-7 grid gap-3 sm:grid-cols-2">

              <Link
                to="/catalog"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Continue Shopping
              </Link>

              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700"
              >
                Back to Home
                <ArrowRight className="h-4 w-4" />
              </Link>

            </div>

          </div>

        </main>

      </div>
    );
  }

  /* =========================================================
     STEP HELPERS
  ========================================================= */

  const stepNumber = {
    shipping: 1,
    payment: 2,
    review: 3,
  }[step];

  const stepTitle = {
    shipping: 'Shipping Address',
    payment: 'Payment Method',
    review: 'Review & Place Order',
  }[step];

  const stepDescription = {
    shipping:
      'Where should we deliver your order?',
    payment:
      'Choose a secure payment method.',
    review:
      'Review everything before placing your order.',
  }[step];

  return (
    <div className="min-h-screen bg-slate-50 pb-20">

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* =====================================================
          HEADER
      ====================================================== */}

      <section className="border-b border-gray-100 bg-white">

        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-indigo-600">
                <Lock className="h-3.5 w-3.5" />
                Secure Checkout
              </div>

              <h1 className="mt-3 text-2xl font-black tracking-tight text-gray-950 sm:text-3xl">
                Complete Your Order
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                A simple, secure and seamless checkout experience.
              </p>

            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Secure Checkout
            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          STEP INDICATOR
      ====================================================== */}

      <div className="border-b border-gray-100 bg-white">

        <div className="mx-auto max-w-3xl px-4 py-5 sm:px-6">

          <div className="flex items-center justify-between">

            {/* Shipping */}
            <div className="flex items-center gap-2">

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${
                  stepNumber > 1
                    ? 'bg-emerald-500 text-white'
                    : step === 'shipping'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-gray-100 text-gray-500'
                }`}
              >
                {stepNumber > 1 ? (
                  <Check className="h-4 w-4" />
                ) : (
                  '1'
                )}
              </div>

              <span
                className={`hidden text-xs font-bold sm:inline ${
                  step === 'shipping'
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                Shipping
              </span>

            </div>

            <div className="mx-2 h-0.5 flex-1 bg-gray-200 sm:mx-4" />

            {/* Payment */}
            <div className="flex items-center gap-2">

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${
                  stepNumber > 2
                    ? 'bg-emerald-500 text-white'
                    : step === 'payment'
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-gray-100 text-gray-500'
                }`}
              >
                {stepNumber > 2 ? (
                  <Check className="h-4 w-4" />
                ) : (
                  '2'
                )}
              </div>

              <span
                className={`hidden text-xs font-bold sm:inline ${
                  step === 'payment'
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                Payment
              </span>

            </div>

            <div className="mx-2 h-0.5 flex-1 bg-gray-200 sm:mx-4" />

            {/* Review */}
            <div className="flex items-center gap-2">

              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${
                  step === 'review'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                3
              </div>

              <span
                className={`hidden text-xs font-bold sm:inline ${
                  step === 'review'
                    ? 'text-gray-900'
                    : 'text-gray-400'
                }`}
              >
                Review
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">

        <div className="grid gap-7 lg:grid-cols-[1fr_380px]">

          {/* =================================================
              LEFT
          ================================================== */}

          <section>

            <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-7">

              {/* Step Title */}
              <div className="mb-7">

                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                  Step {stepNumber} of 3
                </p>

                <h2 className="mt-1 text-xl font-black text-gray-900">
                  {stepTitle}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {stepDescription}
                </p>

              </div>

              {/* =================================================
                  SHIPPING
              ================================================== */}

              {step === 'shipping' && (
                <div className="space-y-6">

                  {/* Contact */}
                  <div>

                    <div className="mb-4 flex items-center gap-2">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50">
                        <User className="h-4 w-4 text-indigo-600" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          Contact Information
                        </h3>

                        <p className="text-xs text-gray-400">
                          We use this for delivery updates.
                        </p>
                      </div>

                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">

                      <div className="sm:col-span-2">

                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                          Full Name
                        </label>

                        <input
                          type="text"
                          value={
                            shippingData.recipientName
                          }
                          onChange={(e) =>
                            setShippingData(
                              (current) => ({
                                ...current,
                                recipientName:
                                  e.target.value,
                              })
                            )
                          }
                          placeholder="Enter your full name"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        />

                      </div>

                      <div className="sm:col-span-2">

                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                          Mobile Number
                        </label>

                        <input
                          type="tel"
                          value={
                            shippingData.phoneNumber
                          }
                          onChange={(e) =>
                            setShippingData(
                              (current) => ({
                                ...current,
                                phoneNumber:
                                  e.target.value,
                              })
                            )
                          }
                          placeholder="Enter mobile number"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        />

                      </div>

                    </div>

                  </div>

                  {/* Address */}
                  <div className="border-t border-gray-100 pt-6">

                    <div className="mb-4 flex items-center gap-2">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
                        <MapPin className="h-4 w-4 text-violet-600" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          Delivery Address
                        </h3>

                        <p className="text-xs text-gray-400">
                          Enter the address where your order should arrive.
                        </p>
                      </div>

                    </div>

                    <div className="grid gap-4">

                      <div>

                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                          Street Address
                        </label>

                        <input
                          type="text"
                          value={
                            shippingData.streetAddress1
                          }
                          onChange={(e) =>
                            setShippingData(
                              (current) => ({
                                ...current,
                                streetAddress1:
                                  e.target.value,
                              })
                            )
                          }
                          placeholder="House / Flat / Street"
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                        />

                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">

                        <div>

                          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                            City
                          </label>

                          <input
                            type="text"
                            value={
                              shippingData.city
                            }
                            onChange={(e) =>
                              setShippingData(
                                (current) => ({
                                  ...current,
                                  city:
                                    e.target.value,
                                })
                              )
                            }
                            placeholder="City"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                          />

                        </div>

                        <div>

                          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                            State
                          </label>

                          <input
                            type="text"
                            value={
                              shippingData.stateProvince
                            }
                            onChange={(e) =>
                              setShippingData(
                                (current) => ({
                                  ...current,
                                  stateProvince:
                                    e.target.value,
                                })
                              )
                            }
                            placeholder="State"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                          />

                        </div>

                        <div>

                          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                            PIN Code
                          </label>

                          <input
                            type="text"
                            value={
                              shippingData.postalCode
                            }
                            onChange={(e) =>
                              setShippingData(
                                (current) => ({
                                  ...current,
                                  postalCode:
                                    e.target.value,
                                })
                              )
                            }
                            placeholder="6-digit PIN"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-800 outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                          />

                        </div>

                        <div>

                          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                            Country
                          </label>

                          <input
                            type="text"
                            value={
                              shippingData.country
                            }
                            onChange={(e) =>
                              setShippingData(
                                (current) => ({
                                  ...current,
                                  country:
                                    e.target.value,
                                })
                              )
                            }
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-3 text-sm text-gray-800 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                          />

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* Shipping Method */}
                  <div className="border-t border-gray-100 pt-6">

                    <div className="mb-4 flex items-center gap-2">

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                        <Truck className="h-4 w-4 text-emerald-600" />
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          Delivery Speed
                        </h3>

                        <p className="text-xs text-gray-400">
                          Select your preferred delivery option.
                        </p>
                      </div>

                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">

                      {/* Standard */}
                      <button
                        type="button"
                        onClick={() =>
                          setShippingMethod(
                            'standard'
                          )
                        }
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          shippingMethod ===
                          'standard'
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <p className="text-sm font-bold text-gray-900">
                              Standard Delivery
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              3–5 business days
                            </p>

                          </div>

                          <span className="text-xs font-black text-indigo-600">
                            {discountedSubtotal >=
                            5000
                              ? 'FREE'
                              : '₹100'}
                          </span>

                        </div>

                        {shippingMethod ===
                          'standard' && (
                          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                            <Check className="h-3.5 w-3.5" />
                            Selected
                          </div>
                        )}

                      </button>

                      {/* Express */}
                      <button
                        type="button"
                        onClick={() =>
                          setShippingMethod(
                            'express'
                          )
                        }
                        className={`rounded-2xl border p-4 text-left transition-all ${
                          shippingMethod ===
                          'express'
                            ? 'border-indigo-600 bg-indigo-50/50 shadow-sm'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >

                        <div className="flex items-start justify-between gap-3">

                          <div>

                            <p className="text-sm font-bold text-gray-900">
                              Express Delivery
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              1–2 business days
                            </p>

                          </div>

                          <span className="text-xs font-black text-indigo-600">
                            ₹199
                          </span>

                        </div>

                        {shippingMethod ===
                          'express' && (
                          <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                            <Check className="h-3.5 w-3.5" />
                            Selected
                          </div>
                        )}

                      </button>

                    </div>

                  </div>

                </div>
              )}

              {/* =================================================
                  PAYMENT
              ================================================== */}

              {step === 'payment' && (
                <div className="space-y-6">

                  <div className="grid gap-3 sm:grid-cols-3">

                    {/* UPI */}
                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          'upi'
                        )
                      }
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        paymentMethod ===
                        'upi'
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700 text-xs font-black">
                        UPI
                      </div>

                      <p className="mt-3 text-sm font-bold text-gray-900">
                        UPI
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        PhonePe, GPay, Paytm
                      </p>

                    </button>

                    {/* Card */}
                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          'card'
                        )
                      }
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        paymentMethod ===
                        'card'
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100">
                        <CreditCard className="h-4 w-4 text-violet-700" />
                      </div>

                      <p className="mt-3 text-sm font-bold text-gray-900">
                        Card
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Credit / Debit Card
                      </p>

                    </button>

                    {/* COD */}
                    <button
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          'cod'
                        )
                      }
                      className={`rounded-2xl border p-4 text-left transition-all ${
                        paymentMethod ===
                        'cod'
                          ? 'border-indigo-600 bg-indigo-50/50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >

                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100">
                        <Package className="h-4 w-4 text-emerald-700" />
                      </div>

                      <p className="mt-3 text-sm font-bold text-gray-900">
                        COD
                      </p>

                      <p className="mt-1 text-[11px] text-gray-400">
                        Cash on Delivery
                      </p>

                    </button>

                  </div>

                  {/* UPI Form */}
                  {paymentMethod ===
                    'upi' && (
                    <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                      <div className="mb-4 flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                          <Zap className="h-4 w-4 text-indigo-600" />
                        </div>

                        <div>
                          <h3 className="text-sm font-bold text-gray-900">
                            UPI Payment
                          </h3>

                          <p className="text-xs text-gray-400">
                            Enter your UPI ID to continue.
                          </p>
                        </div>

                      </div>

                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) =>
                          setUpiId(
                            e.target.value
                          )
                        }
                        placeholder="example@upi"
                        className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                      />

                    </div>
                  )}

                  {/* Card Form */}
                  {paymentMethod ===
                    'card' && (
                    <div className="space-y-4 rounded-2xl border border-gray-100 bg-gray-50 p-5">

                      <div className="flex items-center justify-between">

                        <div>
                          <h3 className="text-sm font-bold text-gray-900">
                            Card Details
                          </h3>

                          <p className="mt-1 text-xs text-gray-400">
                            Your payment information is protected.
                          </p>
                        </div>

                        <Lock className="h-4 w-4 text-emerald-600" />

                      </div>

                      <div>

                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                          Card Number
                        </label>

                        <input
                          type="text"
                          value={
                            cardData.cardNumber
                          }
                          onChange={(e) =>
                            setCardData(
                              (current) => ({
                                ...current,
                                cardNumber:
                                  e.target.value,
                              })
                            )
                          }
                          placeholder="1234 5678 9012 3456"
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                        />

                      </div>

                      <div>

                        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                          Card Holder
                        </label>

                        <input
                          type="text"
                          value={
                            cardData.cardHolder
                          }
                          onChange={(e) =>
                            setCardData(
                              (current) => ({
                                ...current,
                                cardHolder:
                                  e.target.value,
                              })
                            )
                          }
                          placeholder="Name on card"
                          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm uppercase outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                        />

                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">

                        <div>

                          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                            Expiry
                          </label>

                          <input
                            type="text"
                            value={
                              cardData.expiry
                            }
                            onChange={(e) =>
                              setCardData(
                                (current) => ({
                                  ...current,
                                  expiry:
                                    e.target.value,
                                })
                              )
                            }
                            placeholder="MM/YY"
                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                          />

                        </div>

                        <div>

                          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-gray-500">
                            CVV
                          </label>

                          <input
                            type="password"
                            value={
                              cardData.cvv
                            }
                            onChange={(e) =>
                              setCardData(
                                (current) => ({
                                  ...current,
                                  cvv:
                                    e.target.value,
                                })
                              )
                            }
                            placeholder="123"
                            maxLength={4}
                            className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                          />

                        </div>

                      </div>

                    </div>
                  )}

                  {/* COD */}
                  {paymentMethod ===
                    'cod' && (
                    <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

                      <div className="flex items-start gap-3">

                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />

                        <div>

                          <h3 className="text-sm font-bold text-emerald-900">
                            Cash on Delivery selected
                          </h3>

                          <p className="mt-1 text-xs leading-5 text-emerald-700">
                            Pay when your order is delivered to your address.
                          </p>

                        </div>

                      </div>

                    </div>
                  )}

                </div>
              )}

              {/* =================================================
                  REVIEW
              ================================================== */}

              {step === 'review' && (
                <div className="space-y-5">

                  {/* Shipping Review */}
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                          <MapPin className="h-4 w-4 text-violet-600" />
                        </div>

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Delivery Address
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-900">
                            {shippingData.recipientName}
                          </p>

                          <p className="mt-1 text-xs leading-5 text-gray-500">
                            {shippingData.streetAddress1}
                            <br />
                            {shippingData.city},{' '}
                            {shippingData.stateProvince}{' '}
                            {shippingData.postalCode}
                            <br />
                            {shippingData.country}
                          </p>

                          <p className="mt-2 text-xs font-semibold text-gray-600">
                            {shippingData.phoneNumber}
                          </p>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setStep('shipping')
                        }
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        Edit
                      </button>

                    </div>

                  </div>

                  {/* Delivery Review */}
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                          <Truck className="h-4 w-4 text-emerald-600" />
                        </div>

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Delivery Method
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-900">
                            {shippingMethod ===
                            'express'
                              ? 'Express Delivery'
                              : 'Standard Delivery'}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {shippingMethod ===
                            'express'
                              ? '1–2 business days'
                              : '3–5 business days'}
                          </p>

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setStep('shipping')
                        }
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        Edit
                      </button>

                    </div>

                  </div>

                  {/* Payment Review */}
                  <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">

                    <div className="flex items-start justify-between gap-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
                          <CreditCard className="h-4 w-4 text-indigo-600" />
                        </div>

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                            Payment Method
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-900">
                            {paymentMethod ===
                            'upi'
                              ? 'UPI'
                              : paymentMethod ===
                                'card'
                                ? 'Credit / Debit Card'
                                : 'Cash on Delivery'}
                          </p>

                          {paymentMethod ===
                            'upi' &&
                            upiId && (
                              <p className="mt-1 text-xs text-gray-500">
                                {upiId}
                              </p>
                            )}

                        </div>

                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setStep('payment')
                        }
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                      >
                        Edit
                      </button>

                    </div>

                  </div>

                  {/* Products */}
                  <div className="rounded-2xl border border-gray-100 bg-white">

                    <div className="border-b border-gray-100 px-5 py-4">

                      <div className="flex items-center gap-2">

                        <ShoppingBag className="h-4 w-4 text-indigo-600" />

                        <h3 className="text-sm font-bold text-gray-900">
                          Order Items
                        </h3>

                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
                          {items.reduce(
                            (total, item) =>
                              total +
                              item.quantity,
                            0
                          )}
                        </span>

                      </div>

                    </div>

                    <div className="divide-y divide-gray-100">

                      {items.map((item) => {

                        const itemPrice =
                          item.salePrice &&
                          item.salePrice > 0
                            ? item.salePrice
                            : item.price;

                        const itemTotal =
                          itemPrice *
                          item.quantity;

                        return (
                          <div
                            key={
                              item.productId
                            }
                            className="flex items-center gap-3 px-5 py-4"
                          >

                            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-50">

                              {item.imageUrl ? (
                                <img
                                  src={
                                    item.imageUrl
                                  }
                                  alt={
                                    item.name
                                  }
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <ShoppingBag className="h-5 w-5 text-gray-300" />
                                </div>
                              )}

                            </div>

                            <div className="min-w-0 flex-1">

                              <p className="truncate text-sm font-bold text-gray-900">
                                {item.name}
                              </p>

                              <p className="mt-1 text-xs text-gray-400">
                                Qty: {item.quantity}
                              </p>

                            </div>

                            <p className="text-sm font-black text-gray-900">
                              {formatPrice(
                                itemTotal
                              )}
                            </p>

                          </div>
                        );
                      })}

                    </div>

                  </div>

                </div>
              )}

              {/* =================================================
                  ERROR
              ================================================== */}

              {errorMessage && (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4">

                  <X className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                  <p className="text-sm font-medium leading-5 text-red-700">
                    {errorMessage}
                  </p>

                </div>
              )}

              {/* =================================================
                  ACTIONS
              ================================================== */}

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">

                {step !== 'shipping' ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                ) : (
                  <Link
                    to="/cart"
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Bag
                  </Link>
                )}

                {step !== 'review' ? (
                  <button
                    type="button"
                    onClick={
                      handleContinue
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl"
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={
                      handlePlaceOrder
                    }
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Place Order
                      </>
                    )}
                  </button>
                )}

              </div>

            </div>

          </section>

          {/* =================================================
              RIGHT — ORDER SUMMARY
          ================================================== */}

          <aside>

            <div className="sticky top-24 space-y-5">

              {/* Summary */}
              <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">

                <div className="border-b border-gray-100 px-6 py-5">

                  <h2 className="text-base font-black text-gray-900">
                    Order Summary
                  </h2>

                  <p className="mt-1 text-xs text-gray-400">
                    {items.length}{' '}
                    {items.length === 1
                      ? 'item'
                      : 'items'}{' '}
                    in your bag
                  </p>

                </div>

                <div className="space-y-4 p-6">

                  {/* Free Shipping */}
                  <div className="rounded-2xl bg-indigo-50 p-4">

                    {amountForFreeShipping >
                    0 ? (
                      <>
                        <div className="flex items-center justify-between gap-2">

                          <p className="text-xs font-semibold text-indigo-700">
                            Add{' '}
                            {formatPrice(
                              amountForFreeShipping
                            )}{' '}
                            for FREE shipping
                          </p>

                          <Truck className="h-4 w-4 shrink-0 text-indigo-600" />

                        </div>

                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-indigo-100">

                          <div
                            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                            style={{
                              width: `${freeShippingProgress}%`,
                            }}
                          />

                        </div>

                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-xs font-bold text-indigo-700">
                        <CheckCircle2 className="h-4 w-4" />
                        You unlocked FREE shipping
                      </div>
                    )}

                  </div>

                  {/* Promo */}
                  <form
                    onSubmit={
                      handleApplyPromo
                    }
                  >

                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-400">
                      Promo Code
                    </label>

                    {promoApplied ? (
                      <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 px-3.5 py-3">

                        <div className="flex items-center gap-2">

                          <Tag className="h-4 w-4 text-emerald-600" />

                          <div>

                            <p className="text-xs font-bold text-emerald-700">
                              SPRING20 applied
                            </p>

                            <p className="text-[10px] text-emerald-600">
                              20% discount
                            </p>

                          </div>

                        </div>

                        <button
                          type="button"
                          onClick={
                            removePromo
                          }
                          className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-100"
                          aria-label="Remove promo"
                        >
                          <X className="h-4 w-4" />
                        </button>

                      </div>
                    ) : (
                      <div className="flex gap-2">

                        <div className="relative flex-1">

                          <Tag className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

                          <input
                            type="text"
                            value={
                              promoCode
                            }
                            onChange={(e) =>
                              setPromoCode(
                                e.target
                                  .value
                              )
                            }
                            placeholder="SPRING20"
                            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-9 pr-3 text-xs font-semibold uppercase outline-none transition-all placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                          />

                        </div>

                        <button
                          type="submit"
                          className="rounded-xl bg-gray-900 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-black"
                        >
                          Apply
                        </button>

                      </div>
                    )}

                    {promoError && (
                      <p className="mt-2 text-[11px] font-medium text-red-500">
                        {promoError}
                      </p>
                    )}

                  </form>

                  {/* Price Breakdown */}
                  <div className="space-y-3 border-t border-gray-100 pt-4">

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-gray-500">
                        Subtotal
                      </span>

                      <span className="font-semibold text-gray-900">
                        {formatPrice(
                          subtotal
                        )}
                      </span>

                    </div>

                    {discountAmount >
                      0 && (
                      <div className="flex items-center justify-between text-sm">

                        <span className="text-emerald-600">
                          Discount
                        </span>

                        <span className="font-bold text-emerald-600">
                          -
                          {formatPrice(
                            discountAmount
                          )}
                        </span>

                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-gray-500">
                        Shipping
                      </span>

                      <span className="font-semibold text-gray-900">

                        {shippingFee ===
                        0 ? (
                          <span className="text-xs font-black uppercase text-emerald-600">
                            Free
                          </span>
                        ) : (
                          formatPrice(
                            shippingFee
                          )
                        )}

                      </span>

                    </div>

                    <div className="flex items-center justify-between text-sm">

                      <span className="text-gray-500">
                        GST (18%)
                      </span>

                      <span className="font-semibold text-gray-900">
                        {formatPrice(
                          taxAmount
                        )}
                      </span>

                    </div>

                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-100 pt-4">

                    <div className="flex items-end justify-between gap-3">

                      <div>

                        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                          Total
                        </p>

                        <p className="mt-1 text-2xl font-black tracking-tight text-gray-950">
                          {formatPrice(
                            grandTotal
                          )}
                        </p>

                      </div>

                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-[10px] font-bold text-indigo-600">
                        INR
                      </span>

                    </div>

                  </div>

                </div>

              </div>

              {/* Trust */}
              <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                <div className="grid grid-cols-2 gap-4">

                  <div className="flex items-start gap-2">

                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

                    <div>
                      <p className="text-[11px] font-bold text-gray-800">
                        Secure Payment
                      </p>

                      <p className="mt-0.5 text-[10px] leading-4 text-gray-400">
                        Protected checkout
                      </p>
                    </div>

                  </div>

                  <div className="flex items-start gap-2">

                    <Truck className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />

                    <div>
                      <p className="text-[11px] font-bold text-gray-800">
                        Fast Delivery
                      </p>

                      <p className="mt-0.5 text-[10px] leading-4 text-gray-400">
                        Reliable shipping
                      </p>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};