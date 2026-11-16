import {
  PORTFOLIO_ITEMS,
  SERVICES_DATA,
  TEAM_MEMBERS,
  TESTIMONIALS_DATA,
  TRANSLATIONS,
  type StudioCopy,
} from '../data/translations';
import type {
  BilingualText,
  Language,
  SiteContentConfig,
} from '../types/studio';
import { extractFileExtension } from './studioLogic';

export const SITE_ASSETS_BUCKET = 'site-assets' as const;
export const MAX_SITE_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB
export const ALLOWED_SITE_IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'webp', 'svg'];

export function getDefaultSiteContentConfig(): SiteContentConfig {
  return {
    brandName: 'Kreasiku',
    marqueeTop: {
      en: [...TRANSLATIONS.en.marqueeTop],
      id: [...TRANSLATIONS.id.marqueeTop],
    },
    doubleMarquee: {
      topItems: {
        en: [...TRANSLATIONS.en.doubleMarquee.topItems],
        id: [...TRANSLATIONS.id.doubleMarquee.topItems],
      },
      bottomItems: {
        en: [...TRANSLATIONS.en.doubleMarquee.bottomItems],
        id: [...TRANSLATIONS.id.doubleMarquee.bottomItems],
      },
    },
    hero: {
      studioLabel: {
        en: TRANSLATIONS.en.hero.studioLabel,
        id: TRANSLATIONS.id.hero.studioLabel,
      },
      headline: {
        en: TRANSLATIONS.en.hero.headline,
        id: TRANSLATIONS.id.hero.headline,
      },
      tagline: {
        en: TRANSLATIONS.en.hero.tagline,
        id: TRANSLATIONS.id.hero.tagline,
      },
      overview: {
        en: TRANSLATIONS.en.hero.overview,
        id: TRANSLATIONS.id.hero.overview,
      },
      ctaExplore: {
        en: TRANSLATIONS.en.hero.ctaExplore,
        id: TRANSLATIONS.id.hero.ctaExplore,
      },
      ctaStart: {
        en: TRANSLATIONS.en.hero.ctaStart,
        id: TRANSLATIONS.id.hero.ctaStart,
      },
      sceneImages: ['', '', ''],
      scenes: TRANSLATIONS.en.hero.scenes.map((enScene, idx) => {
        const idScene = TRANSLATIONS.id.hero.scenes[idx] ?? enScene;
        return {
          id: enScene.id,
          thumbLabel: { en: enScene.thumbLabel, id: idScene.thumbLabel },
          postcardTitle: { en: enScene.postcardTitle, id: idScene.postcardTitle },
          postcardSub: { en: enScene.postcardSub, id: idScene.postcardSub },
          letterHeading: { en: enScene.letterHeading, id: idScene.letterHeading },
          letterBody: { en: enScene.letterBody, id: idScene.letterBody },
          stickerTag: { en: enScene.stickerTag, id: idScene.stickerTag },
        };
      }),
      accordions: TRANSLATIONS.en.hero.accordions.map((enAcc, idx) => {
        const idAcc = TRANSLATIONS.id.hero.accordions[idx] ?? enAcc;
        return {
          id: enAcc.id,
          bg: enAcc.bg,
          title: { en: enAcc.title, id: idAcc.title },
          content: { en: enAcc.content, id: idAcc.content },
        };
      }),
    },
    about: {
      title: {
        en: TRANSLATIONS.en.about.title,
        id: TRANSLATIONS.id.about.title,
      },
      subtitle: {
        en: TRANSLATIONS.en.about.subtitle,
        id: TRANSLATIONS.id.about.subtitle,
      },
      storyTitle: {
        en: TRANSLATIONS.en.about.storyTitle,
        id: TRANSLATIONS.id.about.storyTitle,
      },
      storyText: {
        en: TRANSLATIONS.en.about.storyText,
        id: TRANSLATIONS.id.about.storyText,
      },
      visionTitle: {
        en: TRANSLATIONS.en.about.visionTitle,
        id: TRANSLATIONS.id.about.visionTitle,
      },
      visionText: {
        en: TRANSLATIONS.en.about.visionText,
        id: TRANSLATIONS.id.about.visionText,
      },
      missionItems: {
        en: [...TRANSLATIONS.en.about.missionItems],
        id: [...TRANSLATIONS.id.about.missionItems],
      },
      valuesList: {
        en: [...TRANSLATIONS.en.about.valuesList],
        id: [...TRANSLATIONS.id.about.valuesList],
      },
      testimonialsEyebrow: {
        en: TRANSLATIONS.en.about.testimonials.eyebrow,
        id: TRANSLATIONS.id.about.testimonials.eyebrow,
      },
      testimonialsTitle: {
        en: TRANSLATIONS.en.about.testimonials.title,
        id: TRANSLATIONS.id.about.testimonials.title,
      },
      testimonialsNote: {
        en: TRANSLATIONS.en.about.testimonials.placeholderNote,
        id: TRANSLATIONS.id.about.testimonials.placeholderNote,
      },
    },
    servicesHeader: {
      eyebrow: {
        en: TRANSLATIONS.en.services.eyebrow,
        id: TRANSLATIONS.id.services.eyebrow,
      },
      title: {
        en: TRANSLATIONS.en.services.title,
        id: TRANSLATIONS.id.services.title,
      },
      subtitle: {
        en: TRANSLATIONS.en.services.subtitle,
        id: TRANSLATIONS.id.services.subtitle,
      },
    },
    portfolioHeader: {
      eyebrow: {
        en: TRANSLATIONS.en.portfolio.eyebrow,
        id: TRANSLATIONS.id.portfolio.eyebrow,
      },
      title: {
        en: TRANSLATIONS.en.portfolio.title,
        id: TRANSLATIONS.id.portfolio.title,
      },
      subtitle: {
        en: TRANSLATIONS.en.portfolio.subtitle,
        id: TRANSLATIONS.id.portfolio.subtitle,
      },
      notice: {
        en: TRANSLATIONS.en.portfolio.placeholderNotice,
        id: TRANSLATIONS.id.portfolio.placeholderNotice,
      },
    },
    teamHeader: {
      eyebrow: {
        en: TRANSLATIONS.en.team.eyebrow,
        id: TRANSLATIONS.id.team.eyebrow,
      },
      title: {
        en: TRANSLATIONS.en.team.title,
        id: TRANSLATIONS.id.team.title,
      },
      subtitle: {
        en: TRANSLATIONS.en.team.subtitle,
        id: TRANSLATIONS.id.team.subtitle,
      },
      notice: {
        en: TRANSLATIONS.en.team.placeholderNote,
        id: TRANSLATIONS.id.team.placeholderNote,
      },
    },
    orderHeader: {
      eyebrow: {
        en: TRANSLATIONS.en.order.eyebrow,
        id: TRANSLATIONS.id.order.eyebrow,
      },
      title: {
        en: TRANSLATIONS.en.order.title,
        id: TRANSLATIONS.id.order.title,
      },
      subtitle: {
        en: TRANSLATIONS.en.order.subtitle,
        id: TRANSLATIONS.id.order.subtitle,
      },
      slipHeader: {
        en: TRANSLATIONS.en.order.slipHeader,
        id: TRANSLATIONS.id.order.slipHeader,
      },
      slipNumber: {
        en: TRANSLATIONS.en.order.slipNumber,
        id: TRANSLATIONS.id.order.slipNumber,
      },
      banner: {
        en: TRANSLATIONS.en.order.prototypeBanner,
        id: TRANSLATIONS.id.order.prototypeBanner,
      },
    },
    services: SERVICES_DATA.map((s) => ({
      ...s,
      title: { ...s.title },
      shortDesc: { ...s.shortDesc },
      turnaround: { ...s.turnaround },
      deliverables: {
        en: [...s.deliverables.en],
        id: [...s.deliverables.id],
      },
      previewCaption: { ...s.previewCaption },
    })),
    portfolio: PORTFOLIO_ITEMS.map((p) => ({
      ...p,
      media_type: p.media_type === 'video' ? 'video' : 'image',
      video_url: p.video_url ?? '',
      thumbnail: p.thumbnail ?? '',
      title: { ...p.title },
      categoryLabel: { ...p.categoryLabel },
      summary: { ...p.summary },
      deliverables: {
        en: [...p.deliverables.en],
        id: [...p.deliverables.id],
      },
    })),
    team: TEAM_MEMBERS.map((m) => ({
      ...m,
      name: { ...m.name },
      role: { ...m.role },
      specialty: { ...m.specialty },
      bio: { ...m.bio },
    })),
    testimonials: TESTIMONIALS_DATA.map((t) => ({
      ...t,
      quote: { ...t.quote },
      senderPlaceholder: { ...t.senderPlaceholder },
      projectTag: { ...t.projectTag },
    })),
    contact: {
      eyebrow: {
        en: TRANSLATIONS.en.contact.eyebrow,
        id: TRANSLATIONS.id.contact.eyebrow,
      },
      title: {
        en: TRANSLATIONS.en.contact.title,
        id: TRANSLATIONS.id.contact.title,
      },
      subtitle: {
        en: TRANSLATIONS.en.contact.subtitle,
        id: TRANSLATIONS.id.contact.subtitle,
      },
      formTitle: {
        en: TRANSLATIONS.en.contact.formTitle,
        id: TRANSLATIONS.id.contact.formTitle,
      },
      whatsappValue: TRANSLATIONS.en.contact.channels.whatsappValue,
      instagramValue: TRANSLATIONS.en.contact.channels.instagramValue,
      emailValue: TRANSLATIONS.en.contact.channels.emailValue,
    },
    footer: {
      tagline: {
        en: TRANSLATIONS.en.footer.tagline,
        id: TRANSLATIONS.id.footer.tagline,
      },
      disclaimer: {
        en: TRANSLATIONS.en.footer.prototypeDisclaimer,
        id: TRANSLATIONS.id.footer.prototypeDisclaimer,
      },
      copyright: {
        en: TRANSLATIONS.en.footer.copyright,
        id: TRANSLATIONS.id.footer.copyright,
      },
    },
  };
}

