"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiPost } from "@/lib/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  courseId: number;
  courseTitle: string;
  locale?: string;
}

const FA = {
  title: "ثبت‌نام در دوره",
  name: "نام کامل",
  mobile: "شماره موبایل",
  email: "ایمیل (اختیاری)",
  submit: "ارسال درخواست",
  submitting: "در حال ارسال...",
  success: "درخواست شما با موفقیت ثبت شد",
  close: "بستن",
  required: "این فیلد اجباری است",
};
const EN = {
  title: "Course Registration",
  name: "Full Name",
  mobile: "Mobile Number",
  email: "Email (optional)",
  submit: "Submit Request",
  submitting: "Submitting...",
  success: "Your request was submitted successfully",
  close: "Close",
  required: "This field is required",
};

export default function CourseRegistrationModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  locale = "fa",
}: Props) {
  const isRtl = locale === "fa";
  const L = isRtl ? FA : EN;

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function resetForm() {
    setName("");
    setMobile("");
    setEmail("");
    setError(null);
    setSuccess(false);
  }

  function handleClose() {
    onClose();
    setTimeout(resetForm, 300);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await apiPost(
      "/course-registrations",
      { course_level_id: courseId, name, mobile, email: email || undefined },
      locale
    );
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSuccess(true);
    setTimeout(handleClose, 2200);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          <motion.div
            className="fixed inset-0 z-[201] flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative w-full max-w-md bg-[#0a0a0a] border border-red-900/40 rounded-2xl shadow-[0_0_60px_rgba(139,0,0,0.3)] overflow-hidden"
              dir={isRtl ? "rtl" : "ltr"}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-700 to-transparent" />

              <button
                type="button"
                onClick={handleClose}
                className="absolute top-4 end-4 text-gray-500 hover:text-white transition-colors z-10"
                aria-label={L.close}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-8">
                <h2
                  className="text-xl font-bold text-red-100 mb-1"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {L.title}
                </h2>
                <p
                  className="text-sm text-red-700/60 mb-6 line-clamp-1"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {courseTitle}
                </p>

                {success ? (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-6 text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-950/60 border border-green-700/40 flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-green-400">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p
                      className="text-green-300 text-sm"
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {L.success}
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="px-4 py-3 rounded-xl bg-red-950/60 border border-red-700/40 text-red-300 text-sm" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                        {error}
                      </div>
                    )}

                    <RegField label={L.name} type="text" value={name} onChange={setName} required isRtl={isRtl} />
                    <RegField label={L.mobile} type="tel" value={mobile} onChange={setMobile} required isRtl={isRtl} />
                    <RegField label={L.email} type="email" value={email} onChange={setEmail} isRtl={isRtl} />

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold transition-colors mt-2"
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {loading ? L.submitting : L.submit}
                    </button>
                  </form>
                )}
              </div>

              <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function RegField({
  label,
  type,
  value,
  onChange,
  required,
  isRtl,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  isRtl: boolean;
}) {
  return (
    <div>
      <label
        className="block text-sm text-gray-400 mb-1"
        style={{ fontFamily: "'Vazirmatn', sans-serif" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-600 transition-colors text-sm"
        dir={isRtl ? "rtl" : "ltr"}
      />
    </div>
  );
}
