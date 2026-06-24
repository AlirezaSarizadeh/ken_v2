// API response types — all fields optional (nullable from server)

export type Locale = "fa" | "en";

// ── Auth ────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  avatar?: string;
}

export interface AuthResponse {
  token?: string;
  user?: AuthUser;
}

// ── Home ────────────────────────────────────────────────────────────────────

export interface HomeSlide {
  id?: number;
  title?: string;
  desc?: string | null;
  description?: string | null;
  image?: string | null;
  kanji?: string | null;
}

export interface HomeMaster {
  titlePrefix?: string | null;
  name?: string | null;
  quote?: string | null;
  image?: string | null;
}

export interface HomeData {
  master?: HomeMaster | null;
  slides?: HomeSlide[] | null;
  title?: string | null;
  subtitle?: string | null;
}

// ── About ────────────────────────────────────────────────────────────────────

export interface AboutTab {
  id?: number;
  title?: string | null;
  kanji?: string | null;
  content?: string | null;
  image?: string | null;
}

export interface AboutData {
  heading?: { title?: string | null; kanji?: string | null } | null;
  founded?: { label?: string | null; value?: string | null } | null;
  tabs?: AboutTab[] | null;
  title?: string | null;
  description?: string | null;
}

export interface TarikhcheData {
  title?: string | null;
  content?: string | null;
  items?: Array<{ title?: string | null; content?: string | null; year?: string | null }> | null;
}

// ── Contact ──────────────────────────────────────────────────────────────────

export interface ContactInfoItem {
  id?: number;
  kind?: "address" | "phone" | "email" | string | null;
  label?: string | null;
  text?: string | null;
  value?: string | null;
}

export interface ContactData {
  heading?: { title?: string | null; kanji?: string | null } | null;
  contactInfo?: ContactInfoItem[] | null;
  items?: ContactInfoItem[] | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
}

// ── Courses ──────────────────────────────────────────────────────────────────

export interface CourseLevel {
  id?: number;
  title?: string | null;
  kanji?: string | null;
  description?: string | null;
  duration?: string | null;
  image?: string | null;
  progress?: number | null;
  requirements?: string[] | null;
  skills?: string[] | null;
  slug?: string | null;
}

export interface CourseMilestone {
  title?: string | null;
  kanji?: string | null;
  completed?: boolean | null;
}

export interface CoursesData {
  levels?: CourseLevel[] | null;
  milestones?: CourseMilestone[] | null;
  items?: CourseLevel[] | null;
}

// ── Gallery ──────────────────────────────────────────────────────────────────

export interface GalleryCategory {
  id?: number;
  title?: string | null;
  slug?: string | null;
  name?: string | null;
}

export interface GalleryItem {
  id?: number;
  title?: string | null;
  slug?: string | null;
  image?: string | null;
  thumbnail?: string | null;
  category?: string | null;
  category_id?: number | null;
  description?: string | null;
  images?: string[] | null;
}

// ── Products ─────────────────────────────────────────────────────────────────

export interface ProductCategory {
  id?: number;
  title?: string | null;
  slug?: string | null;
  name?: string | null;
}

export interface ProductTag {
  id?: number;
  title?: string | null;
  slug?: string | null;
}

export interface Product {
  id?: number;
  name?: string | null;
  title?: string | null;
  kanji?: string | null;
  description?: string | null;
  origin?: string | null;
  material?: string | null;
  image?: string | null;
  thumbnail?: string | null;
  images?: string[] | null;
  gallery?: string[] | null;
  category?: string | null;
  category_slug?: string | null;
  price?: number | null;
  inStock?: boolean | null;
  in_stock?: boolean | null;
  badge?: string | null;
  slug?: string | null;
  tags?: ProductTag[] | null;
}

// ── Members ──────────────────────────────────────────────────────────────────

export interface MemberCategory {
  id?: number;
  title?: string | null;
  slug?: string | null;
  name?: string | null;
}

export interface Member {
  id?: number;
  name?: string | null;
  code?: string | null;
  level?: string | null;
  kanji?: string | null;
  bio?: string | null;
  tags?: string[] | null;
  avatar?: string | null;
  image?: string | null;
  category?: string | null;
}

// ── Katori ────────────────────────────────────────────────────────────────────

export interface KatoriSlide {
  id?: number;
  title?: string | null;
  desc?: string | null;
  description?: string | null;
  image?: string | null;
  kanji?: string | null;
}

export interface KatoriData {
  master?: HomeMaster | null;
  slides?: KatoriSlide[] | null;
  title?: string | null;
  subtitle?: string | null;
}

// ── Articles ─────────────────────────────────────────────────────────────────

export interface ArticleCategory {
  id?: number;
  title?: string | null;
  slug?: string | null;
  name?: string | null;
}

export interface Article {
  id?: number;
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  summary?: string | null;
  content?: string | null;
  body?: string | null;
  author?: string | null;
  author_name?: string | null;
  publishDate?: string | null;
  published_at?: string | null;
  created_at?: string | null;
  category?: string | null;
  category_slug?: string | null;
  image?: string | null;
  thumbnail?: string | null;
  tags?: string[] | null;
  readTime?: number | null;
  read_time?: number | null;
}

// ── Paginated wrapper ─────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data?: T[] | null;
  items?: T[] | null;
  total?: number | null;
  per_page?: number | null;
  current_page?: number | null;
}

// ── DojoApiData (passed from page.tsx → DojoPageClient → sections) ────────────

export interface DojoApiData {
  homeData: HomeData | null;
  aboutData: AboutData | null;
  contactData: ContactData | null;
  coursesData: CoursesData | null;
  galleryItems: GalleryItem[] | null;
  galleryCategories: GalleryCategory[] | null;
  products: Product[] | null;
  productCategories: ProductCategory[] | null;
  members: Member[] | null;
  memberCategories: MemberCategory[] | null;
  katoriData: KatoriData | null;
}
