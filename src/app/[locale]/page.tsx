import { notFound } from "next/navigation";
import DojoPageClient from "../components/pages/DojoPageClient";
import type { GlobalMessages } from "../../types/messages";
import { apiFetch } from "@/lib/api";
import type { DojoApiData } from "@/types/api";

const LOCALES = ["fa", "en"] as const;
type Locale = (typeof LOCALES)[number];

export async function generateStaticParams() {
  return [{ locale: "fa" }, { locale: "en" }];
}

async function getMessages(locale: Locale): Promise<GlobalMessages> {
  const loaders = {
    fa: () => import("../../messages/fa.json"),
    en: () => import("../../messages/en.json"),
  };
  const result = await loaders[locale]();
  return result.default as GlobalMessages;
}

// Safely extract an array from `{ items: T[] }` shape
function extractItems<T>(raw: unknown): T[] | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  if (Array.isArray(obj.items)) return obj.items as T[];
  return null;
}

async function fetchApiData(locale: Locale): Promise<DojoApiData> {
  const [
    homeRes,
    aboutRes,
    contactRes,
    coursesRes,
    galleryRes,
    galleryCatsRes,
    productsRes,
    productCatsRes,
    membersRes,
    memberCatsRes,
    katoriRes,
  ] = await Promise.allSettled([
    apiFetch<any>("/home", locale, { next: { revalidate: 3600 } }),
    apiFetch<any>("/about", locale, { next: { revalidate: 3600 } }),
    apiFetch<any>("/contact", locale, { next: { revalidate: 3600 } }),
    apiFetch<any>("/courses", locale, { next: { revalidate: 60 } }),
    apiFetch<any>("/gallery", locale, { next: { revalidate: 60 } }),
    apiFetch<any>("/gallery-categories", locale, { next: { revalidate: 3600 } }),
    apiFetch<any>("/products", locale, { next: { revalidate: 60 } }),
    apiFetch<any>("/product-categories", locale, { next: { revalidate: 3600 } }),
    apiFetch<any>("/members", locale, { next: { revalidate: 60 } }),
    apiFetch<any>("/member-categories", locale, { next: { revalidate: 3600 } }),
    apiFetch<any>("/katori", locale, { next: { revalidate: 3600 } }),
  ]);

  function getData(res: PromiseSettledResult<{ data: any; error: string | null }>) {
    return res.status === "fulfilled" ? res.value.data : null;
  }

  const rawHome = getData(homeRes);
  const rawAbout = getData(aboutRes);
  const rawContact = getData(contactRes);
  const rawCourses = getData(coursesRes);
  const rawGallery = getData(galleryRes);
  const rawGalleryCats = getData(galleryCatsRes);
  const rawProducts = getData(productsRes);
  const rawProductCats = getData(productCatsRes);
  const rawMembers = getData(membersRes);
  const rawMemberCats = getData(memberCatsRes);
  const rawKatori = getData(katoriRes);

  if (process.env.NODE_ENV === "development") {
    console.log("[API DEBUG] /home raw:", JSON.stringify(rawHome)?.slice(0, 200));
    console.log("[API DEBUG] /about raw:", JSON.stringify(rawAbout)?.slice(0, 200));
    console.log("[API DEBUG] /courses raw:", JSON.stringify(rawCourses)?.slice(0, 200));
    console.log("[API DEBUG] /gallery raw:", JSON.stringify(rawGallery)?.slice(0, 200));
    console.log("[API DEBUG] /members raw:", JSON.stringify(rawMembers)?.slice(0, 200));
    console.log("[API DEBUG] /products raw:", JSON.stringify(rawProducts)?.slice(0, 200));
    console.log("[API DEBUG] /katori raw:", JSON.stringify(rawKatori)?.slice(0, 200));
  }

  // ── /home → HomeData ──────────────────────────────────────────────────────
  // Actual shape: { hero: { title, japanese_title, short_description, image }, samurai_path_articles: [...] }
  const homeData = rawHome ? {
    // hero fields mapped to master so Section1 can show API shihan image/name/quote
    master: rawHome.hero ? {
      titlePrefix: null,
      name: rawHome.hero.title ?? null,
      quote: rawHome.hero.short_description ?? null,
      image: rawHome.hero.image ?? null,
      kanji: rawHome.hero.japanese_title ?? null,
      button_text: rawHome.hero.button_text ?? null,
      button_url: rawHome.hero.button_url ?? null,
    } : null,
    slides: Array.isArray(rawHome.samurai_path_articles)
      ? rawHome.samurai_path_articles.map((a: any, i: number) => ({
          id: a.id ?? i + 1,
          title: a.title ?? "",
          desc: a.short_description ?? "",
          image: a.image ?? null,
          kanji: null,
        }))
      : null,
    title: rawHome.hero?.title ?? null,
    subtitle: rawHome.hero?.short_description ?? null,
  } : null;

  // ── /about → AboutData ────────────────────────────────────────────────────
  // Actual shape: { sections: [{ id, key, title, japanese_title, short_description, image, ... }] }
  const aboutData = rawAbout ? {
    tabs: Array.isArray(rawAbout.sections)
      ? rawAbout.sections.map((s: any) => ({
          id: s.id ?? 0,
          title: s.title ?? "",
          kanji: s.japanese_title ?? null,
          content: s.short_description ?? null,
          image: s.image ?? null,
        }))
      : null,
    heading: rawAbout.sections?.[0]
      ? { title: rawAbout.sections[0].title ?? null, kanji: rawAbout.sections[0].japanese_title ?? null }
      : null,
  } : null;

  // ── /contact → ContactData ────────────────────────────────────────────────
  // Actual shape: { page: { title, ... }, contact_info: { address, phone, email, instagram_url } }
  const ci = rawContact?.contact_info;
  const contactData = rawContact ? {
    heading: rawContact.page
      ? { title: rawContact.page.title ?? null, kanji: rawContact.page.japanese_title ?? null }
      : null,
    contactInfo: ci ? ([
      ci.address ? { id: 1, kind: "address" as const, label: locale === "en" ? "Address" : "آدرس", text: ci.address } : null,
      ci.phone ? { id: 2, kind: "phone" as const, label: locale === "en" ? "Phone" : "تلفن", text: ci.phone } : null,
      ci.email ? { id: 3, kind: "email" as const, label: locale === "en" ? "Email" : "ایمیل", text: ci.email } : null,
    ].filter((x) => x !== null) as import("@/types/api").ContactInfoItem[]) : null,
    address: ci?.address ?? null,
    phone: ci?.phone ?? null,
    email: ci?.email ?? null,
  } : null;

  // ── /courses → CoursesData ────────────────────────────────────────────────
  // Actual shape: { items: [{ id, title, japanese_title, slug, duration_months, short_description, image, sort_order }] }
  const courseItems = extractItems<any>(rawCourses);
  const coursesData = rawCourses ? {
    items: courseItems?.map((c: any) => ({
      id: c.id ?? 0,
      title: c.title ?? "",
      kanji: c.japanese_title ?? null,
      description: c.short_description ?? null,
      duration: c.duration_months != null
        ? (locale === "en" ? `${c.duration_months} months` : `${c.duration_months} ماه`)
        : null,
      image: c.image ?? null,
      slug: c.slug ?? null,
      progress: null,
      requirements: null,
      skills: null,
    })) ?? null,
    milestones: null,
  } : null;

  // ── /gallery → GalleryItem[] ──────────────────────────────────────────────
  // Actual shape: { categories: [{ id, title, slug, items: [{ id, title, overlay_title, slug, image, short_description }] }] }
  // Use cat.title (not slug) for category so the gallery filter can match against category titles
  const galleryItems = rawGallery && Array.isArray(rawGallery.categories)
    ? rawGallery.categories.flatMap((cat: any) =>
        Array.isArray(cat.items)
          ? cat.items.map((item: any) => ({
              id: item.id ?? 0,
              title: item.title ?? item.overlay_title ?? "",
              slug: item.slug ?? null,
              image: item.image ?? null,
              thumbnail: item.image ?? null,
              category: cat.title ?? cat.slug ?? null,
              description: item.short_description ?? null,
            }))
          : []
      )
    : null;

  // ── /gallery-categories → GalleryCategory[] ──────────────────────────────
  // Actual shape: { items: [{ id, title, slug, sort_order }] }
  const rawGalleryCatsItems = extractItems<any>(rawGalleryCats);
  const galleryCategories = rawGalleryCatsItems?.map((c: any) => ({
    id: c.id ?? 0,
    title: c.title ?? "",
    slug: c.slug ?? null,
    name: c.title ?? null,
  })) ?? null;

  // ── /products → Product[] ─────────────────────────────────────────────────
  // Actual shape: { items: [{ id, category:{id,title,slug}, title, slug, short_description, main_image, price, contact_text }], pagination }
  const rawProductItems = extractItems<any>(rawProducts);
  const products = rawProductItems?.map((p: any) => {
    const galleryImages: Array<{ id: number; image: string; title: string | null; alt: string | null }> =
      Array.isArray(p.images)
        ? p.images
            .filter((img: any) => img?.image)
            .sort((a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
            .map((img: any) => ({
              id: img.id ?? 0,
              image: img.image ?? "",
              title: img.title ?? null,
              alt: img.alt ?? null,
            }))
        : [];
    const primaryImage = p.main_image ?? (galleryImages[0]?.image ?? null);
    return {
      id: p.id ?? 0,
      name: p.title ?? "",
      title: p.title ?? null,
      slug: p.slug ?? null,
      description: p.short_description ?? null,
      image: primaryImage,
      thumbnail: primaryImage,
      // Use category title for filter matching (Store.tsx compares category string to category filter tab)
      category: p.category?.title ?? p.category?.slug ?? null,
      price: p.price != null ? parseFloat(String(p.price)) : null,
      inStock: true,
      in_stock: true,
      badge: null,
      kanji: null,
      contact_text: p.contact_text ?? null,
      contact_url: p.contact_url ?? null,
      images: galleryImages,
    };
  }) ?? null;

  // ── /product-categories → ProductCategory[] ──────────────────────────────
  // Actual shape: { items: [{ id, title, slug, sort_order }] }
  const rawProductCatsItems = extractItems<any>(rawProductCats);
  const productCategories = rawProductCatsItems?.map((c: any) => ({
    id: c.id ?? 0,
    title: c.title ?? "",
    slug: c.slug ?? null,
    name: c.title ?? null,
  })) ?? null;

  // ── /members → Member[] ───────────────────────────────────────────────────
  // Actual shape: { items: [{ id, category:{id,title,slug}, name, member_code, tag, short_description, image }], pagination }
  const rawMemberItems = extractItems<any>(rawMembers);
  const members = rawMemberItems?.map((m: any) => ({
    id: m.id ?? 0,
    name: m.name ?? "",
    code: m.member_code ?? "",
    // level = category title so the level filter in Members.tsx can compare strings
    level: m.category?.title ?? "",
    kanji: null,
    bio: m.short_description ?? null,
    tags: m.tag ? [m.tag] : null,
    avatar: m.image ?? null,
    image: m.image ?? null,
    category: m.category?.slug ?? null,
  })) ?? null;

  // ── /member-categories → MemberCategory[] ────────────────────────────────
  // Actual shape: { items: [{ id, title, slug, sort_order }] }
  const rawMemberCatsItems = extractItems<any>(rawMemberCats);
  const memberCategories = rawMemberCatsItems?.map((c: any) => ({
    id: c.id ?? 0,
    title: c.title ?? "",
    slug: c.slug ?? null,
    name: c.title ?? null,
  })) ?? null;

  // ── /katori → KatoriData ──────────────────────────────────────────────────
  // Actual shape: { page: { title, japanese_title, short_description, ... }, articles: [...] }
  const katoriData = rawKatori ? {
    slides: Array.isArray(rawKatori.articles)
      ? rawKatori.articles.map((a: any, i: number) => ({
          id: a.id ?? i + 1,
          title: a.title ?? "",
          desc: a.short_description ?? "",
          image: a.image ?? null,
          kanji: null,
        }))
      : null,
    title: rawKatori.page?.title ?? null,
    subtitle: rawKatori.page?.short_description ?? null,
    master: null,
  } : null;

  if (process.env.NODE_ENV === "development") {
    console.log("[API NORMALIZED] homeData slides:", homeData?.slides?.length ?? 0);
    console.log("[API NORMALIZED] aboutData tabs:", aboutData?.tabs?.length ?? 0);
    console.log("[API NORMALIZED] coursesData items:", coursesData?.items?.length ?? 0);
    console.log("[API NORMALIZED] galleryItems:", galleryItems?.length ?? 0);
    console.log("[API NORMALIZED] galleryCategories:", galleryCategories?.length ?? 0);
    console.log("[API NORMALIZED] products:", products?.length ?? 0);
    console.log("[API NORMALIZED] productCategories:", productCategories?.length ?? 0);
    console.log("[API NORMALIZED] members:", members?.length ?? 0);
    console.log("[API NORMALIZED] memberCategories:", memberCategories?.length ?? 0);
    console.log("[API NORMALIZED] katoriData slides:", katoriData?.slides?.length ?? 0);
    console.log("[API NORMALIZED] contactData info:", contactData?.contactInfo?.length ?? 0);
  }

  return {
    homeData,
    aboutData,
    contactData,
    coursesData,
    galleryItems,
    galleryCategories,
    products,
    productCategories,
    members,
    memberCategories,
    katoriData,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!LOCALES.includes(locale as Locale)) notFound();

  const safeLocale = locale as Locale;

  const [messages, apiData] = await Promise.all([
    getMessages(safeLocale),
    fetchApiData(safeLocale),
  ]);

  return <DojoPageClient messages={messages} apiData={apiData} />;
}
