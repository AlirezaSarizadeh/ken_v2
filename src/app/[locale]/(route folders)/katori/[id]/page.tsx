import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { apiFetch } from "../../../../../lib/api";
import { KATORI_ARTICLE } from "../../../../../content/longformContent";

type Locale = "fa" | "en";
type KatoriArticle = { id: number | string; title: string; content: string; image?: string | null; kanji?: string | null };

const fallback: Record<Locale, KatoriArticle[]> = {
  fa: [
    { id: 1, title: "کاتوری شینتو ریو", content: "یک کوریو که بر فاصله، زاویه و زمان‌بندی تکیه دارد؛ تصمیم درست در لحظه‌ی واقعی، قبل از سرعت و قدرت.", kanji: "香取神道流", image: "https://images.unsplash.com/photo-1544979590-37e9b47e0d92?auto=format&fit=crop&w=1200&q=80" },
    { id: 2, title: "کومیاچی دو نفره", content: "تمرین دونفره برای درک ریتم درگیری: ورودی امن، کنترل خط حمله و خروج تمیز—بدون عجله، با دقت.", kanji: "組太刀", image: "https://images.unsplash.com/photo-1520975958225-9b1fcb7a26a3?auto=format&fit=crop&w=1200&q=80" },
    { id: 3, title: "اصلِ ما-آی", content: "ما-آی یعنی فاصله‌ی درست؛ نه نزدیکِ بی‌دلیل، نه دورِ بی‌اثر. فاصله‌ای که نتیجه می‌سازد.", kanji: "間合", image: "https://images.unsplash.com/photo-1541414771867-7e6c07a93a85?auto=format&fit=crop&w=1200&q=80" },
    { id: 4, title: "آداب و انضباط", content: "رِی‌گی فقط تشریفات نیست؛ ستون تمرین است: احترام، تمرکز و مسئولیت‌پذیری در هر حرکت.", kanji: "礼儀", image: "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1200&q=80" },
  ],
  en: [
    { id: 1, title: "Katori Shintō-ryū", content: "A classical koryū focused on distance, angles, and timing—making the right decision before speed or power.", kanji: "香取神道流", image: "https://images.unsplash.com/photo-1544979590-37e9b47e0d92?auto=format&fit=crop&w=1200&q=80" },
    { id: 2, title: "Paired Kumitachi", content: "Two-person kata to understand real rhythm: safe entry, line control, and a clean exit—calm and precise.", kanji: "組太刀", image: "https://images.unsplash.com/photo-1520975958225-9b1fcb7a26a3?auto=format&fit=crop&w=1200&q=80" },
    { id: 3, title: "Ma-ai Principle", content: "Ma-ai is the correct distance: not reckless closeness, not useless range—distance that creates results.", kanji: "間合", image: "https://images.unsplash.com/photo-1541414771867-7e6c07a93a85?auto=format&fit=crop&w=1200&q=80" },
    { id: 4, title: "Etiquette & Discipline", content: "Reigi is not decoration—it’s the backbone of training: respect, focus, and responsibility in every motion.", kanji: "礼儀", image: "https://images.unsplash.com/photo-1526481280695-3c687fd643ed?auto=format&fit=crop&w=1200&q=80" },
  ],
};

function isLocale(value: string): value is Locale { return value === "fa" || value === "en"; }

async function getArticles(locale: Locale): Promise<KatoriArticle[]> {
  const result = await apiFetch<any>("/katori", locale, { next: { revalidate: 60 } });
  const articles = Array.isArray(result.data?.articles) ? result.data.articles : [];
  const mapped: KatoriArticle[] = (articles.length ? articles.map((article: any) => ({
    id: article.id,
    title: article.title ?? "",
    content: article.content ?? article.description ?? article.short_description ?? "",
    image: article.image ?? null,
    kanji: article.japanese_title ?? null,
  })) : fallback[locale]) as KatoriArticle[];
  const longform = KATORI_ARTICLE[locale];
  return [longform, ...mapped.filter((article) => String(article.id) !== String(longform.id))];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const { locale: rawLocale, id } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const article = (await getArticles(locale)).find((item) => String(item.id) === id);
  return article ? { title: `${article.title} | ${locale === "fa" ? "کاتوری" : "Katori"}` } : {};
}

export default async function KatoriArticlePage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params;
  const locale: Locale = isLocale(rawLocale) ? rawLocale : "fa";
  const isRtl = locale === "fa";
  const article = (await getArticles(locale)).find((item) => String(item.id) === id);
  if (!article) notFound();

  return (
    <div className="relative min-h-screen bg-[#050505] py-20 md:py-28" dir={isRtl ? "rtl" : "ltr"}>
      <div className="fixed inset-0 pointer-events-none bg-cover bg-center opacity-25" style={{ backgroundImage: "url('/caturi_bg.webp')" }} />
      <main className="relative z-10 mx-auto w-full max-w-4xl px-4">
        <Link href={`/${locale}#katori`} className="mb-8 inline-flex items-center gap-2 rounded-lg border border-red-900/50 bg-black/60 px-4 py-2 text-sm text-red-300 hover:bg-red-950/50">
          {isRtl ? "بازگشت به کاتوری" : "Back to Katori"}
        </Link>
        <article className="overflow-hidden rounded-3xl border border-red-900/30 bg-[#0a0a0a]/90 shadow-[0_0_70px_-20px_rgba(0,0,0,0.9)]">
          {article.image ? <img src={article.image} alt={article.title} className="h-72 w-full object-cover opacity-80" /> : null}
          <div className="p-7 md:p-12">
            <div className="mb-6 flex items-center gap-4">
              {article.kanji ? <span className="text-5xl text-red-900/50">{article.kanji}</span> : null}
              <h1 className="text-3xl font-bold leading-relaxed text-red-100 md:text-5xl">{article.title}</h1>
            </div>
            <p className="whitespace-pre-line text-base leading-loose text-gray-300 md:text-lg">{article.content}</p>
          </div>
        </article>
      </main>
    </div>
  );
}
