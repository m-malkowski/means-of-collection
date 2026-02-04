import * as React from "react";
import * as styles from "./AgeFilter.module.css";

interface AgeBucket {
  label: string;
  days: number | null;
}

interface AgeFilterProps {
  buckets: AgeBucket[];
  selectedBucket: string | null;
  onSelectBucket: (bucket: string | null) => void;
}

const AgeFilter: React.FC<AgeFilterProps> = ({
  buckets,
  selectedBucket,
  onSelectBucket,
}) => {
  if (buckets.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.buckets}>
        <button
          type="button"
          className={`${styles.bucket} ${selectedBucket === null ? styles.selected : ""}`}
          onClick={() => onSelectBucket(null)}
          aria-pressed={selectedBucket === null}
        >
          Any time
        </button>
        {buckets.map((bucket) => {
          const isSelected = selectedBucket === bucket.label;
          return (
            <button
              key={bucket.label}
              type="button"
              className={`${styles.bucket} ${isSelected ? styles.selected : ""}`}
              onClick={() => onSelectBucket(isSelected ? null : bucket.label)}
              aria-pressed={isSelected}
            >
              {bucket.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default AgeFilter;
