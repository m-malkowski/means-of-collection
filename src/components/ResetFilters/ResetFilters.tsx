import * as React from "react";
import * as styles from "./ResetFilters.module.css";

interface ResetFiltersProps {
  onClick: () => void;
  hasActiveFilters: boolean;
}

const ResetFilters: React.FC<ResetFiltersProps> = ({
  onClick,
  hasActiveFilters,
}) => {
  if (!hasActiveFilters) {
    return null;
  }

  return (
    <button
      type="button"
      className={styles.button}
      onClick={onClick}
      aria-label="Reset all filters"
    >
      <span className={styles.icon}>✕</span>
      <span className={styles.label}>Clear filters</span>
    </button>
  );
};

export default ResetFilters;
