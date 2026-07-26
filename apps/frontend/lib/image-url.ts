export function getImageUrl(path?: string): string {
  if (!path) return "";

  // If already an absolute URL, return as-is (external CDN or full url)
  if (/^https?:\/\//i.test(path)) return path;

  const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";

  // If path is served from frontend public (seeded images), keep relative path
  // Seed images are stored under /images/... in frontend public
  if (path.startsWith('/images/')) {
    return path; // will be served by Next static public folder
  }

  // If path is an upload path from backend, prefix with backend base URL
  if (path.startsWith('/uploads/') || path.startsWith('uploads/')) {
    // ensure leading slash
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${baseURL}${p}`;
  }

  // Fallback: join with baseURL
  return `${baseURL}${baseURL.endsWith('/') ? '' : '/'}${path}`;
}