import * as React from "react";
import { useState, useMemo, useCallback } from "react";
import type { HeadFC, PageProps } from "gatsby";
import { graphql } from "gatsby";
import { Layout, PageHeader, ItemGrid, ViewToggle, FilterBar, FilterToolbar, SEO } from "../components";
import { useFilters } from "../hooks";
import { defaultFilterConfig } from "../utils";
import type { ItemYamlNode, ViewMode, SortOption } from "../types";

interface CollectionPageData {
  allLegoYaml: {
    nodes: ItemYamlNode[];
  };
}

// Sort items based on sort option
function sortItems(items: ItemYamlNode[], sortOption: SortOption): ItemYamlNode[] {
  const sorted = [...items];
  sorted.sort((a, b) => {
    switch (sortOption) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return (a.genuinePrice || a.referenceRetailPrice || 0) - (b.genuinePrice || b.referenceRetailPrice || 0);
      case "price-desc":
        return (b.genuinePrice || b.referenceRetailPrice || 0) - (a.genuinePrice || a.referenceRetailPrice || 0);
      case "date-asc":
        return new Date(a.dateAdded).getTime() - new Date(b.dateAdded).getTime();
      case "date-desc":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime();
      default:
        return 0;
    }
  });
  return sorted;
}

const CollectionPage: React.FC<PageProps<CollectionPageData>> = ({ data }) => {
  const [viewMode, setViewMode] = useState<ViewMode>("gallery");
  const [sortOption, setSortOption] = useState<SortOption>("name-asc");
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);

  const toggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
    setShowSort(false);
  }, []);

  const toggleSort = useCallback(() => {
    setShowSort(prev => !prev);
    setShowFilters(false);
  }, []);

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

  // Sort filtered items
  const sortedItems = useMemo(
    () => sortItems(filteredItems, sortOption),
    [filteredItems, sortOption]
  );

  // Calculate total value of filtered collection
  const totalValue = sortedItems.reduce(
    (sum, item) => sum + (item.genuinePrice || item.referenceRetailPrice || 0),
    0
  );

  // Calculate stats for footer
  const wishlistItems = allItems.filter((item) => item.status === "wishlist");
  const stats = {
    owned: ownedItems.length,
    wishlist: wishlistItems.length,
    collectionValue: ownedItems.reduce(
      (sum, item) => sum + (item.genuinePrice || item.referenceRetailPrice || 0),
      0
    ),
    wishlistValue: wishlistItems.reduce(
      (sum, item) => sum + (item.genuinePrice || item.referenceRetailPrice || 0),
      0
    ),
  };

  return (
    <Layout title="Collection" stats={stats}>
      <PageHeader
        title="Collection"
        subtitle={`${sortedItems.length} items | Value: €${totalValue.toFixed(2)}`}
        showPriceLegend={true}
      >
        <FilterToolbar
          showFilters={showFilters}
          showSort={showSort}
          onToggleFilters={toggleFilters}
          onToggleSort={toggleSort}
          hasActiveFilters={hasActiveFilters}
        />
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
        resultCount={sortedItems.length}
        totalCount={ownedItems.length}
        sortOption={sortOption}
        onSortChange={setSortOption}
        showFilters={showFilters}
        showSort={showSort}
        onToggleFilters={toggleFilters}
        onToggleSort={toggleSort}
      />

      <ItemGrid items={sortedItems} viewMode={viewMode} currencySymbol="€" />
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
        referenceRetailPrice
        genuinePrice
        purchasePrice
        links {
          url
          name
        }
        notes
        dateAdded
        dateBought
        setId
        partCount
        yearRetired
        minifigCount
        yearReleased
        images
      }
    }
  }
`;
