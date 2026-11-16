import type { Language, PortfolioItem } from '../types/studio';

export type VideoProvider = 'youtube' | 'vimeo';

export interface ParsedPortfolioVideo {
  provider: VideoProvider;
  videoId: string;
  embedUrl: string;
  defaultThumbnailUrl: string | null;
  normalizedUrl: string;
}

const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{6,20}$/;
const VIMEO_ID_REGEX = /^\d{5,15}$/;
const VIMEO_HASH_REGEX = /^[A-Za-z0-9]{6,20}$/;

function extractYouTubeId(parsed: URL): string | null {
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  if (host === 'youtu.be') {
    const candidate = parsed.pathname.split('/').filter(Boolean)[0] ?? '';
    return YOUTUBE_ID_REGEX.test(candidate) ? candidate : null;
  }

  if (
    host === 'youtube.com' ||
    host === 'm.youtube.com' ||
    host === 'youtube-nocookie.com'
  ) {
    const segments = parsed.pathname.split('/').filter(Boolean);
    if (parsed.pathname === '/watch' || parsed.pathname === '/watch/') {
      const v = parsed.searchParams.get('v') ?? '';
      return YOUTUBE_ID_REGEX.test(v) ? v : null;
    }
    if (
      segments.length >= 2 &&
      (segments[0] === 'embed' ||
        segments[0] === 'shorts' ||
        segments[0] === 'live')
    ) {
      const candidate = segments[1] ?? '';
      return YOUTUBE_ID_REGEX.test(candidate) ? candidate : null;
    }
  }

  return null;
}

function extractVimeoDetails(
  parsed: URL
): { videoId: string; hash?: string } | null {
  const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') {
    return null;
  }

  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments.length === 0) {
    return null;
  }

  // player.vimeo.com/video/<id>
  if (host === 'player.vimeo.com') {
    if (segments[0] === 'video' && segments[1] && VIMEO_ID_REGEX.test(segments[1])) {
      const h = parsed.searchParams.get('h') ?? undefined;
      return {
        videoId: segments[1],
        hash: h && VIMEO_HASH_REGEX.test(h) ? h : undefined,
      };
    }
    return null;
  }

  // vimeo.com/<id> or vimeo.com/<id>/<hash>
  if (VIMEO_ID_REGEX.test(segments[0])) {
    const hashCandidate = segments[1];
    return {
      videoId: segments[0],
      hash:
        hashCandidate && VIMEO_HASH_REGEX.test(hashCandidate)
          ? hashCandidate
          : undefined,
    };
  }

  // vimeo.com/channels/<name>/<id> or vimeo.com/groups/<name>/videos/<id>
  const last = segments[segments.length - 1];
  if (last && VIMEO_ID_REGEX.test(last)) {
    return { videoId: last };
  }

  return null;
}

export function parsePortfolioVideoUrl(
  rawUrl: string
): ParsedPortfolioVideo | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return null;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return null;
  }

  const ytId = extractYouTubeId(parsed);
  if (ytId) {
    return {
      provider: 'youtube',
      videoId: ytId,
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`,
      defaultThumbnailUrl: `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg`,
      normalizedUrl: trimmed,
    };
  }

  const vimeo = extractVimeoDetails(parsed);
  if (vimeo) {
    const hashQuery = vimeo.hash ? `&h=${encodeURIComponent(vimeo.hash)}` : '';
    return {
      provider: 'vimeo',
      videoId: vimeo.videoId,
      embedUrl: `https://player.vimeo.com/video/${vimeo.videoId}?autoplay=1${hashQuery}`,
      defaultThumbnailUrl: null,
      normalizedUrl: trimmed,
    };
  }

  return null;
}

export function validatePortfolioVideoUrl(
  rawUrl: string,
  lang: Language
): string | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) {
    return lang === 'id'
      ? 'URL video YouTube atau Vimeo wajib diisi untuk item portofolio bertipe video.'
      : 'A YouTube or Vimeo video URL is required for video portfolio items.';
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return lang === 'id'
      ? 'Format URL video tidak valid. Pastikan diawali dengan https://.'
      : 'Invalid video URL format. Make sure it starts with https://.';
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return lang === 'id'
      ? 'URL video harus menggunakan protokol http:// atau https://.'
      : 'Video URL must use http:// or https://.';
  }

  if (!parsePortfolioVideoUrl(trimmed)) {
    return lang === 'id'
      ? 'Masukkan tautan YouTube atau Vimeo yang valid (cth. https://youtu.be/... atau https://vimeo.com/...).'
      : 'Enter a valid YouTube or Vimeo URL (e.g. https://youtu.be/... or https://vimeo.com/...).';
  }

  return null;
}

export function resolvePortfolioCardThumbnail(
  item: Pick<PortfolioItem, 'media_type' | 'video_url' | 'thumbnail' | 'imageUrl'>
): string {
  const customThumb = item.thumbnail?.trim();
  if (customThumb) {
    return customThumb;
  }

  const fallbackImage = item.imageUrl?.trim();
  if (fallbackImage) {
    return fallbackImage;
  }

  if (item.media_type === 'video' && item.video_url) {
    const parsed = parsePortfolioVideoUrl(item.video_url);
    if (parsed?.defaultThumbnailUrl) {
      return parsed.defaultThumbnailUrl;
    }
  }

  return '';
}

export function validatePortfolioVideosInConfig(
  items: PortfolioItem[],
  lang: Language
): { itemId: string; title: string; error: string } | null {
  for (const item of items) {
    if (item.media_type === 'video') {
      const error = validatePortfolioVideoUrl(item.video_url ?? '', lang);
      if (error) {
        return {
          itemId: item.id,
          title: item.title[lang] || item.archiveNumber,
          error,
        };
      }
    }
  }
  return null;
}
