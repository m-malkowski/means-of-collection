import * as React from "react";
import { Link } from "gatsby";
import type { ItemYamlNode } from "../../types";
import * as styles from "./ItemCard.module.css";

interface ItemCardProps {
  item: ItemYamlNode;
  currencySymbol?: string;
}

const ItemCard: React.FC<ItemCardProps> = ({ item, currencySymbol = "€" }) => {
  const price = item.purchasePrice || item.retailPrice;
  const showSavings =
    item.purchasePrice &&
    item.retailPrice &&
    item.purchasePrice < item.retailPrice;
  const savings = showSavings
    ? item.retailPrice! - item.purchasePrice!
    : 0;

  const itemUrl = `/item/${item.id}/`;

  return (
    <article className={styles.card}>
      <Link to={itemUrl} className={styles.cardLink} aria-label={`View details for ${item.name}`}>
        <div className={styles.imageContainer}>
          {/* Placeholder for image - will be enhanced in Phase 4 */}
          <div className={styles.imagePlaceholder}>
            <span className={styles.placeholderIcon}>🧱</span>
            {item.setId && (
              <span className={styles.setIdOverlay}>#{item.setId}</span>
            )}
          </div>
        </div>

        <div className={styles.content}>
          <h3 className={styles.title}>{item.name}</h3>

          <div className={styles.meta}>
            {item.setId && (
              <span className={styles.setId}>Set #{item.setId}</span>
            )}
            {item.partCount && (
              <span className={styles.parts}>{item.partCount} pcs</span>
            )}
          </div>

          <div className={styles.footer}>
            <div className={styles.priceContainer}>
              {price && (
                <span className={styles.price}>
                  {currencySymbol}
                  {price.toFixed(2)}
                </span>
              )}
              {showSavings && (
                <span className={styles.savings}>
                  -{currencySymbol}
                  {savings.toFixed(2)}
                </span>
              )}
            </div>

            <div className={styles.badges}>
              {item.isGift && (
                <span
                  className={`${styles.badge} ${
                    item.status === "owned" ? styles.badgeGift : styles.badgeGiftIdea
                  }`}
                >
                  🎁 {item.status === "owned" ? "GIFT" : "GIFT IDEA"}
                </span>
              )}
              {item.isRetired && (
                <span className={`${styles.badge} ${styles.badgeRetired}`}>
                  RETIRED
                </span>
              )}
            </div>
          </div>

          {item.tags && item.tags.length > 0 && (
            <div className={styles.tags}>
              {item.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ItemCard;
