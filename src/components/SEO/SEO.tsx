import * as React from "react";
import { Helmet } from "react-helmet";
import { useStaticQuery, graphql } from "gatsby";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  pathname?: string;
  article?: boolean;
  noindex?: boolean;
}

interface SiteMetadata {
  title: string;
  description: string;
  siteUrl: string;
  author: string;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  image,
  pathname,
  article = false,
  noindex = false,
}) => {
  const { site } = useStaticQuery<{ site: { siteMetadata: SiteMetadata } }>(
    graphql`
      query SEOQuery {
        site {
          siteMetadata {
            title
            description
            siteUrl
            author
          }
        }
      }
    `
  );

  const {
    title: defaultTitle,
    description: defaultDescription,
    siteUrl,
    author,
  } = site.siteMetadata;

  const seo = {
    title: title ? `${title} | ${defaultTitle}` : defaultTitle,
    description: description || defaultDescription,
    image: image ? `${siteUrl}${image}` : `${siteUrl}/og-image.png`,
    url: `${siteUrl}${pathname || ""}`,
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{seo.title}</title>
      <meta name="title" content={seo.title} />
      <meta name="description" content={seo.description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={article ? "article" : "website"} />
      <meta property="og:url" content={seo.url} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:image" content={seo.image} />
      <meta property="og:site_name" content={defaultTitle} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={seo.image} />
      {author && <meta name="twitter:creator" content={author} />}

      {/* Additional Meta */}
      <meta name="theme-color" content="#0a0a0a" />
      <meta name="msapplication-TileColor" content="#0a0a0a" />
      <link rel="canonical" href={seo.url} />

      {/* Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&display=swap"
        rel="stylesheet"
      />
    </Helmet>
  );
};

export default SEO;
