/**
 * Universal Asset URL Helper
 * Prepends the active application BASE_URL (e.g. /Top-Spark-Digital/) to public asset paths
 * ensuring media, images, and brand logos resolve correctly across root domains and GitHub Pages.
 */
export function getAssetUrl(path: string | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }

  // Clean source prefixes if loaded from database or initial data
  let cleanPath = path
    .replace(/^\/src\/assets\//, '/')
    .replace(/^\/public\//, '/');

  if (!cleanPath.startsWith('/')) {
    cleanPath = `/${cleanPath}`;
  }

  const baseUrl = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');
  if (baseUrl && baseUrl !== '/' && baseUrl !== '.' && !cleanPath.startsWith(baseUrl)) {
    return `${baseUrl}${cleanPath}`;
  }

  return cleanPath;
}
