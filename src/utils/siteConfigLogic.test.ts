import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildLocalizedStudioCopy,
  buildSiteAssetPath,
  getDefaultSiteContentConfig,
  mergeSiteContentConfig,
  validateSiteImageFile,
} from './siteConfigLogic';

test('getDefaultSiteContentConfig and mergeSiteContentConfig preserve defaults and apply partial overrides', () => {
  const defaults = getDefaultSiteContentConfig();
  assert.equal(defaults.brandName, 'Kreasiku');
  assert.equal(defaults.team.length, 4);
  assert.equal(defaults.portfolio.length, 6);
  assert.equal(defaults.services.length, 6);

  const merged = mergeSiteContentConfig({
    brandName: 'Studio Kreasiku Baru',
    hero: {
      headline: { en: 'Custom Studio Headline', id: 'Judul Studio Kustom' },
      sceneImages: ['https://example.com/hero1.png', '', ''],
    },
    contact: {
      emailValue: 'halo@kreasiku.id',
    },
  });

  assert.equal(merged.brandName, 'Studio Kreasiku Baru');
  assert.equal(merged.hero.headline.id, 'Judul Studio Kustom');
  assert.equal(merged.hero.sceneImages[0], 'https://example.com/hero1.png');
  assert.equal(merged.hero.tagline.en, defaults.hero.tagline.en);
  assert.equal(merged.contact.emailValue, 'halo@kreasiku.id');
  assert.equal(merged.contact.whatsappValue, defaults.contact.whatsappValue);
});

test('buildLocalizedStudioCopy reflects overridden config fields per language', () => {
  const merged = mergeSiteContentConfig({
    about: {
      storyText: {
        en: 'Updated English studio story.',
        id: 'Cerita studio terbaru.',
      },
    },
    contact: {
      instagramValue: '@kreasiku.official',
    },
  });

  const enCopy = buildLocalizedStudioCopy(merged, 'en');
  const idCopy = buildLocalizedStudioCopy(merged, 'id');
  assert.equal(enCopy.about.storyText, 'Updated English studio story.');
  assert.equal(idCopy.about.storyText, 'Cerita studio terbaru.');
  assert.equal(enCopy.contact.channels.instagramValue, '@kreasiku.official');
});

test('mergeSiteContentConfig allows clearing placeholder notices to empty strings and editing hero scenes & accordions', () => {
  const merged = mergeSiteContentConfig({
    hero: {
      scenes: [
        { postcardTitle: { en: 'Real Print Showcase', id: 'Karya Cetak Asli' } },
      ],
      accordions: [
        { title: { en: 'Custom FAQ 1', id: 'FAQ Kustom 1' } },
      ],
    },
    about: {
      testimonialsNote: { en: '', id: '' },
    },
    portfolioHeader: {
      title: { en: 'Selected Client Work', id: 'Karya Pilihan' },
      notice: { en: '', id: '' },
    },
    teamHeader: {
      notice: { en: '', id: '' },
    },
    footer: {
      disclaimer: { en: '', id: '' },
    },
  });

  const idCopy = buildLocalizedStudioCopy(merged, 'id');
  assert.equal(idCopy.hero.scenes[0].postcardTitle, 'Karya Cetak Asli');
  assert.equal(idCopy.hero.accordions[0].title, 'FAQ Kustom 1');
  assert.equal(idCopy.about.testimonials.placeholderNote, '');
  assert.equal(idCopy.portfolio.title, 'Karya Pilihan');
  assert.equal(idCopy.portfolio.placeholderNotice, '');
  assert.equal(idCopy.team.placeholderNote, '');
  assert.equal(idCopy.footer.prototypeDisclaimer, '');
});

test('validateSiteImageFile and buildSiteAssetPath validate allowed image formats and 5MB cap', () => {
  assert.equal(validateSiteImageFile('portrait.webp', 250000, 'id'), null);
  assert.ok(validateSiteImageFile('document.pdf', 1024, 'en'));
  assert.ok(validateSiteImageFile('huge.png', 6 * 1024 * 1024, 'id'));

  const path = buildSiteAssetPath(
    'team',
    '11111111-2222-4333-8444-555555555555',
    'Avatar.PNG'
  );
  assert.equal(path, 'team/11111111-2222-4333-8444-555555555555.png');
  assert.throws(() => buildSiteAssetPath('hero', 'abc', 'malware.exe'));
});

test('mergeSiteContentConfig normalizes portfolio media_type, video_url, and thumbnail cleanly', () => {
  const defaults = getDefaultSiteContentConfig();
  const videoOverride = defaults.portfolio.map((item, idx) =>
    idx === 1
      ? {
          ...item,
          media_type: 'video' as const,
          video_url: 'https://vimeo.com/76979871',
          thumbnail: 'https://example.com/reel-cover.jpg',
        }
      : item
  );

  const merged = mergeSiteContentConfig({ portfolio: videoOverride });
  assert.equal(merged.portfolio[0].media_type, 'image');
  assert.equal(merged.portfolio[0].video_url, '');
  assert.equal(merged.portfolio[1].media_type, 'video');
  assert.equal(merged.portfolio[1].video_url, 'https://vimeo.com/76979871');
  assert.equal(
    merged.portfolio[1].thumbnail,
    'https://example.com/reel-cover.jpg'
  );
});

