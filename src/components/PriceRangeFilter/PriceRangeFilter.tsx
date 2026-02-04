import * as React from "react";
import * as styles from "./PriceRangeFilter.module.css";

interface PriceRangeFilterProps {
  ranges: string[];
  selectedRange: string | null;
  onSelectRange: (range: string | null) => void;
  currencySymbol?: string;
}

function formatRange(range: string, symbol: string): string {
  if (range.endsWith("+")) {
    const min = range.slice(0, -1);
    return `${symbol}${min}+`;
  }
  const [min, max] = range.split("-");
  return `${symbol}${min}-${symbol}${max}`;
}

const PriceRangeFilter: React.FC<PriceRangeFilterProps> = ({
  ranges,
  selectedRange,
  onSelectRange,
  currencySymbol = "€",
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.ranges}>
        <button
          type="button"
          className={`${styles.range} ${selectedRange === null ? styles.selected : ""}`}
          onClick={() => onSelectRange(null)}
          aria-pressed={selectedRange === null}
        >
          All
        </button>
        {ranges.map((range) => {
          const isSelected = selectedRange === range;
          return (
            <button
              key={range}
              type="button"
              className={`${styles.range} ${isSelected ? styles.selected : ""}`}
              onClick={() => onSelectRange(isSelected ? null : range)}
              aria-pressed={isSelected}
            >
              {formatRange(range, currencySymbol)}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PriceRangeFilter;
