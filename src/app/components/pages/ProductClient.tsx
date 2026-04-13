"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import type { GlobalMessages } from "@/types/messages";
import Link from "next/link";

type Product = {
  id?: number;
  name?: string;
  kanji?: string;
  description?: string;
  origin?: string;
  material?: string;
  image?: string;
  category?: string;
  price?: number;
  inStock?: boolean;
  badge?: string;
  // اختیاری: گالری چند عکس
  gallery?: string[];
};

type Review = {
  id: string;
  name: string;
  rating: number; // 1..5
  text: string;
  dateISO: string;
};

function formatPriceFA(n: number) {
  return n.toLocaleString("fa-IR");
}
function formatPriceEN(n: number) {
  return n.toLocaleString("en-US");
}

function clampRating(x: number) {
  if (x < 1) return 1;
  if (x > 5) return 5;
  return x;
}

function Stars({ value }: { value: number }) {
  const v = clampRating(Math.round(value));
  return (
    <div className="inline-flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < v ? "text-amber-400" : "text-white/15"}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function ProductClient({
  locale,
  messages,
  product,
}: {
  locale: "fa" | "en";
  messages?: GlobalMessages;
  product: Product | null;
}) {
  const t = messages?.ProductPage as any;

  const ui = {
    pageTitle:
      t?.ui?.pageTitle ??
      (locale === "fa" ? "جزئیات محصول" : "Product Details"),
    gallery: t?.ui?.gallery ?? (locale === "fa" ? "گالری" : "Gallery"),
    specs: t?.ui?.specs ?? (locale === "fa" ? "مشخصات" : "Specs"),
    reviews: t?.ui?.reviews ?? (locale === "fa" ? "نظرات" : "Reviews"),
    addToCart:
      t?.ui?.addToCart ?? (locale === "fa" ? "تماس بگیرید" : "Call Us"),
    outOfStock:
      t?.ui?.outOfStock ?? (locale === "fa" ? "ناموجود" : "Out of stock"),
    currency: t?.ui?.currency ?? (locale === "fa" ? "تومان" : "Toman"),
    writeReview:
      t?.ui?.writeReview ?? (locale === "fa" ? "ثبت نظر" : "Write a review"),
    yourName: t?.ui?.yourName ?? (locale === "fa" ? "نام شما" : "Your name"),
    yourReview:
      t?.ui?.yourReview ?? (locale === "fa" ? "نظر شما" : "Your review"),
    rating: t?.ui?.rating ?? (locale === "fa" ? "امتیاز" : "Rating"),
    submit: t?.ui?.submit ?? (locale === "fa" ? "ارسال" : "Submit"),
    emptyProduct:
      t?.ui?.emptyProduct ??
      (locale === "fa" ? "محصولی یافت نشد." : "Product not found."),
  };

  const safeProduct = product;

  const gallery = useMemo(() => {
    if (!safeProduct) return [];
    const g = (safeProduct.gallery ?? []).filter(Boolean);
    const main = safeProduct.image ? [safeProduct.image] : [];
    // اگر گالری نداشتی، از picsum چندتا می‌سازیم که UI خالی نمونه
    const fallback = safeProduct.id
      ? [
          `https://picsum.photos/seed/gear-${safeProduct.id}-1/1200/900`,
          `https://picsum.photos/seed/gear-${safeProduct.id}-2/1200/900`,
          `https://picsum.photos/seed/gear-${safeProduct.id}-3/1200/900`,
        ]
      : [];
    const merged = [...main, ...g];
    return merged.length ? merged : fallback;
  }, [safeProduct]);

  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const initialReviews: Review[] = useMemo(() => {
    const seed = safeProduct?.id ?? 1;
    if (!safeProduct) return [];
    return [
      {
        id: `r-${seed}-1`,
        name: locale === "fa" ? "امیر" : "Amir",
        rating: 5,
        text:
          locale === "fa"
            ? "کیفیت ساخت عالیه، برای تمرین خیلی راضیم."
            : "Excellent build quality — perfect for training.",
        dateISO: "2026-02-10",
      },
      {
        id: `r-${seed}-2`,
        name: locale === "fa" ? "نازنین" : "Nazanin",
        rating: 4,
        text:
          locale === "fa"
            ? "بسته‌بندی خوب بود، فقط کاش توضیحات فنی بیشتر داشت."
            : "Great packaging. Would love more technical details though.",
        dateISO: "2026-02-16",
      },
    ];
  }, [safeProduct, locale]);

  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const avg = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((a, b) => a + b.rating, 0) / reviews.length;
  }, [reviews]);

  const [formName, setFormName] = useState("");
  const [formText, setFormText] = useState("");
  const [formRating, setFormRating] = useState(5);

  function addReview() {
    const name = formName.trim();
    const text = formText.trim();
    if (!name || !text) return;

    const now = new Date();
    const dateISO = now.toISOString().slice(0, 10);

    setReviews((prev) => [
      {
        id: `r-${Date.now()}`,
        name,
        rating: clampRating(formRating),
        text,
        dateISO,
      },
      ...prev,
    ]);

    setFormName("");
    setFormText("");
    setFormRating(5);
  }

  if (!safeProduct) {
    return (
      <div className="min-h-[70vh] w-full flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="text-6xl opacity-20">空</div>
          <div
            className="mt-3 text-sm text-white/70"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          >
            {ui.emptyProduct}
          </div>
        </div>
      </div>
    );
  }

  const price =
    typeof safeProduct.price === "number"
      ? locale === "fa"
        ? formatPriceFA(safeProduct.price)
        : formatPriceEN(safeProduct.price)
      : null;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero background */}
      <div className="relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/75 to-black" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 py-10 md:py-14">
          <div className="mb-6">
            <div className="text-xs text-red-200/60 tracking-widest uppercase">
              {ui.pageTitle}
            </div>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <h1
                  className="text-3xl md:text-4xl font-black text-white"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {safeProduct.name}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-white/70">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                    {safeProduct.category}
                  </span>
                  {safeProduct.badge ? (
                    <span className="rounded-full border border-red-700/30 bg-red-900/25 px-3 py-1 text-red-100/90">
                      {safeProduct.badge}
                    </span>
                  ) : null}
                  <span className="text-white/35 font-black text-2xl select-none">
                    {safeProduct.kanji}
                  </span>
                </div>
              </div>

              <div className="text-end">
                <div className="text-xs text-white/55">نظرات</div>
                <div className="mt-1 flex items-center justify-end gap-2">
                  <Stars value={avg || 5} />
                  <span className="text-xs text-white/55">
                    ({reviews.length})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Gallery */}
            <div className="lg:col-span-7">
              <div className="border border-white/10 bg-[#0b0b0b] overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={gallery[activeImage]}
                      src={gallery[activeImage]}
                      alt={safeProduct.name ?? "product"}
                      className="absolute inset-0 w-full h-full object-cover"
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.25 }}
                      onError={(e) => {
                        e.currentTarget.src = `https://picsum.photos/seed/fallback-${safeProduct.id}/1200/900`;
                      }}
                    />
                  </AnimatePresence>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-85" />
                  <div className="absolute bottom-4 start-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white/75">
                    {ui.gallery} • {activeImage + 1}/{gallery.length}
                  </div>
                </div>

                {/* thumbs */}
                <div className="p-3 flex gap-2 overflow-x-auto">
                  {gallery.map((src, idx) => (
                    <button
                      key={src + idx}
                      onClick={() => setActiveImage(idx)}
                      className={`
                        relative shrink-0
                        border transition
                        ${idx === activeImage ? "border-red-700/55" : "border-white/10 hover:border-white/25"}
                      `}
                      style={{ width: 88, height: 64 }}
                      aria-label={`thumb ${idx + 1}`}
                    >
                      <img
                        src={src}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/10" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="lg:col-span-5">
              <div className="border border-white/10 bg-[#0b0b0b] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-white/55">{ui.specs}</div>
                    <div
                      className="mt-2 text-sm text-white/80"
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {safeProduct.description}
                    </div>
                  </div>

                  {/* <div className="text-end">
                    <div className="text-xs text-white/55">Price</div>
                    <div className="mt-1 text-xl font-black text-white">
                      {price ?? "—"}{" "}
                      <span className="text-xs text-white/55">{ui.currency}</span>
                    </div>
                    <div className="mt-1 text-xs">
                      {safeProduct.inStock ? (
                        <span className="text-emerald-300/80">● In stock</span>
                      ) : (
                        <span className="text-red-300/80">● {ui.outOfStock}</span>
                      )}
                    </div>
                  </div> */}
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
                    <div className="text-white/55">Origin</div>
                    <div className="mt-1 text-amber-200/85">
                      {safeProduct.origin ?? "—"}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-black/35 p-3">
                    <div className="text-white/55">Material</div>
                    <div className="mt-1 text-white/85">
                      {safeProduct.material ?? "—"}
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  {/* <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/35 px-3 py-2">
                    <button
                      className="px-2 py-1 text-white/80 hover:text-white"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="minus"
                    >
                      −
                    </button>
                    <div className="min-w-[2ch] text-center font-mono text-white/85">{qty}</div>
                    <button
                      className="px-2 py-1 text-white/80 hover:text-white"
                      onClick={() => setQty((q) => q + 1)}
                      aria-label="plus"
                    >
                      +
                    </button>
                  </div> */}

                  <Link 
                    href={'tel:02155545357'}
                    className={`
                      flex-1 rounded-2xl px-4 py-3 text-center text-sm border transition
                      ${
                        safeProduct.inStock
                          ? "border-red-700/40 bg-red-900/35 hover:bg-red-900/55 text-white"
                          : "border-white/10 bg-white/5 text-gray-500 cursor-not-allowed"
                      }
                    `}
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  >
                    {safeProduct.inStock ? ui.addToCart : ui.outOfStock}
                  </Link>
                </div>

                <div className="mt-4 text-xs text-white/45">
                  ID:{" "}
                  <span className="font-mono text-white/70">
                    00{safeProduct.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <div className="mt-8 border border-white/10 bg-[#0b0b0b] p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs text-white/55">{ui.reviews}</div>
                <div className="mt-2 flex items-center gap-2">
                  <Stars value={avg || 5} />
                  <span className="text-xs text-white/55">
                    {avg ? avg.toFixed(1) : "—"} / 5 • {reviews.length}
                  </span>
                </div>
              </div>

              <div className="text-white/35 font-black text-3xl select-none">
                評
              </div>
            </div>

            {/* form */}
            <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-3">
                <label className="text-xs text-white/55">{ui.yourName}</label>
                <input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-2 w-full rounded-2xl bg-black/50 border border-white/10 px-4 py-3 text-sm outline-none focus:border-red-700/40"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                />
              </div>

              <div className="md:col-span-3">
                <label className="text-xs text-white/55">{ui.rating}</label>
                <select
                  value={formRating}
                  onChange={(e) => setFormRating(Number(e.target.value))}
                  className="mt-2 w-full rounded-2xl bg-black/50 border border-white/10 px-4 py-3 text-sm outline-none focus:border-red-700/40"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {[5, 4, 3, 2, 1].map((x) => (
                    <option key={x} value={x}>
                      {x} / 5
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-6">
                <label className="text-xs text-white/55">{ui.yourReview}</label>
                <input
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  className="mt-2 w-full rounded-2xl bg-black/50 border border-white/10 px-4 py-3 text-sm outline-none focus:border-red-700/40"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                />
              </div>
            </div>

            <div className="mt-3 flex justify-end">
              <button
                onClick={addReview}
                className="rounded-2xl border border-red-700/40 bg-red-900/30 hover:bg-red-900/50 px-5 py-3 text-sm transition"
                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
              >
                {ui.submit}
              </button>
            </div>

            {/* list */}
            <div className="mt-6 space-y-3">
              {reviews.map((r) => (
                <div
                  key={r.id}
                  className="border border-white/10 bg-black/35 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div
                        className="text-sm text-white/90"
                        style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                      >
                        {r.name}
                      </div>
                      <div className="mt-1">
                        <Stars value={r.rating} />
                      </div>
                    </div>
                    <div className="text-xs text-white/45 font-mono">
                      {r.dateISO}
                    </div>
                  </div>
                  <div
                    className="mt-3 text-sm text-white/70"
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  >
                    {r.text}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 h-[2px] bg-gradient-to-r from-transparent via-red-900/60 to-transparent opacity-70" />
        </div>
      </div>
    </div>
  );
}
