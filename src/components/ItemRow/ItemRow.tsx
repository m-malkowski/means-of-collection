import * as React from "react";
import { Link, withPrefix } from "gatsby";
import type { ItemYamlNode } from "../../types";
import { isRetired } from "../../utils/retired";
import * as styles from "./ItemRow.module.css";

interface ItemRowProps {
  item: ItemYamlNode;
  currencySymbol?: string;
}

const ItemRow: React.FC<ItemRowProps> = ({ item, currencySymbol = "€" }) => {
  const price = item.genuinePrice || item.referenceRetailPrice;
  const showReferencePrice = item.referenceRetailPrice &&
    item.referenceRetailPrice !== price;
  const itemUrl = `/item/${item.id}/`;

  return (
    <article className={styles.row}>
      <Link to={itemUrl} className={styles.rowLink} aria-label={`View details for ${item.name}`}>
        <div className={styles.main}>
          <div className={styles.icon}>
            {item.images && item.images.length > 0 ? (
              <img
                src={withPrefix(`/images/${item.images[0]}`)}
                alt={item.name}
                className={styles.thumbnail}
              />
            ) : (
              <span>🧱</span>
            )}
          </div>
          <div className={styles.info}>
            <h3 className={styles.title}>{item.name}</h3>
            <div className={styles.badges}>
              {item.isGift && (
                <span className={styles.badgeGift}>🎁</span>
              )}
              {isRetired(item.yearRetired) && (
                <span className={styles.badgeRetired}>RETIRED</span>
              )}
            </div>
          </div>
        </div>

        <div className={styles.details}>
          {item.setId && <span className={styles.setId}>#{item.setId}</span>}
          {item.partCount && <span className={styles.parts}>{item.partCount} pcs</span>}
        </div>

        <div className={styles.priceCol}>
          {price && (
            <>
              <span className={styles.price}>
                {currencySymbol}
                {price.toFixed(2)}
              </span>
              {showReferencePrice && (
                <span className={styles.referencePrice}>
                  {currencySymbol}
                  {item.referenceRetailPrice!.toFixed(2)}*
                </span>
              )}
            </>
          )}
        </div>
      </Link>
    </article>
  );
};

export default ItemRow;
