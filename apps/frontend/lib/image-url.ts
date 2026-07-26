export function getImageUrl(path: string): string {
    const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";
    return `${baseURL}${path}`;
  }