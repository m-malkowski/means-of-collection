import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    title: "Means of Collection",
    description:
      "A static, build-time archive of what I own, what I want, and how LEGO slowly converts income into bricks.",
    siteUrl: "https://m-malkowski.github.io/means-of-collection",
    author: "@m-malkowski",
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  graphqlTypegen: true,
  pathPrefix: "/means-of-collection",
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    "gatsby-transformer-yaml",
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
          }
        `,
        resolveSiteUrl: () => "https://m-malkowski.github.io/means-of-collection",
        serialize: ({ path }: { path: string }) => ({
          url: path,
          changefreq: "weekly",
          priority: path === "/" ? 1.0 : 0.7,
        }),
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "config",
        path: `${__dirname}/config`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "items",
        path: `${__dirname}/content/items`,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: `${__dirname}/content/images`,
      },
    },
  ],
};

export default config;
