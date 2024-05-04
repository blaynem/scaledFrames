/**
 * Returns a URL-safe version of the provided string.
 *
 * Only alphanumerics, spaces, and hyphens are allowed.
 * Spaces are replaced with hyphens.
 *
 * Example: "Hello, World!" -> "hello-world"
 * @returns URL-safe string
 */
export const convertToUrlSafe = (val: string): string =>
  val
    .replace(/[^a-zA-Z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase();

export const getCurrentDate = () => new Date();
export const getCurrentDatePlusDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
