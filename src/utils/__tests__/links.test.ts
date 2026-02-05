import { getDomainFromUrl, formatLinkLabel } from '../links';

describe('getDomainFromUrl', () => {
  describe('standard domains', () => {
    it('should extract domain from www.lego.com', () => {
      expect(getDomainFromUrl('https://www.lego.com/en-de/product/r2-d2-75379')).toBe('Lego.com');
    });

    it('should extract domain from lego.com without www', () => {
      expect(getDomainFromUrl('https://lego.com/product/test')).toBe('Lego.com');
    });

    it('should extract domain from www.amazon.com', () => {
      expect(getDomainFromUrl('https://www.amazon.com/dp/B08XYZ')).toBe('Amazon.com');
    });

    it('should extract domain from amazon.com without www', () => {
      expect(getDomainFromUrl('https://amazon.com/dp/B08XYZ')).toBe('Amazon.com');
    });

    it('should extract domain from de.aliexpress.com', () => {
      expect(getDomainFromUrl('https://de.aliexpress.com/item/test')).toBe('Aliexpress.com');
    });

    it('should extract domain from aliexpress.com without subdomain', () => {
      expect(getDomainFromUrl('https://aliexpress.com/item/test')).toBe('Aliexpress.com');
    });

    it('should extract domain from www.ebay.com', () => {
      expect(getDomainFromUrl('https://www.ebay.com/itm/test')).toBe('Ebay.com');
    });
  });

  describe('country-specific TLDs', () => {
    it('should extract domain from www.lego.co.uk', () => {
      expect(getDomainFromUrl('https://www.lego.co.uk/en-de/product/test')).toBe('Lego.co.uk');
    });

    it('should extract domain from www.amazon.co.uk', () => {
      expect(getDomainFromUrl('https://www.amazon.co.uk/dp/B08XYZ')).toBe('Amazon.co.uk');
    });

    it('should extract domain from www.amazon.de (German)', () => {
      expect(getDomainFromUrl('https://www.amazon.de/dp/B08XYZ')).toBe('Amazon.de');
    });

    it('should extract domain from www.amazon.fr (French)', () => {
      expect(getDomainFromUrl('https://www.amazon.fr/dp/B08XYZ')).toBe('Amazon.fr');
    });
  });

  describe('subdomains', () => {
    it('should handle multiple subdomain levels', () => {
      expect(getDomainFromUrl('https://shop.sub.lego.com/product')).toBe('Lego.com');
    });

    it('should handle store subdomains', () => {
      expect(getDomainFromUrl('https://store.lego.com/product')).toBe('Lego.com');
    });
  });

  describe('edge cases', () => {
    it('should handle URLs without protocol', () => {
      expect(getDomainFromUrl('www.lego.com/product')).toBe('Lego.com');
    });

    it('should handle URLs with ftp protocol', () => {
      expect(getDomainFromUrl('ftp://ftp.lego.com/files')).toBe('Lego.com');
    });

    it('should return fallback for invalid URLs', () => {
      expect(getDomainFromUrl('not-a-url')).toBe('External Link');
    });

    it('should return fallback for empty string', () => {
      expect(getDomainFromUrl('')).toBe('External Link');
    });

    it('should handle IP addresses', () => {
      expect(getDomainFromUrl('https://192.168.1.1/path')).toBe('192.168.1.1');
    });

    it('should capitalize first letter of each part', () => {
      expect(getDomainFromUrl('https://www.target.com/product')).toBe('Target.com');
    });
  });

  describe('specialized domains', () => {
    it('should handle bricklink.com', () => {
      expect(getDomainFromUrl('https://www.bricklink.com/v2/catalog/catalogitem.page')).toBe('Bricklink.com');
    });

    it('should handle brickowl.com', () => {
      expect(getDomainFromUrl('https://www.brickowl.com/products/test')).toBe('Brickowl.com');
    });

    it('should handle zazzle.com', () => {
      expect(getDomainFromUrl('https://www.zazzle.com/product')).toBe('Zazzle.com');
    });
  });
});

describe('formatLinkLabel', () => {
  describe('with custom name', () => {
    it('should return custom name when provided', () => {
      expect(formatLinkLabel('https://lego.com/product', 'Official Store')).toBe('Official Store');
    });

    it('should return custom name regardless of URL', () => {
      expect(formatLinkLabel('https://amazon.com/dp/123', 'Buy on Amazon')).toBe('Buy on Amazon');
    });
  });

  describe('without custom name', () => {
    it('should format label for LEGO.com', () => {
      expect(formatLinkLabel('https://www.lego.com/en-de/product/r2-d2-75379')).toBe('View on Lego.com');
    });

    it('should format label for AliExpress.com', () => {
      expect(formatLinkLabel('https://de.aliexpress.com/item/test')).toBe('View on Aliexpress.com');
    });

    it('should format label for Amazon.com', () => {
      expect(formatLinkLabel('https://www.amazon.com/dp/B08XYZ')).toBe('View on Amazon.com');
    });

    it('should format label for Amazon.co.uk', () => {
      expect(formatLinkLabel('https://www.amazon.co.uk/dp/B08XYZ')).toBe('View on Amazon.co.uk');
    });

    it('should format label for Amazon.de', () => {
      expect(formatLinkLabel('https://www.amazon.de/dp/B08XYZ')).toBe('View on Amazon.de');
    });

    it('should format label for BrickLink.com', () => {
      expect(formatLinkLabel('https://www.bricklink.com/v2/catalog/catalogitem.page')).toBe('View on Bricklink.com');
    });
  });

  describe('edge cases', () => {
    it('should handle invalid URL without custom name', () => {
      expect(formatLinkLabel('not-a-url')).toBe('View on External Link');
    });

    it('should handle empty string without custom name', () => {
      expect(formatLinkLabel('')).toBe('View on External Link');
    });

    it('should handle empty custom name (should use domain)', () => {
      expect(formatLinkLabel('https://lego.com/product', '')).toBe('View on Lego.com');
    });
  });
});
