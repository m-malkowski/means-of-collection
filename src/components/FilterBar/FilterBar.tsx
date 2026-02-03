import * as React from "react";
import TextSearch from "../TextSearch";
import TagFilter from "../TagFilter";
import PriceRangeFilter from "../PriceRangeFilter";
import AgeFilter from "../AgeFilter";
import GiftFilter from "../GiftFilter";
import ResetFilters from "../ResetFilters";
import type { FilterState, AgeBucket } from "../../types";
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
}

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
}) => {
  return (
    <div className={styles.wrapper}>
      {/* Top row: Search + Quick actions */}
      <div className={styles.topRow}>
        <TextSearch
          value={filters.search}
          onChange={onSearchChange}
          placeholder="Search by name, set ID, tags..."
        />
        <div className={styles.quickActions}>
          <GiftFilter isActive={filters.giftOnly} onToggle={onGiftOnlyChange} />
          <ResetFilters onClick={onReset} hasActiveFilters={hasActiveFilters} />
        </div>
      </div>

      {/* Filter rows */}
      <div className={styles.filterRows}>
        <PriceRangeFilter
          ranges={priceRangeOptions}
          selectedRange={filters.priceRange}
          onSelectRange={onPriceRangeChange}
          currencySymbol={currencySymbol}
        />
        
        <AgeFilter
          buckets={ageBuckets}
          selectedBucket={filters.ageBucket}
          onSelectBucket={onAgeBucketChange}
        />

        {availableTags.length > 0 && (
          <TagFilter
            availableTags={availableTags}
            selectedTags={filters.tags}
            onToggleTag={onTagToggle}
          />
        )}
      </div>

      {/* Results count */}
      {hasActiveFilters && (
        <div className={styles.results}>
          <span className={styles.resultCount}>
            Showing {resultCount} of {totalCount} items
          </span>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
