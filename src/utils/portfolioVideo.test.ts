import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parsePortfolioVideoUrl,
  resolvePortfolioCardThumbnail,
  validatePortfolioVideoUrl,
  validatePortfolioVideosInConfig,
} from './portfolioVideo';
import { getDefaultSiteContentConfig } from './siteConfigLogic';

test('parsePortfolioVideoUrl supports standard YouTube and Vimeo URL formats', () => {
  const ytWatch = parsePortfolioVideoUrl(
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=12s'
  );
  assert.ok(ytWatch);
  assert.equal(ytWatch.provider, 'youtube');
  assert.equal(ytWatch.videoId, 'dQw4w9WgXcQ');
  assert.equal(
    ytWatch.embedUrl,
    'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0'
  );
  assert.equal(
    ytWatch.defaultThumbnailUrl,
    'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
  );

  const ytShort = parsePortfolioVideoUrl('https://youtu.be/abc123XYZ_-');
  assert.ok(ytShort);
  assert.equal(ytShort.provider, 'youtube');
  assert.equal(ytShort.videoId, 'abc123XYZ_-');

  const ytShorts = parsePortfolioVideoUrl(
    'https://www.youtube.com/shorts/shortVid99'
  );
  assert.ok(ytShorts);
  assert.equal(ytShorts.provider, 'youtube');
  assert.equal(ytShorts.videoId, 'shortVid99');

  const vimeo = parsePortfolioVideoUrl('https://vimeo.com/76979871');
  assert.ok(vimeo);
  assert.equal(vimeo.provider, 'vimeo');
  assert.equal(vimeo.videoId, '76979871');
  assert.equal(
    vimeo.embedUrl,
    'https://player.vimeo.com/video/76979871?autoplay=1'
  );
  assert.equal(vimeo.defaultThumbnailUrl, null);

  const vimeoPrivate = parsePortfolioVideoUrl(
    'https://vimeo.com/123456789/a1b2c3d4e5'
  );
  assert.ok(vimeoPrivate);
  assert.equal(
    vimeoPrivate.embedUrl,
    'https://player.vimeo.com/video/123456789?autoplay=1&h=a1b2c3d4e5'
  );

  const vimeoPlayer = parsePortfolioVideoUrl(
    'https://player.vimeo.com/video/987654321?h=abcdef12'
  );
  assert.ok(vimeoPlayer);
  assert.equal(
    vimeoPlayer.embedUrl,
    'https://player.vimeo.com/video/987654321?autoplay=1&h=abcdef12'
  );
});

test('validatePortfolioVideoUrl rejects empty, non-HTTP, and unsupported domains', () => {
  assert.ok(validatePortfolioVideoUrl('', 'id'));
  assert.ok(validatePortfolioVideoUrl('not-a-url', 'en'));
  assert.ok(validatePortfolioVideoUrl('javascript:alert(1)', 'en'));
  assert.ok(
    validatePortfolioVideoUrl('https://example.com/video.mp4', 'id')
  );
  assert.ok(
    validatePortfolioVideoUrl('https://www.youtube.com/watch', 'id')
  );

  assert.equal(
    validatePortfolioVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'id'),
    null
  );
  assert.equal(
    validatePortfolioVideoUrl('https://vimeo.com/76979871', 'en'),
    null
  );
});

test('resolvePortfolioCardThumbnail prefers custom thumbnail, then imageUrl, then YouTube auto thumbnail', () => {
  assert.equal(
    resolvePortfolioCardThumbnail({
      media_type: 'video',
      video_url: 'https://youtu.be/dQw4w9WgXcQ',
      thumbnail: 'https://cdn.example.com/custom-thumb.jpg',
      imageUrl: 'https://cdn.example.com/legacy-image.jpg',
    }),
    'https://cdn.example.com/custom-thumb.jpg'
  );

  assert.equal(
    resolvePortfolioCardThumbnail({
      media_type: 'video',
      video_url: 'https://youtu.be/dQw4w9WgXcQ',
      thumbnail: '',
      imageUrl: '',
    }),
    'https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg'
  );

  assert.equal(
    resolvePortfolioCardThumbnail({
      media_type: 'video',
      video_url: 'https://vimeo.com/76979871',
      thumbnail: '',
      imageUrl: '',
    }),
    ''
  );
});

test('validatePortfolioVideosInConfig flags only video items with invalid URLs', () => {
  const defaults = getDefaultSiteContentConfig();
  assert.equal(validatePortfolioVideosInConfig(defaults.portfolio, 'id'), null);

  const modified = defaults.portfolio.map((item) =>
    item.category === 'video-editing'
      ? { ...item, media_type: 'video' as const, video_url: 'https://invalid.com/123' }
      : item
  );
  const err = validatePortfolioVideosInConfig(modified, 'id');
  assert.ok(err);
  assert.equal(err.itemId, 'arch-02');

  const fixed = defaults.portfolio.map((item) =>
    item.category === 'video-editing'
      ? { ...item, media_type: 'video' as const, video_url: 'https://youtu.be/dQw4w9WgXcQ' }
      : item
  );
  assert.equal(validatePortfolioVideosInConfig(fixed, 'id'), null);
});