function mergeBilingual(
  fallback: BilingualText,
  override?: Partial<BilingualText> | null
): BilingualText {
  if (!override || typeof override !== 'object') {
    return fallback;
  }
  return {
    en: typeof override.en === 'string' && override.en.trim() ? override.en : fallback.en,
    id: typeof override.id === 'string' && override.id.trim() ? override.id : fallback.id,
  };
}

function mergeBilingualAllowEmpty(
  fallback: BilingualText,
  override?: Partial<BilingualText> | null
): BilingualText {
  if (!override || typeof override !== 'object') {
    return fallback;
  }
  return {
    en: typeof override.en === 'string' ? override.en : fallback.en,
    id: typeof override.id === 'string' ? override.id : fallback.id,
  };
}

function mergeStringArray(
  fallback: string[],
  override?: unknown
): string[] {
  if (!Array.isArray(override)) {
    return fallback;
  }
  const cleaned = override.filter(
    (item): item is string => typeof item === 'string' && item.trim().length > 0
  );
  return cleaned.length > 0 ? cleaned : fallback;
}

export function mergeSiteContentConfig(
  rawOverride: unknown
): SiteContentConfig {
  const defaults = getDefaultSiteContentConfig();
  if (!rawOverride || typeof rawOverride !== 'object') {
    return defaults;
  }

  const raw = rawOverride as Partial<SiteContentConfig>;

  const sceneImagesRaw = Array.isArray(raw.hero?.sceneImages)
    ? raw.hero.sceneImages
    : [];
  const sceneImages: [string, string, string] = [
    typeof sceneImagesRaw[0] === 'string' ? sceneImagesRaw[0] : '',
    typeof sceneImagesRaw[1] === 'string' ? sceneImagesRaw[1] : '',
    typeof sceneImagesRaw[2] === 'string' ? sceneImagesRaw[2] : '',
  ];

  const scenes = defaults.hero.scenes.map((defScene, idx) => {
    const rawScene = Array.isArray(raw.hero?.scenes)
      ? raw.hero.scenes[idx]
      : undefined;
    if (!rawScene || typeof rawScene !== 'object') {
      return defScene;
    }
    return {
      id: defScene.id,
      thumbLabel: mergeBilingual(defScene.thumbLabel, rawScene.thumbLabel),
      postcardTitle: mergeBilingual(defScene.postcardTitle, rawScene.postcardTitle),
      postcardSub: mergeBilingual(defScene.postcardSub, rawScene.postcardSub),
      letterHeading: mergeBilingual(defScene.letterHeading, rawScene.letterHeading),
      letterBody: mergeBilingual(defScene.letterBody, rawScene.letterBody),
      stickerTag: mergeBilingual(defScene.stickerTag, rawScene.stickerTag),
    };
  });

  const accordions = defaults.hero.accordions.map((defAcc, idx) => {
    const rawAcc = Array.isArray(raw.hero?.accordions)
      ? raw.hero.accordions[idx]
      : undefined;
    if (!rawAcc || typeof rawAcc !== 'object') {
      return defAcc;
    }
    return {
      id: defAcc.id,
      bg: typeof rawAcc.bg === 'string' && rawAcc.bg.trim() ? rawAcc.bg.trim() : defAcc.bg,
      title: mergeBilingual(defAcc.title, rawAcc.title),
      content: mergeBilingual(defAcc.content, rawAcc.content),
    };
  });

  return {
    brandName:
      typeof raw.brandName === 'string' && raw.brandName.trim()
        ? raw.brandName.trim()
        : defaults.brandName,
    marqueeTop: {
      en: mergeStringArray(defaults.marqueeTop.en, raw.marqueeTop?.en),
      id: mergeStringArray(defaults.marqueeTop.id, raw.marqueeTop?.id),
    },
    doubleMarquee: {
      topItems: {
        en: mergeStringArray(
          defaults.doubleMarquee.topItems.en,
          raw.doubleMarquee?.topItems?.en
        ),
        id: mergeStringArray(
          defaults.doubleMarquee.topItems.id,
          raw.doubleMarquee?.topItems?.id
        ),
      },
      bottomItems: {
        en: mergeStringArray(
          defaults.doubleMarquee.bottomItems.en,
          raw.doubleMarquee?.bottomItems?.en
        ),
        id: mergeStringArray(
          defaults.doubleMarquee.bottomItems.id,
          raw.doubleMarquee?.bottomItems?.id
        ),
      },
    },
    hero: {
      studioLabel: mergeBilingual(
        defaults.hero.studioLabel,
        raw.hero?.studioLabel
      ),
      headline: mergeBilingual(defaults.hero.headline, raw.hero?.headline),
      tagline: mergeBilingual(defaults.hero.tagline, raw.hero?.tagline),
      overview: mergeBilingual(defaults.hero.overview, raw.hero?.overview),
      ctaExplore: mergeBilingual(defaults.hero.ctaExplore, raw.hero?.ctaExplore),
      ctaStart: mergeBilingual(defaults.hero.ctaStart, raw.hero?.ctaStart),
      sceneImages,
      scenes,
      accordions,
    },
    about: {
      title: mergeBilingual(defaults.about.title, raw.about?.title),
      subtitle: mergeBilingual(defaults.about.subtitle, raw.about?.subtitle),
      storyTitle: mergeBilingual(defaults.about.storyTitle, raw.about?.storyTitle),
      storyText: mergeBilingual(defaults.about.storyText, raw.about?.storyText),
      visionTitle: mergeBilingual(defaults.about.visionTitle, raw.about?.visionTitle),
      visionText: mergeBilingual(defaults.about.visionText, raw.about?.visionText),
      missionItems: {
        en: mergeStringArray(defaults.about.missionItems.en, raw.about?.missionItems?.en),
        id: mergeStringArray(defaults.about.missionItems.id, raw.about?.missionItems?.id),
      },
      valuesList: {
        en: mergeStringArray(defaults.about.valuesList.en, raw.about?.valuesList?.en),
        id: mergeStringArray(defaults.about.valuesList.id, raw.about?.valuesList?.id),
      },
      testimonialsEyebrow: mergeBilingual(
        defaults.about.testimonialsEyebrow,
        raw.about?.testimonialsEyebrow
      ),
      testimonialsTitle: mergeBilingual(
        defaults.about.testimonialsTitle,
        raw.about?.testimonialsTitle
      ),
      testimonialsNote: mergeBilingualAllowEmpty(
        defaults.about.testimonialsNote,
        raw.about?.testimonialsNote
      ),
    },
    servicesHeader: {
      eyebrow: mergeBilingual(
        defaults.servicesHeader.eyebrow,
        raw.servicesHeader?.eyebrow
      ),
      title: mergeBilingual(
        defaults.servicesHeader.title,
        raw.servicesHeader?.title
      ),
      subtitle: mergeBilingual(
        defaults.servicesHeader.subtitle,
        raw.servicesHeader?.subtitle
      ),
    },
    portfolioHeader: {
      eyebrow: mergeBilingual(
        defaults.portfolioHeader.eyebrow,
        raw.portfolioHeader?.eyebrow
      ),
      title: mergeBilingual(
        defaults.portfolioHeader.title,
        raw.portfolioHeader?.title
      ),
      subtitle: mergeBilingual(
        defaults.portfolioHeader.subtitle,
        raw.portfolioHeader?.subtitle
      ),
      notice: mergeBilingualAllowEmpty(
        defaults.portfolioHeader.notice,
        raw.portfolioHeader?.notice
      ),
    },
    teamHeader: {
      eyebrow: mergeBilingual(
        defaults.teamHeader.eyebrow,
        raw.teamHeader?.eyebrow
      ),
      title: mergeBilingual(
        defaults.teamHeader.title,
        raw.teamHeader?.title
      ),
      subtitle: mergeBilingual(
        defaults.teamHeader.subtitle,
        raw.teamHeader?.subtitle
      ),
      notice: mergeBilingualAllowEmpty(
        defaults.teamHeader.notice,
        raw.teamHeader?.notice
      ),
    },
    orderHeader: {
      eyebrow: mergeBilingual(
        defaults.orderHeader.eyebrow,
        raw.orderHeader?.eyebrow
      ),
      title: mergeBilingual(
        defaults.orderHeader.title,
        raw.orderHeader?.title
      ),
      subtitle: mergeBilingual(
        defaults.orderHeader.subtitle,
        raw.orderHeader?.subtitle
      ),
      slipHeader: mergeBilingual(
        defaults.orderHeader.slipHeader,
        raw.orderHeader?.slipHeader
      ),
      slipNumber: mergeBilingual(
        defaults.orderHeader.slipNumber,
        raw.orderHeader?.slipNumber
      ),
      banner: mergeBilingualAllowEmpty(
        defaults.orderHeader.banner,
        raw.orderHeader?.banner
      ),
    },
    services:
      Array.isArray(raw.services) && raw.services.length > 0
        ? raw.services
        : defaults.services,
    portfolio:
      Array.isArray(raw.portfolio) && raw.portfolio.length > 0
        ? raw.portfolio.map((item) => ({
            ...item,
            media_type: item.media_type === 'video' ? 'video' : 'image',
            video_url:
              typeof item.video_url === 'string' ? item.video_url : '',
            thumbnail:
              typeof item.thumbnail === 'string' ? item.thumbnail : '',
          }))
        : defaults.portfolio,
    team:
      Array.isArray(raw.team) && raw.team.length > 0 ? raw.team : defaults.team,
    testimonials:
      Array.isArray(raw.testimonials) && raw.testimonials.length > 0
        ? raw.testimonials
        : defaults.testimonials,
    contact: {
      eyebrow: mergeBilingual(defaults.contact.eyebrow, raw.contact?.eyebrow),
      title: mergeBilingual(defaults.contact.title, raw.contact?.title),
      subtitle: mergeBilingual(defaults.contact.subtitle, raw.contact?.subtitle),
      formTitle: mergeBilingual(
        defaults.contact.formTitle,
        raw.contact?.formTitle
      ),
      whatsappValue:
        typeof raw.contact?.whatsappValue === 'string' &&
        raw.contact.whatsappValue.trim()
          ? raw.contact.whatsappValue.trim()
          : defaults.contact.whatsappValue,
      instagramValue:
        typeof raw.contact?.instagramValue === 'string' &&
        raw.contact.instagramValue.trim()
          ? raw.contact.instagramValue.trim()
          : defaults.contact.instagramValue,
      emailValue:
        typeof raw.contact?.emailValue === 'string' &&
        raw.contact.emailValue.trim()
          ? raw.contact.emailValue.trim()
          : defaults.contact.emailValue,
    },
    footer: {
      tagline: mergeBilingual(defaults.footer.tagline, raw.footer?.tagline),
      disclaimer: mergeBilingualAllowEmpty(
        defaults.footer.disclaimer,
        raw.footer?.disclaimer
      ),
      copyright: mergeBilingual(defaults.footer.copyright, raw.footer?.copyright),
    },
  };
}

