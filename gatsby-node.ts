import type { GatsbyNode } from "gatsby";
import path from "path";

interface LegoNode {
  id: string;
  name: string;
  setId?: string;
}

interface AllLegoYamlQueryResult {
  allLegoYaml: {
    nodes: LegoNode[];
  };
}

export const createPages: GatsbyNode["createPages"] = async ({
  graphql,
  actions,
  reporter,
}) => {
  const { createPage } = actions;

  // Query all LEGO items
  const result = await graphql<AllLegoYamlQueryResult>(`
    query AllItemsForPages {
      allLegoYaml {
        nodes {
          id
          name
          setId
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild("Error while running GraphQL query for item pages.");
    return;
  }

  // Item detail template
  const itemDetailTemplate = path.resolve("./src/templates/item-detail.tsx");

  // Create a page for each item
  const items = result.data?.allLegoYaml.nodes || [];

  items.forEach((item) => {
    const pagePath = `/item/${item.id}/`;

    reporter.info(`Creating item page: ${pagePath} for "${item.name}"`);

    createPage({
      path: pagePath,
      component: itemDetailTemplate,
      context: {
        id: item.id,
      },
    });
  });

  reporter.info(`Created ${items.length} item detail pages.`);
};

// Schema customization to ensure optional fields are typed correctly
export const createSchemaCustomization: GatsbyNode["createSchemaCustomization"] = ({
  actions,
}) => {
  const { createTypes } = actions;

  // Define explicit types for LEGO items to ensure nullability is correct
  createTypes(`
    type ItemLinkYaml implements Node {
      url: String!
      name: String
    }

    type LegoYaml implements Node {
      id: ID!
      name: String!
      category: String!
      status: String!
      isGift: Boolean!
      tags: [String]
      retailPrice: Float
      purchasePrice: Float
      links: [ItemLinkYaml]
      notes: String
      images: [String]
      dateAdded: String!
      dateBought: String
      setId: String
      partCount: Int
      yearRetired: Int
      minifigCount: Int
      yearReleased: Int
    }
  `);
};
