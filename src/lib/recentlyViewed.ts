const STORAGE_KEY = "factorybuyo_recently_viewed";
const MAX_ITEMS = 6;

export type RecentlyViewedItem = { slug: string; name: string };

export function getRecentlyViewed(): RecentlyViewedItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RecentlyViewedItem[]) : [];
  } catch {
    return [];
  }
}

export function addRecentlyViewed(item: RecentlyViewedItem) {
  if (typeof window === "undefined") return;
  const current = getRecentlyViewed().filter((i) => i.slug !== item.slug);
  const next = [item, ...current].slice(0, MAX_ITEMS);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
