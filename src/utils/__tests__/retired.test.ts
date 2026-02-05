import { isRetired } from '../retired';

describe('isRetired', () => {
  // Mock the current year to make tests deterministic
  const mockCurrentYear = 2025;

  beforeAll(() => {
    // Mock Date.prototype.getFullYear to return a fixed year
    jest.spyOn(Date.prototype, 'getFullYear').mockReturnValue(mockCurrentYear);
  });

  afterAll(() => {
    // Restore the original implementation
    jest.restoreAllMocks();
  });

  describe('when yearRetired is null or undefined', () => {
    it('should return false for undefined', () => {
      expect(isRetired(undefined)).toBe(false);
    });

    it('should return false for null', () => {
      expect(isRetired(null)).toBe(false);
    });
  });

  describe('when yearRetired is in the past', () => {
    it('should return true for a set retired last year', () => {
      expect(isRetired(mockCurrentYear - 1)).toBe(true);
    });

    it('should return true for a set retired many years ago', () => {
      expect(isRetired(2020)).toBe(true);
    });

    it('should return true for a set retired a decade ago', () => {
      expect(isRetired(2015)).toBe(true);
    });
  });

  describe('when yearRetired is in the future', () => {
    it('should return false for a set retiring next year', () => {
      expect(isRetired(mockCurrentYear + 1)).toBe(false);
    });

    it('should return false for a set retiring many years in the future', () => {
      expect(isRetired(2027)).toBe(false);
    });

    it('should return false for a set retiring decades in the future', () => {
      expect(isRetired(2030)).toBe(false);
    });
  });

  describe('when yearRetired is the current year', () => {
    it('should return false for current year (set is still available)', () => {
      expect(isRetired(mockCurrentYear)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should return false for year 0 (invalid year)', () => {
      expect(isRetired(0)).toBe(true); // Year 0 is in the past
    });

    it('should return false for negative years (BC dates)', () => {
      expect(isRetired(-100)).toBe(true); // Negative years are in the past
    });
  });
});
