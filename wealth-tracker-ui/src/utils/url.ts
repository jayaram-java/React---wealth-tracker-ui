const stripWww = (hostname: string) => hostname.replace(/^www\./i, '');

/**
 * Returns a compact display value for a URL.
 * Prefer the hostname, and fall back to the original value when parsing fails.
 */
export const getDisplayUrl = (url: string): string => {
  const trimmedUrl = url?.trim();

  if (!trimmedUrl) {
    return '';
  }

  try {
    const parsedUrl = new URL(trimmedUrl);
    const hostname = stripWww(parsedUrl.hostname);

    return hostname || trimmedUrl;
  } catch {
    try {
      const parsedUrl = new URL(`https://${trimmedUrl}`);
      const hostname = stripWww(parsedUrl.hostname);

      return hostname || trimmedUrl;
    } catch {
      return trimmedUrl;
    }
  }
};
