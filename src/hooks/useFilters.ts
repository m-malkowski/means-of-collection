import { useState, useCallback, useEffect, useMemo } from "react";
import Fuse, { IFuseOptions } from "fuse.js";
import type { ItemYamlNode, FilterState, FiltersConfig } from "../types";

// Default filter state
const defaultFilterState: FilterState = {
  search: "",
  categories: [],
  tags: [],
  priceRange: null,
  ageBucket: null,
  status: "all",
  giftOnly: false,
};

// Fuse.js options for fuzzy search
const fuseOptions: IFuseOptions<ItemYamlNode> = {
  keys: [
    { name: "name", weight: 0.4 },
    { name: "tags", weight: 0.3 },
    { name: "setId", weight: 0.2 },
    { name: "notes", weight: 0.1 },
  ],
  threshold: 0.4,
  ignoreLocation: true,
  minMatchCharLength: 2,
};

// Parse URL search params into filter state
function parseUrlParams(): Partial<FilterState> {
  if (typeof window === "undefined") return {};

  const params = new URLSearchParams(window.location.search);
  const state: Partial<FilterState> = {};

  const search = params.get("q");
  if (search) state.search = search;

  const tags = params.get("tags");
  if (tags) state.tags = tags.split(",").filter(Boolean);

  const priceRange = params.get("price");
  if (priceRange) state.priceRange = priceRange;

  const ageBucket = params.get("age");
  if (ageBucket) state.ageBucket = ageBucket;

  const giftOnly = params.get("gift");
  if (giftOnly === "true") state.giftOnly = true;

  return state;
}

