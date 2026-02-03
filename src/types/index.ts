// TypeScript type definitions for the collection app

// ============================================
// Configuration Types
// ============================================

export interface SiteConfig {
  title: string;
  description: string;
  currency: string;
  currencySymbol: string;
  siteUrl?: string;
  author?: string;
}

export interface AgeBucket {
  label: string;
  days: number | null;
}

export interface FiltersConfig {
  priceBreakpoints: number[];
  ageBuckets: AgeBucket[];
}

export interface ThemeConfig {
  defaultMode: "dark" | "light";
  accentColor?: string;
}

export interface Config {
  site: SiteConfig;
  filters: FiltersConfig;
  theme: ThemeConfig;
}

// ============================================
// Item Types
// ============================================

export type ItemStatus = "owned" | "wishlist";

export type ItemCategory = "lego"; // Add more as needed: | "books" | "games"

// Common fields shared by all items
export interface BaseItem {
  id: string;
  name: string;
  category: ItemCategory;
  status: ItemStatus;
  isGift: boolean;
  tags?: string[];
  retailPrice?: number;
  purchasePrice?: number;
  storeUrl?: string;
  notes?: string;
  images?: string[];
  dateAdded: string; // ISO date string
  dateBought?: string | null; // ISO date string, null for wishlist
}

// LEGO-specific fields
export interface LegoItem extends BaseItem {
  category: "lego";
  setId: string;
  partCount?: number;
  isRetired?: boolean;
  minifigCount?: number;
  yearReleased?: number;
}

// Union of all item types
export type Item = LegoItem; // Add more: | BookItem | GameItem

// ============================================
// Filter State Types
// ============================================

export interface FilterState {
  search: string;
  categories: ItemCategory[];
  tags: string[];
  priceRange: string | null; // e.g., "0-25", "25-50", "500+"
  ageBucket: string | null; // label from config
  status: ItemStatus | "all";
  giftOnly: boolean;
}

export type SortField = "name" | "price" | "dateAdded" | "dateBought";
export type SortDirection = "asc" | "desc";

export interface SortState {
  field: SortField;
  direction: SortDirection;
}

// ============================================
// View Types
// ============================================

export type ViewMode = "gallery" | "list";

// ============================================
// GraphQL Query Result Types
// ============================================

export interface ItemYamlNode {
  id: string;
  name: string;
  category: string;
  status: string;
  isGift: boolean;
  tags?: string[];
  retailPrice?: number;
  purchasePrice?: number;
  storeUrl?: string;
  notes?: string;
  images?: string[];
  dateAdded: string;
  dateBought?: string;
  // LEGO fields
  setId?: string;
  partCount?: number;
  isRetired?: boolean;
  minifigCount?: number;
  yearReleased?: number;
}

export interface AllItemsQueryResult {
  allItemsYaml: {
    nodes: ItemYamlNode[];
  };
}

export interface ConfigYamlNode {
  site: SiteConfig;
  filters: FiltersConfig;
  theme: ThemeConfig;
}

export interface ConfigQueryResult {
  configYaml: ConfigYamlNode;
}
