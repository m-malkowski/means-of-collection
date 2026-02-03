import * as React from "react";
import type { ViewMode } from "../../types";
import * as styles from "./ViewToggle.module.css";

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewChange }) => {
  return (
    <div className={styles.toggle} role="group" aria-label="View mode">
      <button
        className={`${styles.button} ${viewMode === "gallery" ? styles.active : ""}`}
        onClick={() => onViewChange("gallery")}
        aria-pressed={viewMode === "gallery"}
        title="Gallery view"
      >
        <span className={styles.icon}>▦</span>
        <span className={styles.label}>Gallery</span>
      </button>
      <button
        className={`${styles.button} ${viewMode === "list" ? styles.active : ""}`}
        onClick={() => onViewChange("list")}
        aria-pressed={viewMode === "list"}
        title="List view"
      >
        <span className={styles.icon}>≡</span>
        <span className={styles.label}>List</span>
      </button>
    </div>
  );
};

export default ViewToggle;
