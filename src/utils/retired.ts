/**
 * Check if a LEGO set is retired based on its yearRetired value.
 * A set is considered retired if yearRetired exists and is in the past.
 *
 * @param yearRetired - The year the set was retired (or null/undefined)
 * @returns true if the set is retired, false otherwise
 */
export function isRetired(yearRetired?: number | null): boolean {
  if (yearRetired === null || yearRetired === undefined) {
    return false;
  }
  const currentYear = new Date().getFullYear();
  return yearRetired < currentYear;
}