// Serialize filter state to URL search params
function serializeToUrl(state: FilterState): string {
  const params = new URLSearchParams();

  if (state.search) params.set("q", state.search);
  if (state.tags.length > 0) params.set("tags", state.tags.join(","));
  if (state.priceRange) params.set("price", state.priceRange);
  if (state.ageBucket) params.set("age", state.ageBucket);
  if (state.giftOnly) params.set("gift", "true");

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

// Parse price range string into min/max values
export function parsePriceRange(
  range: string,
  breakpoints: number[]
): { min: number | null; max: number | null } {
  if (!range) return { min: null, max: null };

  if (range.endsWith("+")) {
    const min = parseInt(range.slice(0, -1), 10);
    return { min, max: null };
  }

  const [minStr, maxStr] = range.split("-");
  return {
    min: minStr ? parseInt(minStr, 10) : null,
    max: maxStr ? parseInt(maxStr, 10) : null,
  };
}

// Generate price range options from breakpoints
export function generatePriceRanges(breakpoints: number[]): string[] {
  const ranges: string[] = [];

  // First range: 0 to first breakpoint
  if (breakpoints.length > 0) {
    ranges.push(`0-${breakpoints[0]}`);
  }

  // Middle ranges
  for (let i = 0; i < breakpoints.length - 1; i++) {
    ranges.push(`${breakpoints[i]}-${breakpoints[i + 1]}`);
  }

  // Last range: above last breakpoint
  if (breakpoints.length > 0) {
    ranges.push(`${breakpoints[breakpoints.length - 1]}+`);
  }

  return ranges;
}

// Check if item matches price range
function matchesPriceRange(
  item: ItemYamlNode,
  range: string | null,
  breakpoints: number[]
): boolean {
  if (!range) return true;

  const price = item.genuinePrice ?? item.referenceRetailPrice ?? 0;
  const { min, max } = parsePriceRange(range, breakpoints);

  if (min !== null && price < min) return false;
  if (max !== null && price >= max) return false;

  return true;
}

// Check if item matches age bucket
function matchesAgeBucket(
  item: ItemYamlNode,
  ageBucket: string | null,
  ageBuckets: { label: string; days: number | null }[]
): boolean {
  if (!ageBucket) return true;

  const bucket = ageBuckets.find((b) => b.label === ageBucket);
  if (!bucket) return true;

  const itemDate = new Date(item.dateAdded);
  const now = new Date();
  const daysDiff = Math.floor(
    (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  // "Older" bucket - days is null, meaning anything beyond last defined bucket
  if (bucket.days === null) {
    const maxDays = Math.max(
      ...ageBuckets.filter((b) => b.days !== null).map((b) => b.days as number)
    );
    return daysDiff > maxDays;
  }

  return daysDiff <= bucket.days;
}

// Check if item matches tags filter
function matchesTags(item: ItemYamlNode, tags: string[]): boolean {
  if (tags.length === 0) return true;
  if (!item.tags || item.tags.length === 0) return false;

  // Item must have at least one of the selected tags
  return tags.some((tag) => item.tags?.includes(tag));
}

interface UseFiltersOptions {
  items: ItemYamlNode[];
  config?: FiltersConfig;
  syncUrl?: boolean;
}

interface UseFiltersResult {
  filters: FilterState;
  filteredItems: ItemYamlNode[];
  setSearch: (search: string) => void;
  toggleTag: (tag: string) => void;
  setTags: (tags: string[]) => void;
  setPriceRange: (range: string | null) => void;
  setAgeBucket: (bucket: string | null) => void;
  setGiftOnly: (giftOnly: boolean) => void;
  resetFilters: () => void;
  hasActiveFilters: boolean;
  availableTags: string[];
  priceRangeOptions: string[];
}

export function useFilters({
  items,
  config,
  syncUrl = true,
}: UseFiltersOptions): UseFiltersResult {
  // Initialize state from URL params
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...defaultFilterState,
    ...parseUrlParams(),
  }));

  // Create Fuse.js instance for search
  const fuse = useMemo(() => new Fuse(items, fuseOptions), [items]);

  // Generate price range options
  const priceRangeOptions = useMemo(
    () => generatePriceRanges(config?.priceBreakpoints ?? [25, 50, 100, 200, 500]),
    [config?.priceBreakpoints]
  );

  // Extract all unique tags from items
  const availableTags = useMemo(() => {
    const tagSet = new Set<string>();
    items.forEach((item) => {
      item.tags?.forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [items]);

  // Sync filters to URL
  useEffect(() => {
    if (!syncUrl || typeof window === "undefined") return;

    const url = serializeToUrl(filters);
    const newUrl = `${window.location.pathname}${url}`;
    window.history.replaceState(null, "", newUrl);
  }, [filters, syncUrl]);

  // Filter items based on current filter state
  const filteredItems = useMemo(() => {
    let result = items;

    // Apply text search using Fuse.js
    if (filters.search.length >= 2) {
      const searchResults = fuse.search(filters.search);
      result = searchResults.map((r) => r.item);
    }

    // Apply tag filter
    result = result.filter((item) => matchesTags(item, filters.tags));

    // Apply price range filter
    result = result.filter((item) =>
      matchesPriceRange(
        item,
        filters.priceRange,
        config?.priceBreakpoints ?? [25, 50, 100, 200, 500]
      )
    );

    // Apply age bucket filter
    result = result.filter((item) =>
      matchesAgeBucket(
        item,
        filters.ageBucket,
        config?.ageBuckets ?? []
      )
    );

    // Apply gift-only filter
    if (filters.giftOnly) {
      result = result.filter((item) => item.isGift);
    }

    return result;
  }, [items, filters, fuse, config]);

  // Action handlers
  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  }, []);

  const setTags = useCallback((tags: string[]) => {
    setFilters((prev) => ({ ...prev, tags }));
  }, []);

  const setPriceRange = useCallback((priceRange: string | null) => {
    setFilters((prev) => ({ ...prev, priceRange }));
  }, []);

  const setAgeBucket = useCallback((ageBucket: string | null) => {
    setFilters((prev) => ({ ...prev, ageBucket }));
  }, []);

  const setGiftOnly = useCallback((giftOnly: boolean) => {
    setFilters((prev) => ({ ...prev, giftOnly }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(defaultFilterState);
  }, []);

  // Check if any filters are active
  const hasActiveFilters =
    filters.search !== "" ||
    filters.tags.length > 0 ||
    filters.priceRange !== null ||
    filters.ageBucket !== null ||
    filters.giftOnly;

  return {
    filters,
    filteredItems,
    setSearch,
    toggleTag,
    setTags,
    setPriceRange,
    setAgeBucket,
    setGiftOnly,
    resetFilters,
    hasActiveFilters,
    availableTags,
    priceRangeOptions,
  };
}

export default useFilters;
