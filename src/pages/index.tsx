import * as React from "react";
import type { HeadFC, PageProps } from "gatsby";
import { graphql, Link } from "gatsby";
import { Layout, SEO } from "../components";
import type { ItemYamlNode } from "../types";
import * as styles from "./index.module.css";

interface HomePageData {
  allLegoYaml: {
    nodes: ItemYamlNode[];
  };
}

const IndexPage: React.FC<PageProps<HomePageData>> = ({ data }) => {
  const allItems = data.allLegoYaml.nodes;
  const ownedItems = allItems.filter((item) => item.status === "owned");
  const wishlistItems = allItems.filter((item) => item.status === "wishlist");

  // Calculate statistics
  const collectionValue = ownedItems.reduce(
    (sum, item) => sum + (item.purchasePrice || item.retailPrice || 0),
    0
  );
  const wishlistValue = wishlistItems.reduce(
    (sum, item) => sum + (item.retailPrice || 0),
    0
  );

  // Get recent additions (last 5 items by dateAdded)
  const recentItems = [...allItems]
    .sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
    .slice(0, 5);

  // Stats for footer
  const stats = {
    owned: ownedItems.length,
    wishlist: wishlistItems.length,
    collectionValue: collectionValue,
    wishlistValue: wishlistValue,
  };

  return (
    <Layout title="Home" stats={stats}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          <span className={styles.prompt}>$</span> means-of-collection
          <span className={styles.cursor}>_</span>
        </h1>
        <p className={styles.tagline}>
          A static archive of what I own, what I want, and how LEGO slowly
          converts income into bricks.
        </p>
      </div>

      <div className={styles.stats} role="region" aria-label="Collection statistics">
        <Link to="/collection/" className={styles.statCard}>
          <span className={styles.statValue}>{ownedItems.length}</span>
          <span className={styles.statLabel}>Sets Owned</span>
          <span className={styles.statMeta}>€{collectionValue.toFixed(2)}</span>
        </Link>
        <Link to="/wishlist/" className={styles.statCard}>
          <span className={styles.statValue}>{wishlistItems.length}</span>
          <span className={styles.statLabel}>On Wishlist</span>
          <span className={styles.statMeta}>€{wishlistValue.toFixed(2)}</span>
        </Link>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{allItems.length}</span>
          <span className={styles.statLabel}>Total Items</span>
          <span className={styles.statMeta}>and growing...</span>
        </div>
      </div>

      <section className={styles.recent}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.prompt}>{">"}</span> Recently Added
        </h2>
        <ul className={styles.recentList}>
          {recentItems.map((item) => (
            <li key={item.id} className={styles.recentItem}>
              <span className={styles.recentIcon}>🧱</span>
              <span className={styles.recentName}>{item.name}</span>
              <span className={styles.recentStatus}>
                [{item.status === "owned" ? "owned" : "wishlist"}]
              </span>
              {item.retailPrice && (
                <span className={styles.recentPrice}>
                  €{item.retailPrice.toFixed(2)}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.nav}>
        <Link to="/wishlist/" className={styles.navButton}>
          View Wishlist →
        </Link>
        <Link to="/collection/" className={styles.navButton}>
          View Collection →
        </Link>
      </div>
    </Layout>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <SEO
    title=""
    description="A static archive of what I own, what I want, and how LEGO slowly converts income into bricks."
    pathname="/"
  />
);

export const query = graphql`
  query HomePageQuery {
    allLegoYaml {
      nodes {
        id
        name
        category
        status
        isGift
        tags
        retailPrice
        purchasePrice
        dateAdded
        setId
      }
    }
  }
`;
