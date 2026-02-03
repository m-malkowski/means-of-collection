import * as React from "react";
import * as styles from "./GiftFilter.module.css";

interface GiftFilterProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

const GiftFilter: React.FC<GiftFilterProps> = ({ isActive, onToggle }) => {
  return (
    <button
      type="button"
      className={`${styles.button} ${isActive ? styles.active : ""}`}
      onClick={() => onToggle(!isActive)}
      aria-pressed={isActive}
      title="Show only gift ideas"
    >
      <span className={styles.icon}>🎁</span>
      <span className={styles.label}>Gifts only</span>
    </button>
  );
};

export default GiftFilter;
