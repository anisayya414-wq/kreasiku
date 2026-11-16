/**
 * Pastel Theme Color Mapper
 * Gracefully translates legacy retro-cream defaults stored in older
 * site_settings snapshots into the Honeydew – Tea Green – Mauve – Sky Blue – Royal Blue palette,
 * while preserving any custom hex color an admin explicitly chooses.
 */

export const PASTEL_TOKENS = {
  honeydew: '#E5F8F0',
  teaGreen: '#ECFFBE',
  mauve: '#BCA4F5',
  mauveSoft: '#E9DFFD',
  skyBlue: '#81CFFF',
  skySoft: '#D7F0FF',
  royalBlue: '#4A69CE',
  royalDeep: '#334FA8',
  inkIndigo: '#1E2B58',
  sakura: '#FADCE8',
  canvas: '#F6FCF9',
} as const;

const LEGACY_TO_PASTEL: Record<string, string> = {
  '#FAF6F0': PASTEL_TOKENS.canvas,
  '#F4EFE6': PASTEL_TOKENS.honeydew,
  '#F3F0D7': PASTEL_TOKENS.teaGreen,
  '#F3C6CF': PASTEL_TOKENS.sakura,
  '#C5D9F1': PASTEL_TOKENS.skySoft,
  '#D4D18C': PASTEL_TOKENS.teaGreen,
  '#F9E8A2': PASTEL_TOKENS.honeydew,
  '#F2B89B': PASTEL_TOKENS.mauveSoft,
  '#E2D9EE': PASTEL_TOKENS.mauveSoft,
  '#3B2322': PASTEL_TOKENS.inkIndigo,
  '#4A1F2D': PASTEL_TOKENS.royalBlue,
};

export function resolvePastelSurface(
  rawColor?: string,
  fallback: string = PASTEL_TOKENS.honeydew
): string {
  if (!rawColor) return fallback;
  const normalized = rawColor.trim().toUpperCase();
  return LEGACY_TO_PASTEL[normalized] ?? rawColor;
}

export const REFERENCE_PALETTE_CYCLE = [
  PASTEL_TOKENS.honeydew,
  PASTEL_TOKENS.teaGreen,
  PASTEL_TOKENS.mauveSoft,
  PASTEL_TOKENS.skySoft,
  PASTEL_TOKENS.sakura,
] as const;

export const REFERENCE_ICON_BADGE_CYCLE = [
  { bg: PASTEL_TOKENS.honeydew, star: PASTEL_TOKENS.mauve },
  { bg: PASTEL_TOKENS.teaGreen, star: PASTEL_TOKENS.skyBlue },
  { bg: PASTEL_TOKENS.mauve, star: PASTEL_TOKENS.honeydew },
  { bg: PASTEL_TOKENS.skyBlue, star: PASTEL_TOKENS.royalBlue },
  { bg: PASTEL_TOKENS.royalBlue, star: PASTEL_TOKENS.teaGreen },
] as const;
