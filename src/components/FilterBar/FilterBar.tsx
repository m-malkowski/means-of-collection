import * as React from "react";
import TextSearch from "../TextSearch";
import TagFilter from "../TagFilter";
import PriceRangeFilter from "../PriceRangeFilter";
import AgeFilter from "../AgeFilter";
import GiftFilter from "../GiftFilter";
import ResetFilters from "../ResetFilters";
import type { FilterState, AgeBucket, SortOption } from "../../types";
import * as styles from "./FilterBar.module.css";

interface FilterBarProps {
  filters: FilterState;
  onSearchChange: (search: string) => void;
  onTagToggle: (tag: string) => void;
  onPriceRangeChange: (range: string | null) => void;
  onAgeBucketChange: (bucket: string | null) => void;
  onGiftOnlyChange: (giftOnly: boolean) => void;
  onReset: () => void;
  availableTags: string[];
  priceRangeOptions: string[];
  ageBuckets?: AgeBucket[];
  hasActiveFilters: boolean;
  currencySymbol?: string;
  resultCount: number;
  totalCount: number;
  sortOption?: SortOption;
  onSortChange?: (sort: SortOption) => void;
  showFilters: boolean;
  showSort: boolean;
  onToggleFilters: () => void;
  onToggleSort: () => void;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" },
  { value: "price-asc", label: "Price ↑" },
  { value: "price-desc", label: "Price ↓" },
  { value: "date-asc", label: "Oldest" },
  { value: "date-desc", label: "Newest" },
];

// Export toolbar buttons component for use in PageHeader
export const FilterToolbar: React.FC<{
  showFilters: boolean;
  showSort: boolean;
  onToggleFilters: () => void;
  onToggleSort: () => void;
  hasActiveFilters: boolean;
}> = ({ showFilters, showSort, onToggleFilters, onToggleSort, hasActiveFilters }) => (
  <div className={styles.toolbar}>
    <button
      className={`${styles.toolbarButton} ${showFilters ? styles.active : ""} ${hasActiveFilters ? styles.hasFilters : ""}`}
      onClick={onToggleFilters}
      aria-label="Toggle filters"
      title="Filters"
    >
      ⚙
    </button>
    <button
      className={`${styles.toolbarButton} ${showSort ? styles.active : ""}`}
      onClick={onToggleSort}
      aria-label="Toggle sort options"
      title="Sort"
    >
      ↕
    </button>
  </div>
);

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onSearchChange,
  onTagToggle,
  onPriceRangeChange,
  onAgeBucketChange,
  onGiftOnlyChange,
  onReset,
  availableTags,
  priceRangeOptions,
  ageBuckets = [],
  hasActiveFilters,
  currencySymbol = "€",
  resultCount,
  totalCount,
  sortOption = "name-asc",
  onSortChange,
  showFilters,
  showSort,
  onToggleFilters,
  onToggleSort,
}) => {

  // Helper to format price range with currency symbol
  const formatPriceRange = (range: string): string => {
    if (range.endsWith("+")) {
      const min = range.slice(0, -1);
      return `${currencySymbol}${min}+`;
    }
    const [min, max] = range.split("-");
    return `${currencySymbol}${min}-${currencySymbol}${max}`;
  };

  // Build list of active filter pills
  const activePills: { label: string; onRemove: () => void }[] = [];
  
  if (filters.search) {
    activePills.push({
      label: `"${filters.search}"`,
      onRemove: () => onSearchChange(""),
    });
  }
  
  if (filters.priceRange) {
    activePills.push({
      label: formatPriceRange(filters.priceRange),
      onRemove: () => onPriceRangeChange(null),
    });
  }
  
  if (filters.ageBucket) {
    activePills.push({
      label: `Added: ${filters.ageBucket}`,
      onRemove: () => onAgeBucketChange(null),
    });
  }
  
  if (filters.giftOnly) {
    activePills.push({
      label: "Gifts only",
      onRemove: () => onGiftOnlyChange(false),
    });
  }
  
  filters.tags.forEach((tag) => {
    activePills.push({
      label: tag,
      onRemove: () => onTagToggle(tag),
    });
  });

  return (
    <div className={styles.wrapper}>
      {/* Active filter pills (shown when panel is closed) */}
      {!showFilters && activePills.length > 0 && (
        <div className={styles.activePills}>
          {activePills.map((pill, index) => (
            <button
              key={index}
              className={styles.activePill}
              onClick={pill.onRemove}
              title={`Remove filter: ${pill.label}`}
            >
              {pill.label}
              <span className={styles.pillRemove}>×</span>
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {hasActiveFilters && (
        <div className={styles.results}>
          Showing {resultCount} of {totalCount} items
        </div>
      )}

      {/* Sort panel */}
      <div className={`${styles.sortPanel} ${!showSort ? styles.hidden : ""}`}>
        <div className={styles.sortOptions}>
          {sortOptions.map((option) => (
            <button
              key={option.value}
              className={`${styles.sortOption} ${sortOption === option.value ? styles.selected : ""}`}
              onClick={() => onSortChange?.(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filter panel */}
      <div className={`${styles.filterPanel} ${!showFilters ? styles.hidden : ""}`}>
        <div className={styles.panelSection}>
          <div className={styles.sectionTitle}>Search</div>
          <TextSearch
            value={filters.search}
            onChange={onSearchChange}
            placeholder="Search by name, set ID, tags..."
          />
        </div>

        <div className={styles.panelSection}>
          <div className={styles.sectionTitle}>Price Range</div>
          <PriceRangeFilter
            ranges={priceRangeOptions}
            selectedRange={filters.priceRange}
            onSelectRange={onPriceRangeChange}
            currencySymbol={currencySymbol}
          />
        </div>

        <div className={styles.panelSection}>
          <div className={styles.sectionTitle}>Added</div>
          <AgeFilter
            buckets={ageBuckets}
            selectedBucket={filters.ageBucket}
            onSelectBucket={onAgeBucketChange}
          />
        </div>

        {availableTags.length > 0 && (
          <div className={styles.panelSection}>
            <div className={styles.sectionTitle}>Tags</div>
            <TagFilter
              availableTags={availableTags}
              selectedTags={filters.tags}
              onToggleTag={onTagToggle}
            />
          </div>
        )}

        <div className={styles.panelSection}>
          <GiftFilter isActive={filters.giftOnly} onToggle={onGiftOnlyChange} />
        </div>

        <div className={styles.panelActions}>
          <ResetFilters onClick={onReset} hasActiveFilters={hasActiveFilters} />
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
