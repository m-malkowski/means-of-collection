import * as React from "react";
import * as styles from "./TagFilter.module.css";

interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({
  availableTags,
  selectedTags,
  onToggleTag,
}) => {
  if (availableTags.length === 0) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.tags}>
        {availableTags.map((tag) => {
          const isSelected = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              className={`${styles.tag} ${isSelected ? styles.selected : ""}`}
              onClick={() => onToggleTag(tag)}
              aria-pressed={isSelected}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TagFilter;
