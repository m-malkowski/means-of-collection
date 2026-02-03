import * as React from "react";
import { useState } from "react";
import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";
import { Layout, PageHeader, ItemGrid, ViewToggle, FilterBar, SEO } from "../components";
import { useFilters } from "../hooks";
import { defaultFilterConfig } from "../utils";
import type { ItemYamlNode, ViewMode } from "../types";

interface CollectionPageData {
  allLegoYaml: {
    nodes: ItemYamlNode[];
  };
}

const CollectionPage: React.FC<PageProps<CollectionPageData>> = ({ data }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");

  const allItems = data.allLegoYaml.nodes;
  const ownedItems = allItems.filter((item) => item.status === "owned");

  // Use the filters hook
  const {
    filters,
    filteredItems,
    setSearch,
    toggleTag,
    setPriceRange,
    setAgeBucket,
    setGiftOnly,
    resetFilters,
    hasActiveFilters,
    availableTags,
    priceRangeOptions,
  } = useFilters({
    items: ownedItems,
    config: defaultFilterConfig,
    syncUrl: true,
  });

  // Calculate total value of filtered collection
  const totalValue = filteredItems.reduce(
    (sum, item) => sum + (item.purchasePrice || item.retailPrice || 0),
    0
  );

  // Calculate stats for footer
  const wishlistItems = allItems.filter((item) => item.status === "wishlist");
  const stats = {
    owned: ownedItems.length,
    wishlist: wishlistItems.length,
    collectionValue: ownedItems.reduce(
      (sum, item) => sum + (item.purchasePrice || item.retailPrice || 0),
      0
    ),
    wishlistValue: wishlistItems.reduce(
      (sum, item) => sum + (item.retailPrice || 0),
      0
    ),
  };

  return (
    <Layout title="Collection" stats={stats}>
      <PageHeader
        title="Collection"
        subtitle={`${filteredItems.length} items | Value: €${totalValue.toFixed(2)}`}
      >
        <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
      </PageHeader>

      <FilterBar
        filters={filters}
        onSearchChange={setSearch}
        onTagToggle={toggleTag}
        onPriceRangeChange={setPriceRange}
        onAgeBucketChange={setAgeBucket}
        onGiftOnlyChange={setGiftOnly}
        onReset={resetFilters}
        availableTags={availableTags}
        priceRangeOptions={priceRangeOptions}
        ageBuckets={defaultFilterConfig.ageBuckets}
        hasActiveFilters={hasActiveFilters}
        currencySymbol="€"
        resultCount={filteredItems.length}
        totalCount={ownedItems.length}
      />

      <ItemGrid items={filteredItems} viewMode={viewMode} currencySymbol="€" />
    </Layout>
  );
};

export default CollectionPage;

export const Head: HeadFC = () => (
  <SEO
    title="Collection"
    description="My LEGO collection - sets I own"
    pathname="/collection/"
  />
);

export const query = graphql`
  query CollectionPageQuery {
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
        storeUrl
        notes
        dateAdded
        dateBought
        setId
        partCount
        isRetired
        minifigCount
        yearReleased
      }
    }
  }
`;
