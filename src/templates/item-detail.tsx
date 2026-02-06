import * as React from "react";
import { graphql, Link, withPrefix } from "gatsby";
import type { PageProps } from "gatsby";
import { Layout, SEO } from "../components";
import type { ItemYamlNode } from "../types";
import { isRetired } from "../utils/retired";
import { formatLinkLabel } from "../utils/links";
import * as styles from "./item-detail.module.css";

interface ItemDetailPageContext {
  id: string;
}

interface ItemDetailData {
  legoYaml: ItemYamlNode;
}

const ItemDetailTemplate: React.FC<PageProps<ItemDetailData, ItemDetailPageContext>> = ({
  data,
}) => {
  const item = data.legoYaml;
  const price = item.genuinePrice || item.referenceRetailPrice;
  const showSavings =
    item.purchasePrice && price && item.purchasePrice < price;
  const savings = showSavings ? price! - item.purchasePrice! : 0;

  // Format date for display
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const backLink = item.status === "owned" ? "/collection/" : "/wishlist/";
  const backLabel = item.status === "owned" ? "Collection" : "Wishlist";

  return (
    <Layout title={item.name}>
      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link to={backLink} className={styles.backLink}>
            ← Back to {backLabel}
          </Link>
        </nav>

        <article className={styles.article}>
          <header className={styles.header}>
            <div className={styles.badges}>
              <span className={`${styles.badge} ${styles.badgeStatus}`}>
                {item.status === "owned" ? "OWNED" : "WISHLIST"}
              </span>
              {item.isGift && (
                <span className={`${styles.badge} ${styles.badgeGift}`}>
                  🎁 {item.status === "owned" ? "GIFT" : "GIFT IDEA"}
                </span>
              )}
              {isRetired(item.yearRetired) && (
                <span className={`${styles.badge} ${styles.badgeRetired}`}>
                  RETIRED
                </span>
              )}
            </div>

            <h1 className={styles.title}>{item.name}</h1>

            {item.setId && (
              <p className={styles.setId}>
                <span className={styles.label}>Set #</span>
                {item.setId}
              </p>
            )}
          </header>

          <div className={styles.content}>
            <div className={styles.imageSection}>
              {item.images && item.images.length > 0 ? (
                <img
                  src={withPrefix(`/images/${item.images[0]}`)}
                  alt={item.name}
                  className={styles.itemImage}
                />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <span className={styles.placeholderIcon}>🧱</span>
                  <span className={styles.placeholderText}>
                    Image #{item.setId}
                  </span>
                </div>
              )}
            </div>

            <div className={styles.details}>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Pricing</h2>
                <dl className={styles.detailList}>
                  {(item.genuinePrice || item.referenceRetailPrice) && (
                    <>
                      <dt>Price</dt>
                      <dd className={styles.priceHighlight}>
                        €{(item.genuinePrice || item.referenceRetailPrice || 0).toFixed(2)}
                      </dd>
                    </>
                  )}
                  {item.referenceRetailPrice && item.referenceRetailPrice !== item.genuinePrice && (
                    <>
                      <dt className={styles.mutedLabel}>Reference Retail Price *</dt>
                      <dd className={styles.mutedText}>
                        €{item.referenceRetailPrice.toFixed(2)}
                      </dd>
                    </>
                  )}
                  {item.purchasePrice && (
                    <>
                      <dt>Purchase Price</dt>
                      <dd className={styles.priceHighlight}>
                        €{item.purchasePrice.toFixed(2)}
                        {item.genuinePrice && item.purchasePrice < item.genuinePrice && (
                          <span className={styles.savings}>
                            (saved €{(item.genuinePrice - item.purchasePrice).toFixed(2)})
                          </span>
                        )}
                      </dd>
                    </>
                  )}
                  {!item.genuinePrice && !item.referenceRetailPrice && !item.purchasePrice && (
                    <>
                      <dt>Price</dt>
                      <dd>Not available</dd>
                    </>
                  )}
                </dl>
                {item.referenceRetailPrice && item.referenceRetailPrice !== item.genuinePrice && (
                  <p className={styles.footnote}>
                    * Reference retail price is the official LEGO MSRP at launch
                  </p>
                )}
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Details</h2>
                <dl className={styles.detailList}>
                  {item.partCount && (
                    <>
                      <dt>Pieces</dt>
                      <dd>{item.partCount.toLocaleString()}</dd>
                    </>
                  )}
                  {item.minifigCount !== undefined && item.minifigCount > 0 && (
                    <>
                      <dt>Minifigures</dt>
                      <dd>{item.minifigCount}</dd>
                    </>
                  )}
                  {item.yearReleased && (
                    <>
                      <dt>Year Released</dt>
                      <dd>{item.yearReleased}</dd>
                    </>
                  )}
                  <dt>Category</dt>
                  <dd className={styles.category}>{item.category.toUpperCase()}</dd>
                </dl>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Timeline</h2>
                <dl className={styles.detailList}>
                  <dt>Added to List</dt>
                  <dd>{formatDate(item.dateAdded) || "Unknown"}</dd>
                  {item.dateBought && (
                    <>
                      <dt>Purchased</dt>
                      <dd>{formatDate(item.dateBought)}</dd>
                    </>
                  )}
                </dl>
              </section>

              {item.tags && item.tags.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Tags</h2>
                  <div className={styles.tagList}>
                    {item.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {item.notes && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Notes</h2>
                  <p className={styles.notes}>{item.notes}</p>
                </section>
              )}

              {item.links && item.links.length > 0 && (
                <section className={styles.section}>
                  <h2 className={styles.sectionTitle}>Links</h2>
                  <div className={styles.linksContainer}>
                    {item.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.externalLink}
                      >
                        {formatLinkLabel(link.url, link.name)} →
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </article>
      </div>
    </Layout>
  );
};

export default ItemDetailTemplate;

export const Head = ({ data }: { data: ItemDetailData }) => (
  <SEO
    title={data.legoYaml.name}
    description={`${data.legoYaml.name} - ${data.legoYaml.status === "owned" ? "In my collection" : "On my wishlist"}${data.legoYaml.setId ? ` (Set #${data.legoYaml.setId})` : ""}`}
    pathname={`/item/${data.legoYaml.id}/`}
    article={true}
  />
);

export const query = graphql`
  query ItemDetailQuery($id: String!) {
    legoYaml(id: { eq: $id }) {
      id
      name
      category
      status
      isGift
      tags
      referenceRetailPrice
      genuinePrice
      purchasePrice
      links {
        url
        name
      }
      notes
      images
      dateAdded
      dateBought
      setId
      partCount
      yearRetired
      minifigCount
      yearReleased
    }
  }
`;
