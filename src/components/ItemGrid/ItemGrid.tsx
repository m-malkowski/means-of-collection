import * as React from "react";
import type { ItemYamlNode } from "../../types";
import ItemCard from "../ItemCard";
import ItemRow from "../ItemRow";
import type { ViewMode } from "../../types";
import * as styles from "./ItemGrid.module.css";

interface ItemGridProps {
  items: ItemYamlNode[];
  viewMode?: ViewMode;
  currencySymbol?: string;
}

const ItemGrid: React.FC<ItemGridProps> = ({
  items,
  viewMode = "gallery",
  currencySymbol = "€",
}) => {
  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <span className={styles.emptyIcon}>📦</span>
        <p className={styles.emptyText}>No items found</p>
        <p className={styles.emptyHint}>Try adjusting your filters</p>
      </div>
    );
  }

  if (viewMode === "list") {
    return (
      <div className={styles.list}>
        <div className={styles.listHeader}>
          <span className={styles.headerName}>Name</span>
          <span className={styles.headerDetails}>Details</span>
          <span className={styles.headerPrice}>Price</span>
        </div>
        {items.map((item) => (
          <ItemRow key={item.id} item={item} currencySymbol={currencySymbol} />
        ))}
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <ItemCard key={item.id} item={item} currencySymbol={currencySymbol} />
      ))}
    </div>
  );
};

export default ItemGrid;
