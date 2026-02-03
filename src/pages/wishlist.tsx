import * as React from "react";
import { useState } from "react";
import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";
import { Layout, PageHeader, ItemGrid, ViewToggle, FilterBar, SEO } from "../components";
import { useFilters } from "../hooks";
import { defaultFilterConfig } from "../utils";
import type { ItemYamlNode, ViewMode } from "../types";

interface WishlistPageData {
  allLegoYaml: {
    nodes: ItemYamlNode[];
  };
}

const WishlistPage: React.FC<PageProps<WishlistPageData>> = ({ data }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");

  const allItems = data.allLegoYaml.nodes;
  const wishlistItems = allItems.filter((item) => item.status === "wishlist");

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
    items: wishlistItems,
    config: defaultFilterConfig,
    syncUrl: true,
  });

  // Calculate total value of filtered wishlist
  const totalValue = filteredItems.reduce(
    (sum, item) => sum + (item.retailPrice || 0),
    0
  );

  // Calculate stats for footer
  const ownedItems = allItems.filter((item) => item.status === "owned");
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
    <Layout title="Wishlist" stats={stats}>
      <PageHeader
        title="Wishlist"
        subtitle={`${filteredItems.length} items | Total: €${totalValue.toFixed(2)}`}
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
        totalCount={wishlistItems.length}
      />

      <ItemGrid items={filteredItems} viewMode={viewMode} currencySymbol="€" />
    </Layout>
  );
};

export default WishlistPage;

export const Head: HeadFC = () => (
  <SEO
    title="Wishlist"
    description="My LEGO wishlist - sets I'm hoping to add to my collection"
    pathname="/wishlist/"
  />
);

export const query = graphql`
  query WishlistPageQuery {
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
