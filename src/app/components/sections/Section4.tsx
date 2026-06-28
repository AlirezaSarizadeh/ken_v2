"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import type { GlobalMessages } from "@/types/messages";
import type { DojoApiData } from "@/types/api";
import SafeImg from "@/app/components/ui/SafeImg";
import CourseRegistrationModal from "@/app/components/ui/CourseRegistrationModal";

const FALLBACK_LEVELS = [
  {
    id: 0,
    title: "سطح مبتدی",
    kanji: "初級",
    description: "در این سطح، دانش‌آموزان با اصول اولیه هنرهای رزمی ژاپنی آشنا می‌شوند. تمرکز بر روی یادگیری فرم‌های پایه، تکنیک‌های دفاعی، و ایجاد پایه‌ای قوی برای پیشرفت است.",
    duration: "۶ ماه",
    requirements: ["حداقل ۱۶ سال سن", "آمادگی جسمانی مناسب", "تعهد به تمرین هفتگی"],
    skills: ["فرم‌های پایه (کاتا)", "تکنیک‌های دفاعی", "اصول اولیه بوشیدو", "آشنایی با سلاح‌های سنتی"],
    image: "/beginner-level.jpg",
    progress: 30,
  },
  {
    id: 1,
    title: "سطح پیشرفته",
    kanji: "上級",
    description: "در این سطح، دانش‌آموزان مهارت‌های پیشرفته را فرا می‌گیرند و برای کسب مدرک رسمی آماده می‌شوند. تمرکز بر روی تکنیک‌های پیچیده، مبارزه عملی، و فلسفه عمیق است.",
    duration: "۱۲ ماه",
    requirements: ["موفقیت در سطح مبتدی", "حداقل ۱ سال تمرین مستمر", "توصیه استاد"],
    skills: ["کاتاهای پیشرفته", "تکنیک‌های مبارزه", "استادانه استفاده از سلاح", "درک عمیق فلسفه سامورایی"],
    image: "/advanced-level.jpg",
    progress: 85,
  },
];

const FALLBACK_MILESTONES = [
  { title: "شروع سفر", kanji: "始", completed: true },
  { title: "آموزش پایه", kanji: "基", completed: true },
  { title: "تسلط بر فرم‌ها", kanji: "形", completed: false },
  { title: "مبارزه عملی", kanji: "実", completed: false },
  { title: "کسب مدرک", kanji: "免", completed: false },
];

