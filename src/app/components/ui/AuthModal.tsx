"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { apiPost } from "@/lib/api";
import type { AuthResponse } from "@/types/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  locale?: string;
}

type Tab = "login" | "register";

const FA = {
  login: "ورود",
  register: "ثبت‌نام",
  name: "نام کامل",
  email: "ایمیل",
  phone: "شماره موبایل",
  password: "رمز عبور",
  passwordConfirm: "تکرار رمز عبور",
  loginField: "ایمیل یا موبایل",
  submit: "تأیید",
  submitting: "در حال پردازش...",
  close: "بستن",
  welcomeBack: "خوش آمدید",
  loggedInAs: "وارد شدید به عنوان",
  logoutBtn: "خروج",
  loginSuccess: "با موفقیت وارد شدید",
  registerSuccess: "ثبت‌نام با موفقیت انجام شد",
};

const EN = {
  login: "Login",
  register: "Register",
  name: "Full Name",
  email: "Email",
  phone: "Phone",
  password: "Password",
  passwordConfirm: "Confirm Password",
  loginField: "Email or Phone",
  submit: "Submit",
  submitting: "Processing...",
  close: "Close",
  welcomeBack: "Welcome back",
  loggedInAs: "Logged in as",
  logoutBtn: "Logout",
  loginSuccess: "Signed in successfully",
  registerSuccess: "Registration successful",
};

export default function AuthModal({ isOpen, onClose, locale = "fa" }: Props) {
  const isRtl = locale === "fa";
  const L = isRtl ? FA : EN;

  const { login, logout, isLoggedIn, user } = useAuth();

  const [tab, setTab] = useState<Tab>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [loginForm, setLoginForm] = useState({ login: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    password_confirmation: "",
  });

  function resetErrors() {
    setError(null);
    setFieldErrors({});
    setSuccessMsg(null);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    resetErrors();
    setLoading(true);
    const result = await apiPost<AuthResponse>("/auth/login", loginForm, locale);
    setLoading(false);
    if (result.error || !result.data) {
      setError(result.error ?? "Login failed");
      return;
    }
    const { token, user: u } = result.data;
    if (!token) {
      setError("No token in response");
      return;
    }
    login(token, u ?? {});
    setSuccessMsg(L.loginSuccess);
    setTimeout(onClose, 1400);
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    resetErrors();
    setLoading(true);
    const result = await apiPost<AuthResponse>("/auth/register", registerForm, locale);
    setLoading(false);
    if (result.error || !result.data) {
      setError(result.error ?? "Registration failed");
      return;
    }
    const { token, user: u } = result.data;
    if (!token) {
      setError("No token in response");
      return;
    }
    login(token, u ?? {});
    setSuccessMsg(L.registerSuccess);
    setTimeout(onClose, 1400);
  }

  function handleLogout() {
    logout();
    onClose();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
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
              {/* Top accent */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-red-700 to-transparent" />

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 end-4 text-gray-500 hover:text-white transition-colors z-10"
                aria-label={L.close}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="p-8">
                {isLoggedIn ? (
                  /* Logged-in state */
                  <div className="flex flex-col items-center gap-6 py-4">
                    <div className="w-16 h-16 rounded-full bg-red-900/30 border border-red-700/50 flex items-center justify-center text-2xl text-red-400">
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400 text-sm mb-1">{L.loggedInAs}</p>
                      <p className="text-white font-bold text-lg">{user?.name ?? user?.email ?? "—"}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full py-3 rounded-xl border border-red-700/50 text-red-400 hover:bg-red-900/30 transition-colors font-bold"
                    >
                      {L.logoutBtn}
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Tabs */}
                    <div className="flex rounded-xl bg-white/5 p-1 mb-8 gap-1">
                      {(["login", "register"] as Tab[]).map((t) => (
                        <button
                          key={t}
                          onClick={() => { setTab(t); resetErrors(); }}
                          className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                            tab === t
                              ? "bg-red-700 text-white shadow"
                              : "text-gray-400 hover:text-white"
                          }`}
                        >
                          {L[t]}
                        </button>
                      ))}
                    </div>

                    {/* Success banner */}
                    {successMsg && (
                      <motion.div
                        className="mb-4 px-4 py-3 rounded-xl bg-green-950/60 border border-green-700/40 text-green-300 text-sm flex items-center gap-2"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {successMsg}
                      </motion.div>
                    )}

                    {/* Error banner */}
                    {error && !successMsg && (
                      <div className="mb-4 px-4 py-3 rounded-xl bg-red-950/60 border border-red-700/40 text-red-300 text-sm">
                        {error}
                      </div>
                    )}

                    {tab === "login" ? (
                      <form onSubmit={handleLogin} className="space-y-4">
                        <Field
                          label={L.loginField}
                          type="text"
                          value={loginForm.login}
                          onChange={(v) => setLoginForm((f) => ({ ...f, login: v }))}
                          error={fieldErrors.login}
                          isRtl={isRtl}
                        />
                        <Field
                          label={L.password}
                          type="password"
                          value={loginForm.password}
                          onChange={(v) => setLoginForm((f) => ({ ...f, password: v }))}
                          error={fieldErrors.password}
                          isRtl={isRtl}
                        />
                        <SubmitBtn loading={loading} label={loading ? L.submitting : L.login} />
                      </form>
                    ) : (
                      <form onSubmit={handleRegister} className="space-y-4">
                        <Field
                          label={L.name}
                          type="text"
                          value={registerForm.name}
                          onChange={(v) => setRegisterForm((f) => ({ ...f, name: v }))}
                          error={fieldErrors.name}
                          isRtl={isRtl}
                        />
                        <Field
                          label={L.email}
                          type="email"
                          value={registerForm.email}
                          onChange={(v) => setRegisterForm((f) => ({ ...f, email: v }))}
                          error={fieldErrors.email}
                          isRtl={isRtl}
                        />
                        <Field
                          label={L.phone}
                          type="tel"
                          value={registerForm.phone}
                          onChange={(v) => setRegisterForm((f) => ({ ...f, phone: v }))}
                          error={fieldErrors.phone}
                          isRtl={isRtl}
                        />
                        <Field
                          label={L.password}
                          type="password"
                          value={registerForm.password}
                          onChange={(v) => setRegisterForm((f) => ({ ...f, password: v }))}
                          error={fieldErrors.password}
                          isRtl={isRtl}
                        />
                        <Field
                          label={L.passwordConfirm}
                          type="password"
                          value={registerForm.password_confirmation}
                          onChange={(v) => setRegisterForm((f) => ({ ...f, password_confirmation: v }))}
                          error={fieldErrors.password_confirmation}
                          isRtl={isRtl}
                        />
                        <SubmitBtn loading={loading} label={loading ? L.submitting : L.register} />
                      </form>
                    )}
                  </>
                )}
              </div>

              {/* Bottom accent */}
              <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  error,
  isRtl,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  isRtl: boolean;
}) {
  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-white/5 border ${
          error ? "border-red-600" : "border-white/10"
        } rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-red-600 transition-colors text-sm`}
        dir={isRtl ? "rtl" : "ltr"}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

function SubmitBtn({ loading, label }: { loading: boolean; label: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white font-bold transition-colors mt-2"
    >
      {label}
    </button>
  );
}
