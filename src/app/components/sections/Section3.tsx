"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { GlobalMessages } from "@/types/messages";

type ContactKind = "address" | "phone" | "email";

type ContactInfoItem = {
  id: number;
  label: string;
  text: string;
  kind?: ContactKind;
};

const ICONS: Record<ContactKind, React.ReactNode> = {
  address: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  ),
  phone: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
      />
    </svg>
  ),
  email: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
      />
    </svg>
  ),
};

function inferKind(item: ContactInfoItem): ContactKind {
  if (item.kind) return item.kind;
  if (item.id === 2) return "phone";
  if (item.id === 3) return "email";
  return "address";
}

export default function Section3({
  exiting,
  messages,
}: {
  exiting: boolean;
  messages?: GlobalMessages; // ✅ همسان با بقیه سکشن‌ها
}) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const t = (messages?.Section3 as any) ?? {};

  const CONTACT_INFO: ContactInfoItem[] = useMemo(() => {
    const fromJson = (t?.contactInfo as ContactInfoItem[] | undefined)?.filter(Boolean);
    const fallback: ContactInfoItem[] = [
      { id: 1, kind: "address", label: "آدرس", text: "تهران، خیابان ولیعصر، دوجو بوشیدو" },
      { id: 2, kind: "phone", label: "تلفن", text: "+۹۸ ۲۱ ۸۸XX XXXX" },
      { id: 3, kind: "email", label: "ایمیل", text: "info@bushido-dojo.ir" },
    ];
    return fromJson?.length ? fromJson : fallback;
  }, [t?.contactInfo]);

  const headingTitle = t?.heading?.title ?? "ارتباط با دوجو";
  const headingKanji = t?.heading?.kanji ?? "連絡";

  const formTitle = t?.form?.title ?? "ارسال پیام";
  const nameLabel = t?.form?.nameLabel ?? "نام شما";
  const namePlaceholder = t?.form?.namePlaceholder ?? "نام خود را وارد کنید...";
  const emailLabel = t?.form?.emailLabel ?? "ایمیل";
  const emailPlaceholder = t?.form?.emailPlaceholder ?? "example@mail.com";
  const messageLabel = t?.form?.messageLabel ?? "پیام";
  const messagePlaceholder = t?.form?.messagePlaceholder ?? "پیام خود را بنویسید...";
  const submitText = t?.form?.submit ?? "ارسال";
  const sentText = t?.form?.sent ?? "ارسال شد";
  const thanksTitle = t?.form?.thanksTitle ?? "آریگاتو گزایماس!";
  const thanksBody = t?.form?.thanksBody ?? "پیام شما دریافت شد.";
  const messengerAlt = t?.messengerAlt ?? "Samurai Messenger";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      console.log("Form submitted:", formData);
      setIsLoading(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", message: "" });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="w-full min-h-full flex flex-col items-center justify-center relative py-16 md:py-0" id="contact">
      {/* BG */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10" />
        <motion.div
          className="absolute inset-0 bg-cover bg-center fixed"
          style={{ backgroundImage: "url('/ctu_bg.webp')", zIndex: 0 }}
          animate={{ scale: exiting ? 1.2 : 1, opacity: exiting ? 0.8 : 1 }}
          initial={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />

        {/* ✅ start/end به جای left/right */}
        <div className="absolute top-10 start-10 text-red-950/20 text-9xl font-black select-none z-0">連</div>
        <div className="absolute bottom-10 end-10 text-red-950/20 text-9xl font-black select-none z-0">絡</div>
      </div>

      <motion.div
        className="
          relative z-10 w-full max-w-6xl flex flex-col md:flex-row
          bg-[#0a0a0a]
          border-y-2 md:border-y-0 md:border-x-2 border-[#3a0a0a]
          rounded-xl md:rounded-3xl
          shadow-[0_20px_60px_-10px_rgba(0,0,0,1)]
          overflow-hidden mx-4
        "
        initial={{ opacity: 0, y: 50, scale: 0.98 }}
        animate={{ opacity: exiting ? 0 : 1, y: exiting ? -50 : 0, scale: exiting ? 0.95 : 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="absolute top-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-800 to-transparent z-30 shadow-[0_0_10px_red]" />

        {/* Left */}
        <div className="w-full md:w-5/12 p-8 flex flex-col items-center justify-center bg-[#0f0f0f] relative border-b md:border-b-0 md:border-s border-red-900/30">
          <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none" />

          <h2 className="relative z-10 text-3xl font-bold text-red-100/90 mb-8 text-center" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            {headingTitle}
            <span className="block text-5xl text-red-900/30 mt-2 font-black select-none" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
              {headingKanji}
            </span>
          </h2>

          <motion.div
            className="relative w-48 h-48 md:w-56 md:h-56 mb-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-4 rounded-full bg-red-900/20 blur-2xl" />
            <img
              src="/pic_1.jpg"
              alt={messengerAlt}
              className="w-full h-full object-contain relative z-10"
              onError={(e) => {
                e.currentTarget.src = "https://picsum.photos/seed/messenger/400/400.jpg";
              }}
            />
          </motion.div>

          <div className="w-full space-y-4 relative z-10">
            {CONTACT_INFO.map((info) => {
              const kind = inferKind(info);
              return (
                <div
                  key={info.id}
                  className="group flex items-center p-4 bg-white/5 rounded-lg border border-white/5 hover:border-red-900/50 hover:bg-white/10 transition-all duration-300"
                >
                  <div className="text-red-500 group-hover:text-red-400 group-hover:scale-110 transition-transform duration-300">
                    {ICONS[kind]}
                  </div>

                  {/* ✅ ms به جای mr */}
                  <div className="ms-4 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                      {info.label}
                    </p>

                    {/* ✅ ایمیل/شماره بهتره همیشه LTR باشه */}
                    <p
                      className={`text-sm md:text-base text-gray-200 truncate ${
                        kind === "email" || kind === "phone" ? "dir-ltr text-start" : ""
                      }`}
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {info.text}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full md:w-7/12 p-6 md:p-12 relative flex flex-col justify-center items-center bg-[#080808]">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] opacity-[0.05]" />

          <div className="w-full max-w-lg relative bg-[#f2e8d5] text-gray-800 rounded-sm shadow-[0_0_40px_rgba(0,0,0,0.8)] overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] opacity-60 mix-blend-multiply pointer-events-none z-10" />
            <div className="absolute top-0 w-full h-2 bg-red-900/80 z-20" />
            <div className="absolute bottom-0 w-full h-2 bg-red-900/80 z-20" />

            <div className="relative z-20 p-8 md:p-10">
              <h3 className="text-2xl font-bold text-red-900/90 text-center mb-8 flex items-center justify-center gap-3" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                <span className="h-[1px] w-8 bg-red-900/30" />
                {formTitle}
                <span className="h-[1px] w-8 bg-red-900/30" />
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-bold text-red-900/70 mb-2" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                    {nameLabel}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-transparent border-b-2 border-red-900/20 py-2 px-1 text-gray-800 focus:border-red-800 focus:outline-none transition-colors placeholder-red-900/20"
                    placeholder={namePlaceholder}
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-red-900/70 mb-2" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                    {emailLabel}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    dir="ltr"
                    className="w-full bg-transparent border-b-2 border-red-900/20 py-2 px-1 text-gray-800 focus:border-red-800 focus:outline-none transition-colors placeholder-red-900/20 text-start"
                    placeholder={emailPlaceholder}
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-bold text-red-900/70 mb-2" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                    {messageLabel}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={3}
                    required
                    className="w-full bg-transparent border-b-2 border-red-900/20 py-2 px-1 text-gray-800 focus:border-red-800 focus:outline-none transition-colors placeholder-red-900/20 resize-none"
                    placeholder={messagePlaceholder}
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  />
                </div>

                <div className="pt-4 flex justify-center relative">
                  <motion.button
                    type="submit"
                    disabled={isLoading || isSubmitted}
                    className={`
                      relative w-20 h-20 rounded-full flex items-center justify-center 
                      text-white shadow-lg border-4 transition-all duration-300
                      ${isSubmitted ? "bg-green-700 border-green-800" : "bg-red-800 border-red-900"}
                      ${isLoading ? "opacity-80 cursor-wait" : "hover:shadow-xl cursor-pointer"}
                    `}
                    style={{ boxShadow: "0 5px 15px rgba(0,0,0,0.3)" }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 rounded-full border border-white/20 m-1" />
                    {isLoading ? (
                      <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                    ) : isSubmitted ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <span className="text-3xl font-black select-none" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
                        印
                      </span>
                    )}
                  </motion.button>

                  <span className="absolute -bottom-8 text-xs text-red-900/50 font-bold tracking-widest">
                    {isSubmitted ? sentText : submitText}
                  </span>
                </div>
              </form>

              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    className="absolute inset-0 z-30 flex items-center justify-center bg-[#f2e8d5]/90 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="text-center">
                      <div className="text-5xl mb-2">🙏</div>
                      <h4 className="text-xl font-bold text-red-900" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                        {thanksTitle}
                      </h4>
                      <p className="text-red-800/70 text-sm mt-1">{thanksBody}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-900 to-transparent z-30 opacity-50" />
      </motion.div>
    </div>
  );
}