export default function Section4({
  exiting,
  messages,
  apiData,
}: {
  exiting: boolean;
  messages?: GlobalMessages;
  apiData?: DojoApiData;
}) {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/en") ? "en" : "fa";

  // selectedLevel = array index (not course ID)
  const [selectedLevel, setSelectedLevel] = useState(0);
  const [isSectionOpen, setIsSectionOpen] = useState(false);
  const [regModalOpen, setRegModalOpen] = useState(false);
  const t = messages?.Section4 as any;
  const courses = apiData?.coursesData;

  const COURSE_LEVELS = useMemo(() => {
    const apiLevels = courses?.levels ?? courses?.items;
    const fromApi = apiLevels?.filter(Boolean).map((lvl: any) => ({
      id: lvl.id ?? 0,
      title: lvl.title ?? "",
      kanji: lvl.kanji ?? "",
      description: lvl.description ?? "",
      duration: lvl.duration ?? "",
      image: lvl.image ?? "",
      progress: lvl.progress ?? 0,
      requirements: Array.isArray(lvl.requirements) ? lvl.requirements : [],
      skills: Array.isArray(lvl.skills) ? lvl.skills : [],
    }));
    if (fromApi?.length) return fromApi;
    const fromJson = t?.levels?.filter(Boolean);
    return fromJson?.length ? fromJson : FALLBACK_LEVELS;
  }, [courses, t?.levels]);

  const MILESTONES = useMemo(() => {
    const fromApi = courses?.milestones?.filter(Boolean).map((m: any) => ({
      title: m.title ?? "",
      kanji: m.kanji ?? "",
      completed: m.completed ?? false,
    }));
    if (fromApi?.length) return fromApi;
    const fromJson = t?.milestones?.filter(Boolean);
    return fromJson?.length ? fromJson : FALLBACK_MILESTONES;
  }, [courses?.milestones, t?.milestones]);

  const headingTitle = t?.heading?.title ?? "سطوح آموزشی";
  const headingSubtitle = t?.heading?.subtitle ?? "مسیر تبدیل شدن به استاد";
  const roadmapTitle = t?.roadmapTitle ?? "نقشه راه";
  const prereqTitle = t?.labels?.prereqTitle ?? "پیش‌نیازها";
  const skillsTitle = t?.labels?.skillsTitle ?? "مهارت‌های اکتسابی";
  const enrollCta = t?.labels?.enrollCta ?? "ثبت‌نام در این دوره";
  const skillLevelLabel = t?.labels?.skillLevelLabel ?? "سطح مهارت";

  return (
    <div
      className="w-full min-h-full flex flex-col items-center justify-center relative py-16 md:py-0 overflow-hidden"
      id="courses"
    >
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-10" />
        <motion.div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/course_bg.webp')", zIndex: 0 }}
          animate={{ scale: exiting ? 1.2 : 1, opacity: exiting ? 0.8 : 1 }}
          initial={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
        <div className="absolute top-10 start-10 text-red-950/20 text-9xl font-black select-none z-0">級</div>
        <div className="absolute bottom-10 end-10 text-red-950/20 text-9xl font-black select-none z-0">目</div>
      </div>

      {/* Content Wrapper */}
      <motion.div
        id="main-content-section4"
        layout
        className="w-full flex justify-center overflow-hidden"
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isSectionOpen && !exiting ? "auto" : 0,
          opacity: isSectionOpen && !exiting ? 1 : 0,
        }}
        transition={{
          height: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
          opacity: { duration: 0.5, delay: isSectionOpen ? 0.2 : 0 },
        }}
      >
        <motion.div
          layout
          className="
            relative z-10
            w-full max-w-6xl
            flex flex-col md:flex-row
            bg-[#0a0a0a]
            border-y-2 md:border-y-0 md:border-x-2 border-[#3a0a0a]
            rounded-xl md:rounded-3xl
            shadow-[0_20px_60px_-10px_rgba(0,0,0,1)]
            overflow-hidden
            mx-4 mb-4
          "
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{
            opacity: exiting ? 0 : 1,
            y: exiting ? -50 : 0,
            scale: exiting ? 0.95 : 1,
          }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="absolute top-0 w-full h-[3px] bg-gradient-to-r from-transparent via-red-800 to-transparent z-30 shadow-[0_0_10px_red]" />

          {/* LEFT */}
          <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col bg-[#0f0f0f] relative border-b md:border-b-0 md:border-s border-red-900/30">
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] pointer-events-none" />

            <h2
              className="relative z-10 text-2xl md:text-3xl font-bold text-red-100/90 mb-8 text-center"
              style={{ fontFamily: "'Vazirmatn', sans-serif" }}
            >
              {headingTitle}
              <span className="block text-sm text-red-800/60 mt-1 font-light">{headingSubtitle}</span>
            </h2>

            <div className="space-y-4 relative z-10 mb-8">
              {COURSE_LEVELS.map((level: any, idx: number) => (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(idx)}
                  className={`
                    w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-300
                    ${
                      selectedLevel === idx
                        ? "bg-red-950/30 border-red-800/60 shadow-[inset_0_0_20px_rgba(139,0,0,0.2)]"
                        : "bg-[#151515] border-white/5 hover:border-red-900/30 hover:bg-[#1a1a1a]"
                    }
                  `}
                >
                  <div className="flex flex-col items-start">
                    <span
                      className={`text-lg font-bold ${selectedLevel === idx ? "text-white" : "text-gray-400"}`}
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {level.title}
                    </span>
                    <span className="text-xs text-gray-500 mt-1">{level.duration}</span>
                  </div>
                  <span
                    className={`text-3xl font-black ${selectedLevel === idx ? "text-red-600" : "text-gray-700"}`}
                    style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    {level.kanji}
                  </span>
                </button>
              ))}
            </div>

            {/* Roadmap */}
            <div className="mt-auto relative z-10 ps-4">
              <h4
                className="text-sm text-gray-500 mb-4 border-b border-gray-800 pb-2"
                style={{ fontFamily: "'Vazirmatn', sans-serif" }}
              >
                {roadmapTitle}
              </h4>
              <div className="space-y-4 relative">
                <div className="absolute top-2 bottom-2 start-[9px] w-[2px] bg-gray-800" />
                {MILESTONES.map((stone: any, idx: number) => (
                  <div key={idx} className="flex items-center relative">
                    <div
                      className={`z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-[#0f0f0f] ${
                        stone.completed ? "border-red-600 shadow-[0_0_8px_red]" : "border-gray-700"
                      }`}
                    >
                      {stone.completed && <div className="w-2 h-2 bg-red-600 rounded-full" />}
                    </div>
                    <span
                      className={`ms-3 text-sm ${stone.completed ? "text-gray-200" : "text-gray-600"}`}
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {stone.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="w-full md:w-2/3 p-6 md:p-10 relative flex flex-col bg-[#0a0a0a]">
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://www.transparenttextures.com/patterns/asfalt-dark.png')] pointer-events-none" />

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedLevel}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col"
              >
                <div className="relative w-full h-48 md:h-56 rounded-lg overflow-hidden border border-red-900/30 mb-6 group">
                  <SafeImg
                    src={COURSE_LEVELS[selectedLevel].image}
                    alt={COURSE_LEVELS[selectedLevel].title}
                    className="w-full h-full object-cover filter brightness-[0.7] contrast-125 group-hover:brightness-100 transition-all duration-700"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/level${selectedLevel}/800/300.jpg`;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3
                      className="text-2xl font-bold text-red-500"
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {COURSE_LEVELS[selectedLevel].title}
                    </h3>
                    <span
                      className="text-4xl text-red-900/40 select-none"
                      style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                    >
                      {COURSE_LEVELS[selectedLevel].kanji}
                    </span>
                  </div>

                  <p
                    className="text-gray-300 leading-7 text-sm mb-6"
                    style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                  >
                    {COURSE_LEVELS[selectedLevel].description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                      <h4
                        className="text-red-400 text-sm font-bold mb-3 flex items-center gap-2"
                        style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                      >
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        {prereqTitle}
                      </h4>
                      <ul className="space-y-2">
                        {COURSE_LEVELS[selectedLevel].requirements.map((req: string, i: number) => (
                          <li
                            key={i}
                            className="text-xs text-gray-400 flex items-start gap-2"
                            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                          >
                            <span className="text-red-800">›</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                      <h4
                        className="text-red-400 text-sm font-bold mb-3 flex items-center gap-2"
                        style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                      >
                        <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                        {skillsTitle}
                      </h4>
                      <ul className="space-y-2">
                        {COURSE_LEVELS[selectedLevel].skills.map((skill: string, i: number) => (
                          <li
                            key={i}
                            className="text-xs text-gray-400 flex items-start gap-2"
                            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                          >
                            <span className="text-red-800">›</span>
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 flex justify-center md:justify-end">
                  <button
                    onClick={() => setRegModalOpen(true)}
                    className="relative group px-8 py-3 bg-red-900 overflow-hidden rounded-md text-white shadow-lg transition-all hover:scale-105"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-red-800 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span
                      className="relative font-bold flex items-center gap-2"
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {enrollCta}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 ltr:rotate-180"
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                      </svg>
                    </span>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="absolute bottom-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-900 to-transparent z-30 opacity-50" />
        </motion.div>
      </motion.div>

      {/* Floating Button Area */}
      <div className="w-full fixed bottom-8 left-0 right-0 flex flex-col items-center justify-end z-50 pointer-events-none">
        {/* Guiding Arrows */}
        <AnimatePresence>
          {!isSectionOpen && !exiting && (
            <motion.div
              className="mb-3 pointer-events-none flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4 }}
            >
              {[0, 1, 2].map((i) => (
                <motion.svg
                  key={i}
                  width="28"
                  height="14"
                  viewBox="0 0 28 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, 4, 0] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.25,
                  }}
                >
                  <path
                    d="M4 3L14 10L24 3"
                    stroke="#dc2626"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </motion.svg>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Image Button */}
        <motion.button
          onClick={() => setIsSectionOpen(!isSectionOpen)}
          className="pointer-events-auto relative group flex items-center justify-center outline-none cursor-pointer"
          initial={{ y: 100 }}
          animate={{ y: exiting ? 100 : 0 }}
          transition={{ delay: 0.5, type: "spring", stiffness: 100, damping: 15 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-expanded={isSectionOpen}
          aria-controls="main-content-section4"
        >
          <motion.div
            className="relative"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-red-600/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            <img
              src="/closed_scroll.png"
              alt="Open Samurai Scroll"
              className="w-[420px] md:w-[480px] h-auto drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
              style={{ opacity: isSectionOpen ? 0.4 : 1 }}
            />
          </motion.div>
        </motion.button>
      </div>

      <CourseRegistrationModal
        isOpen={regModalOpen}
        onClose={() => setRegModalOpen(false)}
        courseId={COURSE_LEVELS[selectedLevel]?.id ?? 0}
        courseTitle={COURSE_LEVELS[selectedLevel]?.title ?? ""}
        locale={locale}
      />
    </div>
  );
}
