"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SafeImg from "@/app/components/ui/SafeImg";
import CourseRegistrationModal from "@/app/components/ui/CourseRegistrationModal";

interface Course {
  id: number;
  title: string;
  kanji: string | null;
  description: string | null;
  duration: string | null;
  image: string | null;
  slug: string | null;
}

interface Props {
  courses: Course[];
  locale: string;
}

export default function CoursesPageClient({ courses, locale }: Props) {
  const isRtl = locale === "fa";
  const [regModal, setRegModal] = useState<{ courseId: number; courseTitle: string } | null>(null);

  const headingTitle = isRtl ? "دوره‌های آموزشی" : "Training Courses";
  const headingSubtitle = isRtl ? "مسیر تبدیل شدن به جنگجو" : "The path to becoming a warrior";
  const durationLabel = isRtl ? "مدت دوره" : "Duration";
  const registerLabel = isRtl ? "ثبت‌نام" : "Register";
  const noCourses = isRtl ? "در حال حاضر دوره‌ای موجود نیست." : "No courses available at this time.";

  return (
    <div
      className="relative w-full min-h-screen bg-[#050505] py-20 md:py-28 overflow-x-hidden"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* BG */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: "url('/course_bg.webp')" }}
        />
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505] opacity-90" />
        <div className="absolute top-10 start-10 text-red-950/20 text-9xl font-black select-none blur-[2px]">級</div>
        <div className="absolute bottom-10 end-10 text-red-950/20 text-9xl font-black select-none blur-[2px]">目</div>
      </div>

      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-6">
        {/* Header */}
        <header className="mb-14 text-center">
          <h1
            className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-900 drop-shadow-sm mb-3"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          >
            {headingTitle}
          </h1>
          <p
            className="text-gray-400 text-sm md:text-base max-w-lg mx-auto"
            style={{ fontFamily: "'Vazirmatn', sans-serif" }}
          >
            {headingSubtitle}
          </p>
          <div className="mt-4 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-red-800 to-transparent" />
        </header>

        {/* Courses grid */}
        {courses.length === 0 ? (
          <div className="text-center py-20 text-gray-500" style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
            {noCourses}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {courses.map((course, i) => (
                <motion.article
                  key={course.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="group flex flex-col bg-[#0a0a0a] border border-red-900/20 rounded-2xl overflow-hidden shadow-[0_4px_30px_-10px_rgba(0,0,0,0.8)] hover:border-red-800/40 transition-colors duration-300"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <SafeImg
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://picsum.photos/seed/course${course.id}/800/400.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                    {course.kanji && (
                      <span
                        className="absolute bottom-3 end-4 text-5xl text-red-950/50 font-black select-none"
                        style={{ fontFamily: "'Noto Sans JP', sans-serif" }}
                      >
                        {course.kanji}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-6">
                    <h2
                      className="text-xl font-bold text-red-100 mb-2"
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {course.title}
                    </h2>

                    {course.description && (
                      <p
                        className="text-gray-400 text-sm leading-7 flex-1 line-clamp-3 mb-4"
                        style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                      >
                        {course.description}
                      </p>
                    )}

                    {course.duration && (
                      <div className="flex items-center gap-2 mb-5 text-xs text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-800" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span style={{ fontFamily: "'Vazirmatn', sans-serif" }}>
                          {durationLabel}: {course.duration}
                        </span>
                      </div>
                    )}

                    <button
                      onClick={() => setRegModal({ courseId: course.id, courseTitle: course.title })}
                      className="mt-auto w-full py-2.5 rounded-xl bg-red-900/80 hover:bg-red-700 text-white text-sm font-bold transition-colors"
                      style={{ fontFamily: "'Vazirmatn', sans-serif" }}
                    >
                      {registerLabel}
                    </button>
                  </div>

                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-red-900/50 to-transparent" />
                </motion.article>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {regModal && (
        <CourseRegistrationModal
          isOpen={!!regModal}
          onClose={() => setRegModal(null)}
          courseId={regModal.courseId}
          courseTitle={regModal.courseTitle}
          locale={locale}
        />
      )}
    </div>
  );
}
