import * as React from "react";
import * as styles from "./Footer.module.css";

interface FooterStats {
  owned?: number;
  wishlist?: number;
  collectionValue?: number;
  wishlistValue?: number;
}

interface FooterProps {
  stats?: FooterStats;
}

const Footer: React.FC<FooterProps> = ({ stats }) => {
  const totalItems = (stats?.owned || 0) + (stats?.wishlist || 0);
  const hasStats = stats && (stats.owned !== undefined || stats.wishlist !== undefined);

  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.container}>
        <div className={styles.left} aria-label="Collection statistics">
          <span className={styles.stat}>
            <span className={styles.label}>status:</span>
            <span className={styles.value}>online</span>
          </span>
          
          {hasStats && (
            <>
              {stats?.owned !== undefined && (
                <span className={styles.stat}>
                  <span className={styles.label}>owned:</span>
                  <span className={styles.value}>{stats.owned}</span>
                </span>
              )}
              {stats?.wishlist !== undefined && (
                <span className={styles.stat}>
                  <span className={styles.label}>wishlist:</span>
                  <span className={styles.value}>{stats.wishlist}</span>
                </span>
              )}
              {totalItems > 0 && (
                <span className={styles.stat}>
                  <span className={styles.label}>total:</span>
                  <span className={styles.value}>{totalItems}</span>
                </span>
              )}
              {stats?.collectionValue !== undefined && stats.collectionValue > 0 && (
                <span className={styles.stat}>
                  <span className={styles.label}>value:</span>
                  <span className={styles.valueAccent}>€{stats.collectionValue.toFixed(2)}</span>
                </span>
              )}
            </>
          )}
        </div>

        <div className={styles.right}>
          <span className={styles.copyright}>
            © {new Date().getFullYear()} Maciej Malkowski
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
