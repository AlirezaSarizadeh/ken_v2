"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import type { GlobalMessages } from "@/types/messages";
import { apiPost } from "@/lib/api";
import { useAuth } from "@/app/context/AuthContext";

type Locale = "fa" | "en";

export default function JoinClient({
  locale,
  messages,
}: {
  locale: Locale;
  messages: GlobalMessages;
}) {
  const isRtl = locale === "fa";
  const dir = isRtl ? "rtl" : "ltr";

  const t = (messages.JoinPage ?? {}) as any;

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    experience: "",
    motivation: "",
    availability: "",
    emergencyContact: "",
    password: "",
    passwordConfirm: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // ---------- TEXTS ----------
  const pageTitle = t?.ui?.title ?? (isRtl ? "سامورایی شو!" : "Become a Samurai!");
  const pageBody =
    t?.ui?.body ??
    (isRtl
      ? "مسیر سامورایی تنها برای کسانی باز است که روحی تشنه و اراده‌ای پولادین دارند..."
      : "The way of the samurai is open only to those with a hungry spirit and iron will...");

  const benefits: string[] =
    t?.ui?.benefits ??
    (isRtl
      ? [
          "آموزش زیر نظر اساتید ارشد (Shihan)",
          "دسترسی به تجهیزات و سلاح‌های سنتی",
          "شرکت در آزمون‌های ارتقاء درجه (Kyu/Dan)",
          "محیطی مبتنی بر احترام و انضباط (Rei)",
        ]
      : [
          "Training under senior masters (Shihan)",
          "Access to traditional gear and weapons",
          "Rank exams (Kyu/Dan)",
          "A culture of respect and discipline (Rei)",
        ]);

  const conductLabel = t?.ui?.conductLabel ?? (isRtl ? "آیین‌نامه" : "Code of Conduct");
  const conductQuote =
    t?.ui?.conductQuote ??
    (isRtl
      ? `"شجاعت قهرمانانه کورکورانه نیست؛ هوشمندانه و قدرتمند است."`
      : `"True courage is not blind; it is intelligent and powerful."`);

  const formHeading =
    t?.form?.heading ?? (isRtl ? "فرم ثبت‌نام هنرجو" : "Student Registration");
  const pledgeHint =
    t?.form?.pledgeHint ??
    (isRtl
      ? "با کلیک بر دکمه، قوانین خانه را می‌پذیرم و سوگند وفاداری یاد می‌کنم."
      : "By clicking, I accept the dojo rules and pledge my commitment.");

  const submitText = t?.form?.submit ?? (isRtl ? "امضا و ارسال" : "Sign & Submit");
  const loadingText = t?.form?.loading ?? (isRtl ? "در حال مهر زدن..." : "Sealing...");

  const successTitle =
    t?.success?.title ?? (isRtl ? "درخواست پذیرفته شد" : "Request Accepted");
  const successBody =
    t?.success?.body ??
    (isRtl
      ? "استاد درخواست شما را بررسی خواهد کرد. منتظر تماس ما باشید."
      : "Your request will be reviewed. We’ll contact you soon.");

  const labels = t?.form?.labels ?? {};
  const placeholders = t?.form?.placeholders ?? {};
  const options = t?.form?.options ?? {};

  // ---------- VALIDATION (localized messages) ----------
  const v = t?.validation ?? {};
  const requiredFirst =
    v?.firstNameRequired ?? (isRtl ? "نام الزامی است" : "First name is required");
  const requiredLast =
    v?.lastNameRequired ?? (isRtl ? "نام خانوادگی الزامی است" : "Last name is required");
  const requiredEmail =
    v?.emailRequired ?? (isRtl ? "ایمیل الزامی است" : "Email is required");
  const invalidEmail =
    v?.emailInvalid ?? (isRtl ? "ایمیل نامعتبر است" : "Invalid email");
  const requiredPhone =
    v?.phoneRequired ?? (isRtl ? "شماره تماس الزامی است" : "Phone is required");

  const requiredPassword = v?.passwordRequired ?? (isRtl ? "رمز عبور الزامی است" : "Password is required");
  const shortPassword = v?.passwordShort ?? (isRtl ? "رمز عبور باید حداقل ۸ کاراکتر باشد" : "Password must be at least 8 characters");
  const passwordMismatch = v?.passwordMismatch ?? (isRtl ? "رمز عبور و تکرار آن یکسان نیستند" : "Passwords do not match");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = requiredFirst;
    if (!formData.lastName.trim()) newErrors.lastName = requiredLast;

    if (!formData.email.trim()) newErrors.email = requiredEmail;
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = invalidEmail;

    if (!formData.phone.trim()) newErrors.phone = requiredPhone;

    if (!formData.password) newErrors.password = requiredPassword;
    else if (formData.password.length < 8) newErrors.password = shortPassword;

    if (formData.password && formData.passwordConfirm !== formData.password) {
      newErrors.passwordConfirm = passwordMismatch;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setApiError(null);

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim();

    const registerResult = await apiPost<{ token?: string; data?: { token?: string }; user?: unknown }>(
      "/auth/register",
      {
        name: fullName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        password_confirmation: formData.passwordConfirm,
      },
      locale
    );

    if (registerResult.error) {
      setIsLoading(false);
      setApiError(registerResult.error);
      return;
    }

    const token = registerResult.data?.token ?? (registerResult.data?.data as any)?.token ?? null;
    if (token && registerResult.data?.user) login(token, registerResult.data.user as any);

    await apiPost(
      "/join-requests",
      {
        name: fullName,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        age: formData.age ? Number(formData.age) : undefined,
        experience: formData.experience || undefined,
        motivation: formData.motivation || undefined,
        availability: formData.availability || undefined,
        emergency_contact: formData.emergencyContact || undefined,
      },
      locale,
      token ?? undefined
    );

    setIsLoading(false);
    setIsSubmitted(true);

    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: "",
        experience: "",
        motivation: "",
        availability: "",
        emergencyContact: "",
        password: "",
        passwordConfirm: "",
      });
    }, 5000);
  };

  // Shared Input Styles
  const inputContainerClass = "relative group";
  const labelClass =
    "block text-xs font-bold text-red-900/60 mb-1 group-focus-within:text-red-700 transition-colors";
  const inputBase =
    "w-full bg-transparent border-b-2 py-2 px-1 text-gray-800 focus:outline-none transition-colors placeholder-red-900/20 font-medium";
  const inputBorder = "border-red-900/20 focus:border-red-800";

  // ✅ RTL/LTR fixes for alignment
  const textAlign = isRtl ? "text-right" : "text-left";
  const justify = isRtl ? "text-justify" : "text-left";
  const kanjiPos = isRtl ? "right-10" : "left-10";

  const experienceOptions = useMemo(
    () =>
      options?.experience ?? [
        { value: "", label: isRtl ? "انتخاب کنید..." : "Select..." },
        { value: "beginner", label: isRtl ? "مبتدی (سفید)" : "Beginner (White)" },
        { value: "intermediate", label: isRtl ? "متوسط (رنگی)" : "Intermediate (Colored)" },
        { value: "advanced", label: isRtl ? "پیشرفته (مشکی)" : "Advanced (Black)" },
      ],
    [options, isRtl]
  );

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center justify-center relative bg-[#0a0a0a] py-20 overflow-x-hidden font-sans"
      dir={dir}
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10" />
        <motion.div
          className="absolute inset-0 bg-cover bg-center fixed opacity-40"
          style={{ backgroundImage: "url('/join-bg.jpg')" }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "mirror" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a] z-0" />

        {/* Big Kanji */}
        <div className={`absolute top-20 ${kanjiPos} text-red-950/20 text-[12rem] font-black select-none z-0 leading-none`}>
          入
        </div>
        <div className={`absolute top-64 ${kanjiPos} text-red-950/20 text-[12rem] font-black select-none z-0 leading-none`}>
          会
        </div>
      </div>

      {/* Main Card */}
      <motion.div
        className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row bg-[#f2e8d5] rounded-xl shadow-2xl overflow-hidden mx-4"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')] mix-blend-multiply z-20" />

        {/* LEFT */}
        <div className="w-full md:w-5/12 bg-[#1a0505] text-white p-8 md:p-12 relative flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-5 pointer-events-none" />

          {/* Decorative Border Line: RTL => left, LTR => right */}
          <div
            className={[
              "absolute top-10 bottom-10 w-[1px] bg-gradient-to-b from-transparent via-red-500/50 to-transparent hidden md:block",
              isRtl ? "right-0" : "left-0",
            ].join(" ")}
          />

          <div className="relative z-10">
            <h2
              className="text-3xl font-bold text-red-500 mb-6 flex items-center gap-3"
              style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            >
              <span className="w-2 h-8 bg-red-600 rounded-sm" />
              {pageTitle}
            </h2>

            <p
              className={`text-gray-400 leading-8 mb-8 font-light ${justify}`}
              style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            >
              {pageBody}
            </p>

            <ul className="space-y-4">
              {benefits.map((item: string, i: number) => (
                <motion.li
                  key={i}
                  className={`flex items-center gap-3 text-sm text-gray-300 ${textAlign}`}
                  initial={{ opacity: 0, x: isRtl ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <svg
                    className="w-4 h-4 text-red-500 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="relative z-10 mt-12 md:mt-0">
            <div className="text-xs text-red-900/40 font-bold tracking-widest uppercase mb-1">
              {conductLabel}
            </div>
            <p className="text-xs text-gray-500 italic">{conductQuote}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-full md:w-7/12 p-8 md:p-12 relative">
          {isSubmitted ? (
            <motion.div
              className="h-full flex flex-col items-center justify-center text-center space-y-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-24 h-24 rounded-full border-4 border-red-800 flex items-center justify-center bg-red-900/10 text-red-800 text-5xl font-black">
                承
              </div>
              <h3 className="text-2xl font-bold text-red-900" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                {successTitle}
              </h3>
              <p className="text-gray-600 max-w-xs mx-auto" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                {successBody}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="relative z-10">
              <h3
                className="text-xl font-bold text-red-900 mb-8 border-b-2 border-red-900/10 pb-4 inline-block"
                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
              >
                {formHeading}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* First name */}
                <div className={inputContainerClass}>
                  <label className={labelClass}>
                    {labels?.firstName ?? (isRtl ? "نام کوچک" : "First name")}
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={placeholders?.firstName ?? ""}
                    className={[
                      inputBase,
                      textAlign,
                      errors.firstName ? "border-red-500 bg-red-50" : inputBorder,
                    ].join(" ")}
                  />
                  {errors.firstName && (
                    <span className="text-xs text-red-600 mt-1 absolute">{errors.firstName}</span>
                  )}
                </div>

                {/* Last name */}
                <div className={inputContainerClass}>
                  <label className={labelClass}>
                    {labels?.lastName ?? (isRtl ? "نام خانوادگی" : "Last name")}
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder={placeholders?.lastName ?? ""}
                    className={[
                      inputBase,
                      textAlign,
                      errors.lastName ? "border-red-500 bg-red-50" : inputBorder,
                    ].join(" ")}
                  />
                  {errors.lastName && (
                    <span className="text-xs text-red-600 mt-1 absolute">{errors.lastName}</span>
                  )}
                </div>

                {/* Email */}
                <div className={inputContainerClass}>
                  <label className={labelClass}>
                    {labels?.email ?? (isRtl ? "رایانامه (Email)" : "Email")}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    dir="ltr"
                    placeholder={placeholders?.email ?? "example@mail.com"}
                    className={[
                      inputBase,
                      "text-left", // ایمیل همیشه LTR
                      errors.email ? "border-red-500 bg-red-50" : inputBorder,
                    ].join(" ")}
                  />
                  {errors.email && (
                    <span className="text-xs text-red-600 mt-1 absolute">{errors.email}</span>
                  )}
                </div>

                {/* Phone */}
                <div className={inputContainerClass}>
                  <label className={labelClass}>
                    {labels?.phone ?? (isRtl ? "شماره تماس" : "Phone")}
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    dir="ltr"
                    placeholder={placeholders?.phone ?? ""}
                    className={[
                      inputBase,
                      "text-left", // شماره هم بهتره LTR باشه
                      errors.phone ? "border-red-500 bg-red-50" : inputBorder,
                    ].join(" ")}
                  />
                  {errors.phone && (
                    <span className="text-xs text-red-600 mt-1 absolute">{errors.phone}</span>
                  )}
                </div>

                {/* Age */}
                <div className={inputContainerClass}>
                  <label className={labelClass}>
                    {labels?.age ?? (isRtl ? "سن" : "Age")}
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    placeholder={placeholders?.age ?? ""}
                    className={[inputBase, textAlign, inputBorder].join(" ")}
                  />
                </div>

                {/* Experience */}
                <div className={inputContainerClass}>
                  <label className={labelClass}>
                    {labels?.experience ?? (isRtl ? "سطح تجربه" : "Experience level")}
                  </label>

                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className={[inputBase, textAlign, "border-none outline-none cursor-pointer", inputBorder].join(" ")}
                  >
                    {experienceOptions.map((o: any) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className={inputContainerClass}>
                <label className={labelClass}>
                  {labels?.password ?? (isRtl ? "رمز عبور" : "Password")}
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  dir="ltr"
                  placeholder="••••••••"
                  className={[inputBase, "text-left", errors.password ? "border-red-500 bg-red-50" : inputBorder].join(" ")}
                />
                {errors.password && (
                  <span className="text-xs text-red-600 mt-1 absolute">{errors.password}</span>
                )}
              </div>

              {/* Password Confirm */}
              <div className={inputContainerClass}>
                <label className={labelClass}>
                  {labels?.passwordConfirm ?? (isRtl ? "تکرار رمز عبور" : "Confirm password")}
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  value={formData.passwordConfirm}
                  onChange={handleInputChange}
                  dir="ltr"
                  placeholder="••••••••"
                  className={[inputBase, "text-left", errors.passwordConfirm ? "border-red-500 bg-red-50" : inputBorder].join(" ")}
                />
                {errors.passwordConfirm && (
                  <span className="text-xs text-red-600 mt-1 absolute">{errors.passwordConfirm}</span>
                )}
              </div>

              {/* Motivation */}
              <div className={`${inputContainerClass} mt-6`}>
                <label className={labelClass}>
                  {labels?.motivation ?? (isRtl ? "انگیزه شما از پیوستن به ما؟" : "Why do you want to join?")}
                </label>
                <textarea
                  name="motivation"
                  rows={2}
                  value={formData.motivation}
                  onChange={handleInputChange}
                  placeholder={placeholders?.motivation ?? ""}
                  className={[inputBase, textAlign, "resize-none", inputBorder].join(" ")}
                />
              </div>

              {apiError && (
                <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2" dir={dir}>
                  {apiError}
                </div>
              )}

              <div className="mt-10 flex items-center justify-between gap-6">
                <div
                  className="text-xs text-gray-500 max-w-[260px] leading-tight hidden sm:block"
                  style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                >
                  {pledgeHint}
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={[
                    "group relative flex items-center gap-3 px-8 py-3 bg-red-900 text-white rounded shadow-lg overflow-hidden",
                    isLoading ? "opacity-80 cursor-wait" : "hover:bg-red-800",
                  ].join(" ")}
                >
                  <span className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/leather.png')] opacity-30 mix-blend-overlay" />
                  <span className="relative font-bold text-lg" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                    {isLoading ? loadingText : submitText}
                  </span>
                  <span className="relative text-2xl font-black opacity-50 group-hover:opacity-100 transition-opacity">
                    押
                  </span>
                </motion.button>
              </div>
            </form>
          )}
        </div>
      </motion.div>

      {/* Footer Decoration */}
      <div className="mt-12 opacity-50 flex flex-col items-center gap-2">
        <div className="w-1 h-12 bg-gradient-to-b from-red-900/0 via-red-900 to-red-900/0" />
        <span className="text-red-900/40 text-sm tracking-[0.3em]">
          {t?.ui?.footerBrand ?? "Kenjutsu Academy"}
        </span>
      </div>
    </div>
  );
}
