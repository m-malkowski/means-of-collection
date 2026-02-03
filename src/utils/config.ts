// Shared configuration used across the app
// This matches the values in config/site.yaml

import type { FiltersConfig } from "../types";

export const defaultFilterConfig: FiltersConfig = {
  priceBreakpoints: [25, 50, 100, 200, 500],
  ageBuckets: [
    { label: "This week", days: 7 },
    { label: "This month", days: 30 },
    { label: "This quarter", days: 90 },
    { label: "This year", days: 365 },
    { label: "Older", days: null },
  ],
};

export const siteConfig = {
  title: "Means of Collection",
  description: "A static archive of what I own and what I want",
  currency: "EUR",
  currencySymbol: "€",
};
