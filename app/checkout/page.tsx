"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Smartphone, Banknote, Loader2, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearCart } from "@/features/cart/store/cartSlice";
import { formatPrice } from "@/lib/utils";
import { t } from "@/lib/i18n";
import { toast } from "sonner";

type PayMethod = "mtn" | "airtel" | "cash";
type Step = "details" | "payment" | "processing" | "success";

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.cart);
  const lang = useAppSelector((s) => s.language.current);
  const [step, setStep] = useState<Step>("details");
  const [payMethod, setPayMethod] = useState<PayMethod>("mtn");
  const [processing, setProcessing] = useState(false);
  const [orderNumber] = useState(() => `SMB-${Date.now().toString().slice(-6)}`);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    momoNumber: "",
    notes: "",
  });

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const delivery = subtotal > 50000 ? 0 : 2000;
  const total = subtotal + delivery;

  const handleSubmitDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep("payment");
  };

  const handlePlaceOrder = async () => {
    if (payMethod !== "cash" && !form.momoNumber) {
      toast.error("Please enter your mobile money number");
      return;
    }
    setStep("processing");
    setProcessing(true);

    // Simulate MoMo payment processing
    await new Promise((r) => setTimeout(r, 2000));
    if (payMethod === "mtn" || payMethod === "airtel") {
      toast.info("Payment request sent to your phone...", { duration: 1500 });
      await new Promise((r) => setTimeout(r, 2000));
    }
    await new Promise((r) => setTimeout(r, 1000));

    setProcessing(false);
    setStep("success");
    dispatch(clearCart());
  };

  if (items.length === 0 && step !== "success") {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl mb-4">🛒</p>
          <p className="font-bold text-gray-900 dark:text-white mb-4">Your cart is empty</p>
          <Link href="/products" className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // Success screen
  if (step === "success") {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-3xl p-8 text-center shadow-xl border border-gray-100 dark:border-gray-800 animate-bounce-in">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t(lang, "orderConfirmed")}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{t(lang, "orderThankYou")}</p>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-1">Order Number</p>
            <p className="text-xl font-bold text-green-600 font-mono">{orderNumber}</p>
            <p className="text-xs text-gray-400 mt-2">Estimated delivery: 2-4 hours</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3 mb-6 text-left">
            <p className="text-xs text-gray-500 mb-2">Delivery to</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{form.name}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{form.address}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{form.phone}</p>
          </div>
          <div className="space-y-2">
            <Link href="/products" className="flex items-center justify-center gap-2 w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all">
              Continue Shopping <ArrowRight size={16} />
            </Link>
            <Link href="/" className="flex items-center justify-center gap-1 w-full py-2.5 text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft size={14} /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Processing screen
  if (step === "processing") {
    return (
      <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mx-auto mb-5">
            <Loader2 size={36} className="text-green-600 animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Processing Payment</h2>
          {payMethod === "mtn" && (
            <div className="space-y-2 text-sm text-gray-500">
              <p>📱 MTN MoMo request sent to <span className="font-semibold text-gray-900 dark:text-white">{form.momoNumber}</span></p>
              <p>Please approve the payment on your phone...</p>
            </div>
          )}
          {payMethod === "airtel" && (
            <div className="space-y-2 text-sm text-gray-500">
              <p>📱 Airtel Money request sent to <span className="font-semibold text-gray-900 dark:text-white">{form.momoNumber}</span></p>
              <p>Please approve the payment on your phone...</p>
            </div>
          )}
          {payMethod === "cash" && (
            <p className="text-sm text-gray-500">Confirming your cash-on-delivery order...</p>
          )}
          <p className="text-xs text-gray-400 mt-4">Do not close this page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/cart" className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors">
            <ArrowLeft size={16} /> Back to Cart
          </Link>
          <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: "'Playfair Display', serif" }}>Checkout</h1>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {["details", "payment"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step === s || (step === "payment" && s === "details")
                  ? "bg-green-600 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"}`}>
                {step === "payment" && s === "details" ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:block ${step === s ? "text-green-600" : "text-gray-400"}`}>
                {s === "details" ? "Your Details" : "Payment"}
              </span>
              {i < 1 && <div className="w-12 h-px bg-gray-200 dark:bg-gray-700" />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2">
            {step === "details" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">{t(lang, "customerDetails")}</h2>
                <form onSubmit={handleSubmitDetails} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {t(lang, "fullName")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jean Pierre Habimana"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {t(lang, "phone")} <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+250 7XX XXX XXX"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      {t(lang, "address")} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="Kigali, Gasabo, KG 123 Ave..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm resize-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Order Notes (optional)
                    </label>
                    <input
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Any special instructions..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                  </div>
                  <button type="submit" className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                    Continue to Payment <ArrowRight size={18} />
                  </button>
                </form>
              </div>
            )}

            {step === "payment" && (
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">{t(lang, "paymentMethod")}</h2>

                <div className="space-y-3 mb-6">
                  {/* MTN MoMo */}
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod === "mtn" ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}>
                    <input type="radio" name="pay" value="mtn" checked={payMethod === "mtn"} onChange={() => setPayMethod("mtn")} className="sr-only" />
                    <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center text-yellow-900 font-bold text-xs flex-shrink-0">MTN</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{t(lang, "mtnMomo")}</p>
                      <p className="text-xs text-gray-500">Pay via MTN Mobile Money</p>
                    </div>
                    {payMethod === "mtn" && <CheckCircle size={18} className="text-yellow-500" />}
                  </label>

                  {/* Airtel */}
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod === "airtel" ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}>
                    <input type="radio" name="pay" value="airtel" checked={payMethod === "airtel"} onChange={() => setPayMethod("airtel")} className="sr-only" />
                    <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">AIR</div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{t(lang, "airtelMoney")}</p>
                      <p className="text-xs text-gray-500">Pay via Airtel Money</p>
                    </div>
                    {payMethod === "airtel" && <CheckCircle size={18} className="text-red-500" />}
                  </label>

                  {/* Cash */}
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${payMethod === "cash" ? "border-green-400 bg-green-50 dark:bg-green-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}>
                    <input type="radio" name="pay" value="cash" checked={payMethod === "cash"} onChange={() => setPayMethod("cash")} className="sr-only" />
                    <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
                      <Banknote size={20} className="text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{t(lang, "cash")}</p>
                      <p className="text-xs text-gray-500">Pay when your order arrives</p>
                    </div>
                    {payMethod === "cash" && <CheckCircle size={18} className="text-green-500" />}
                  </label>
                </div>

                {/* MoMo number input */}
                {(payMethod === "mtn" || payMethod === "airtel") && (
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      <Smartphone size={14} className="inline mr-1" />
                      Mobile Money Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      value={form.momoNumber}
                      onChange={(e) => setForm({ ...form, momoNumber: e.target.value })}
                      placeholder={payMethod === "mtn" ? "07X XXX XXXX" : "073 XXX XXXX"}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      A payment request will be sent to this number. Total: <span className="font-bold text-green-600">{formatPrice(total)}</span>
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep("details")} className="flex items-center gap-1 px-4 py-3 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors">
                    <ArrowLeft size={14} /> Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {processing ? <Loader2 size={18} className="animate-spin" /> : null}
                    {t(lang, "placeOrder")} — {formatPrice(total)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order summary */}
          <div>
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 sticky top-20">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t(lang, "orderSummary")}
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4 pr-1">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-2 items-start">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 dark:bg-gray-800 flex-shrink-0 overflow-hidden">
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-contain p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 dark:text-white line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-gray-400">x{item.quantity}</p>
                    </div>
                    <p className="text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 space-y-2">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>Delivery</span>
                  <span className={`font-medium ${delivery === 0 ? "text-green-600" : "text-gray-900 dark:text-white"}`}>
                    {delivery === 0 ? "FREE" : formatPrice(delivery)}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1 border-t border-gray-100 dark:border-gray-800">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-green-600">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
