const MAX_DISPLAY_LENGTH = 40;

const stripWww = (hostname: string) => hostname.replace(/^www\./i, '');

const truncateWithEllipsis = (value: string, maxLength = MAX_DISPLAY_LENGTH) => {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, Math.max(0, maxLength - 3)).trimEnd()}...`;
};

/**
 * Returns a compact display value for a URL.
 * Prefer the hostname, and fall back to a truncated original value when parsing fails.
 */
export const getDisplayUrl = (url: string): string => {
  const trimmedUrl = url?.trim();

  if (!trimmedUrl) {
    return '';
  }

  try {
    const parsedUrl = new URL(trimmedUrl);
    const hostname = stripWww(parsedUrl.hostname);

    return hostname || truncateWithEllipsis(trimmedUrl);
  } catch {
    try {
      const parsedUrl = new URL(`https://${trimmedUrl}`);
      const hostname = stripWww(parsedUrl.hostname);

      return hostname || truncateWithEllipsis(trimmedUrl);
    } catch {
      return truncateWithEllipsis(trimmedUrl);
    }
  }
};
