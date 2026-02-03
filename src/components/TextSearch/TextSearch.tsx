import * as React from "react";
import * as styles from "./TextSearch.module.css";

interface TextSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const TextSearch: React.FC<TextSearchProps> = ({
  value,
  onChange,
  placeholder = "Search...",
}) => {
  return (
    <div className={styles.wrapper}>
      <span className={styles.icon}>🔍</span>
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search items"
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange("")}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default TextSearch;
