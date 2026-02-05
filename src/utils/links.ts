/**
 * Utilities for handling external links
 */

/**
 * Extracts the domain name from a URL for display purposes
 * Returns the top-level and main domain (e.g., "lego.com" from "https://www.lego.com/en-de/product")
 *
 * @param url - The URL to extract the domain from
 * @returns The domain name for display (e.g., "Lego.com", "Amazon.com")
 */
export function getDomainFromUrl(url: string): string {
  if (!url || url.trim() === "") {
    return "External Link";
  }

  try {
    // Add protocol if missing for URL parsing
    let urlToParse = url;
    if (!url.match(/^https?:\/\//i) && !url.match(/^ftp:\/\//i)) {
      urlToParse = `https://${url}`;
    }

    const urlObj = new URL(urlToParse);
    const hostname = urlObj.hostname;

    // Validate that hostname looks like a domain (has dots and valid characters)
    if (!hostname || !hostname.includes('.') || hostname.length < 3) {
      return "External Link";
    }

    // Check if it's an IP address
    const isIpAddress = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    if (isIpAddress) {
      return hostname;
    }

    // Split hostname into parts
    const parts = hostname.split(".");

    // Handle different domain formats
    if (parts.length >= 2) {
      // Get the last two parts (e.g., "lego.com" from "www.lego.com")
      // For country-specific TLDs like "co.uk", we might need the last three parts
      // Check if we have a known two-part TLD (like co.uk, co.jp, com.au, etc.)
      const knownMultiPartTlds = ['co.uk', 'co.jp', 'com.au', 'co.nz', 'co.za', 'co.in', 'co.il', 'org.uk', 'ac.uk'];
      const lastTwoParts = parts.slice(-2).join(".").toLowerCase();
      const isKnownMultiPartTld = knownMultiPartTlds.includes(lastTwoParts);

      const mainDomain = isKnownMultiPartTld
        ? parts.slice(-3).join(".")
        : parts.slice(-2).join(".");

      // Capitalize the first letter of the domain (first part), keep TLD lowercase
      const domainParts = mainDomain.split(".");
      const capitalizedParts = domainParts.map((part, index) => {
        if (index === 0) {
          // First part (the main domain name) - capitalize first letter
          return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
        } else {
          // TLD parts - keep lowercase
          return part.toLowerCase();
        }
      });

      return capitalizedParts.join(".");
    }

    // Fallback: return the hostname as-is, capitalized
    return hostname.charAt(0).toUpperCase() + hostname.slice(1).toLowerCase();
  } catch {
    // If URL parsing fails, return a fallback
    return "External Link";
  }
}

/**
 * Formats a link label based on the URL or custom name
 *
 * @param url - The link URL
 * @param customName - Optional custom name for the link
 * @returns The formatted label (e.g., "View on Lego.com")
 */
export function formatLinkLabel(url: string, customName?: string): string {
  if (customName && customName.trim() !== "") {
    return customName;
  }
  const domain = getDomainFromUrl(url);
  return `View on ${domain}`;
}
