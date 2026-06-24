import { apiFetch } from "@/lib/api";
import type { ArticleCategory } from "@/types/api";

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
  categorySlug: string;
  image: string;
  tags: string[];
  readTime: number;
}

export interface RelatedPost {
  id: number;
  title: string;
  slug: string;
  image: string;
  publishDate: string;
}

// Actual API article shape (both in list and single)
interface RawArticle {
  id?: number;
  title?: string | null;
  slug?: string | null;
  short_description?: string | null;
  excerpt?: string | null;
  content?: string | null;
  body?: string | null;
  author?: string | null;
  reading_time?: number | null;
  read_time?: number | null;
  published_at?: string | null;
  created_at?: string | null;
  image?: string | null;
  thumbnail?: string | null;
  tags?: string[] | null;
  // category can be an object { id, title, slug } or a string
  category?: { id?: number; title?: string; slug?: string } | string | null;
  category_slug?: string | null;
}

function normalizeArticle(a: RawArticle): BlogPost {
  const catObj = typeof a.category === "object" && a.category !== null ? a.category : null;
  const catSlug = catObj?.slug ?? (typeof a.category === "string" ? a.category : null) ?? a.category_slug ?? "";
  const catTitle = catObj?.title ?? catSlug;

  if (process.env.NODE_ENV === "development") {
    console.log(`[BLOG] article "${a.title}" — category:`, catTitle, "slug:", catSlug);
  }

  return {
    id: a.id ?? 0,
    title: a.title ?? "",
    slug: a.slug ?? String(a.id ?? ""),
    excerpt: a.short_description ?? a.excerpt ?? "",
    content: a.content ?? a.body ?? "",
    author: a.author ?? "",
    publishDate: a.published_at ?? a.created_at ?? "",
    category: catTitle,
    categorySlug: catSlug,
    image: a.image ?? a.thumbnail ?? "",
    tags: Array.isArray(a.tags) ? a.tags : [],
    readTime: a.reading_time ?? a.read_time ?? 5,
  };
}

// Extract items from either array, { items }, or { data }
function extractArticles(raw: unknown): RawArticle[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "object" && raw !== null) {
    const obj = raw as Record<string, unknown>;
    if (Array.isArray(obj.items)) return obj.items as RawArticle[];
    if (Array.isArray(obj.data)) return obj.data as RawArticle[];
  }
  return [];
}

export async function getBlogPosts(locale = "fa", category?: string, search?: string, limit?: number): Promise<BlogPost[]> {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (search) params.set("search", search);
  if (limit) params.set("limit", String(limit));

  const path = params.toString() ? `/articles?${params}` : "/articles";
  const result = await apiFetch<unknown>(path, locale, { next: { revalidate: 60 } });

  if (result.error || !result.data) return [];

  const items = extractArticles(result.data);

  if (process.env.NODE_ENV === "development") {
    console.log(`[BLOG] getBlogPosts(${locale}) → ${items.length} articles`);
  }

  return items.filter(Boolean).map(normalizeArticle);
}

export async function getBlogPostBySlug(slug: string, locale = "fa"): Promise<BlogPost | null> {
  const result = await apiFetch<unknown>(`/articles/${slug}`, locale, { next: { revalidate: 60 } });
  if (result.error || !result.data) return null;

  // Single article might be returned as the object directly or wrapped in { data }
  const raw = result.data as RawArticle;

  if (process.env.NODE_ENV === "development") {
    console.log(`[BLOG] getBlogPostBySlug("${slug}", ${locale}) →`, raw?.title ?? "null");
  }

  return normalizeArticle(raw);
}

export async function getRelatedBlogPosts(currentPostId: number, category: string, locale = "fa"): Promise<RelatedPost[]> {
  const result = await apiFetch<unknown>(
    `/articles?category=${encodeURIComponent(category)}&limit=4`,
    locale,
    { next: { revalidate: 60 } }
  );

  if (result.error || !result.data) return [];

  const items = extractArticles(result.data);

  return items
    .filter((a) => a.id !== currentPostId)
    .slice(0, 3)
    .map((a) => ({
      id: a.id ?? 0,
      title: a.title ?? "",
      slug: a.slug ?? String(a.id ?? ""),
      image: a.image ?? a.thumbnail ?? "",
      publishDate: a.published_at ?? a.created_at ?? "",
    }));
}

export async function getArticleCategories(locale = "fa"): Promise<ArticleCategory[]> {
  const result = await apiFetch<unknown>("/article-categories", locale, { next: { revalidate: 3600 } });
  if (!result.data) return [];

  if (Array.isArray(result.data)) return result.data as ArticleCategory[];
  const obj = result.data as Record<string, unknown>;
  if (Array.isArray(obj.items)) return obj.items as ArticleCategory[];
  return [];
}
