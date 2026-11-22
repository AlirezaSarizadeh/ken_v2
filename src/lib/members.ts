import { unstable_cache } from "next/cache";
import type { Member } from "@/types/api";
import { apiFetch } from "./api";

interface MemberPage {
  items: {
    id: number;
    name: string | null;
    member_code: string | null;
    category: { title: string | null } | null;
    short_description: string | null;
    tag: string | null;
    image?: string | null;
  }[];
  pagination: { current_page: number; last_page: number; total: number };
}

const PAGE_SIZE = 50;
const CONCURRENT_PAGES = 4;

function normalizeMemberCode(code: string | null) {
  const value = (code ?? "").trim();
  if (!value || /^TEMP[-_]?/i.test(value)) return "";
  return /^IR/i.test(value) ? value : `IR${value.replace(/\D/g, "")}`;
}

async function loadMemberPage(locale: string, page: number): Promise<MemberPage> {
  const { data, error } = await apiFetch<MemberPage>(
    `/members?limit=${PAGE_SIZE}&page=${page}`,
    locale,
  );

  if (error || !data || !Array.isArray(data.items) || data.pagination?.current_page !== page) {
    throw new Error(`Could not load members page ${page}: ${error ?? "Invalid response"}`);
  }
  return data;
}

const loadMembers = unstable_cache(
  async (locale: string): Promise<Member[]> => {
    const first = await loadMemberPage(locale, 1);
    const { last_page: lastPage, total } = first.pagination;
    if (!Number.isSafeInteger(lastPage) || lastPage < 1) {
      throw new Error("Invalid member page count");
    }

    const items = [...first.items];
    for (let page = 2; page <= lastPage; page += CONCURRENT_PAGES) {
      const pages = await Promise.all(
        Array.from(
          { length: Math.min(CONCURRENT_PAGES, lastPage - page + 1) },
          (_, index) => loadMemberPage(locale, page + index),
        ),
      );
      for (const result of pages) {
        items.push(...result.items);
      }
    }

    if (items.length !== total || new Set(items.map((item) => item.id)).size !== total) {
      throw new Error("Member roster changed during pagination");
    }

    // The API orders each page by sort_order and id.
    return items.map((item) => ({
      id: item.id,
      name: item.name ?? "",
      code: normalizeMemberCode(item.member_code),
      level: item.category?.title ?? "",
      bio: item.short_description,
      tags: item.tag ? [item.tag] : [],
      image: item.image ?? null,
    }));
  },
  ["academy-members"],
  { revalidate: 60 },
);

export async function fetchMembers(locale: string): Promise<Member[] | null> {
  try {
    return await loadMembers(locale);
  } catch (error) {
    console.error("[members]", error);
    return null;
  }
}