export function buildLocalizedStudioCopy(
  config: SiteContentConfig,
  lang: Language
): StudioCopy {
  const base = TRANSLATIONS[lang];
  return {
    ...base,
    marqueeTop: config.marqueeTop[lang],
    doubleMarquee: {
      topItems: config.doubleMarquee.topItems[lang],
      bottomItems: config.doubleMarquee.bottomItems[lang],
    },
    hero: {
      ...base.hero,
      studioLabel: config.hero.studioLabel[lang],
      headline: config.hero.headline[lang],
      tagline: config.hero.tagline[lang],
      overview: config.hero.overview[lang],
      ctaExplore: config.hero.ctaExplore[lang],
      ctaStart: config.hero.ctaStart[lang],
      scenes: config.hero.scenes.map((scene) => ({
        id: scene.id,
        thumbLabel: scene.thumbLabel[lang],
        postcardTitle: scene.postcardTitle[lang],
        postcardSub: scene.postcardSub[lang],
        letterHeading: scene.letterHeading[lang],
        letterBody: scene.letterBody[lang],
        stickerTag: scene.stickerTag[lang],
      })),
      accordions: config.hero.accordions.map((acc) => ({
        id: acc.id,
        bg: acc.bg,
        title: acc.title[lang],
        content: acc.content[lang],
      })),
    },
    about: {
      ...base.about,
      title: config.about.title[lang],
      subtitle: config.about.subtitle[lang],
      storyTitle: config.about.storyTitle[lang],
      storyText: config.about.storyText[lang],
      visionTitle: config.about.visionTitle[lang],
      visionText: config.about.visionText[lang],
      missionItems: config.about.missionItems[lang],
      valuesList: config.about.valuesList[lang],
      testimonials: {
        ...base.about.testimonials,
        eyebrow: config.about.testimonialsEyebrow[lang],
        title: config.about.testimonialsTitle[lang],
        placeholderNote: config.about.testimonialsNote[lang],
      },
    },
    services: {
      ...base.services,
      eyebrow: config.servicesHeader.eyebrow[lang],
      title: config.servicesHeader.title[lang],
      subtitle: config.servicesHeader.subtitle[lang],
    },
    portfolio: {
      ...base.portfolio,
      eyebrow: config.portfolioHeader.eyebrow[lang],
      title: config.portfolioHeader.title[lang],
      subtitle: config.portfolioHeader.subtitle[lang],
      placeholderNotice: config.portfolioHeader.notice[lang],
    },
    team: {
      ...base.team,
      eyebrow: config.teamHeader.eyebrow[lang],
      title: config.teamHeader.title[lang],
      subtitle: config.teamHeader.subtitle[lang],
      placeholderNote: config.teamHeader.notice[lang],
    },
    order: {
      ...base.order,
      eyebrow: config.orderHeader.eyebrow[lang],
      title: config.orderHeader.title[lang],
      subtitle: config.orderHeader.subtitle[lang],
      slipHeader: config.orderHeader.slipHeader[lang],
      slipNumber: config.orderHeader.slipNumber[lang],
      prototypeBanner: config.orderHeader.banner[lang],
    },
    contact: {
      ...base.contact,
      eyebrow: config.contact.eyebrow[lang],
      title: config.contact.title[lang],
      subtitle: config.contact.subtitle[lang],
      formTitle: config.contact.formTitle[lang],
      channels: {
        ...base.contact.channels,
        whatsappValue: config.contact.whatsappValue,
        instagramValue: config.contact.instagramValue,
        emailValue: config.contact.emailValue,
      },
    },
    footer: {
      ...base.footer,
      tagline: config.footer.tagline[lang],
      prototypeDisclaimer: config.footer.disclaimer[lang],
      copyright: config.footer.copyright[lang],
    },
  };
}

export function validateSiteImageFile(
  fileName: string,
  fileSize: number,
  lang: Language
): string | null {
  const ext = extractFileExtension(fileName);
  if (!ext || !ALLOWED_SITE_IMAGE_EXTS.includes(ext)) {
    return lang === 'id'
      ? 'Format gambar harus PNG, JPG, JPEG, WEBP, atau SVG.'
      : 'Image format must be PNG, JPG, JPEG, WEBP, or SVG.';
  }
  if (fileSize <= 0 || fileSize > MAX_SITE_IMAGE_BYTES) {
    return lang === 'id'
      ? 'Ukuran gambar maksimal 5 MB.'
      : 'Maximum image size is 5 MB.';
  }
  return null;
}

export function buildSiteAssetPath(
  folder: 'hero' | 'team' | 'portfolio',
  fileUuid: string,
  fileName: string
): string {
  const ext = extractFileExtension(fileName);
  if (!ext || !ALLOWED_SITE_IMAGE_EXTS.includes(ext)) {
    throw new Error(`Unsupported image extension: ${fileName}`);
  }
  return `${folder}/${fileUuid}.${ext}`;
}
