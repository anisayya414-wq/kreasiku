import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildOrderAttachmentPath,
  extractFileExtension,
  filterPortfolioItems,
  formatFileSize,
  formatSupabaseErrorMessage,
  hasErrors,
  mapContactFormToPayload,
  mapOrderAttachmentToPayload,
  mapOrderFormToPayload,
  stepSlideIndex,
  validateAttachment,
  validateContactForm,
  validateOrderForm,
  wrapSlideIndex,
} from './studioLogic';
import {
  PORTFOLIO_ITEMS,
  SERVICES_DATA,
  TESTIMONIALS_DATA,
  TRANSLATIONS,
} from '../data/translations';
import type { OrderFormData } from '../types/studio';

const VALID_ORDER: OrderFormData = {
  fullName: 'Nadia Pratama',
  email: 'nadia@example.com',
  whatsapp: '+62 812-3456-7890',
  serviceCategory: 'poster-design',
  projectTitle: 'Indie Music Night Poster',
  description: 'A3 concert poster with pastel stationery vibe and clean typography.',
  preferences: 'Warm cream background, dusty pink accents',
  deadline: '2026-12-01',
  budget: 'Standard (IDR 500K – 1.5M / $35 – $100)',
  notes: 'Need print-ready CMYK PDF',
  attachmentName: 'moodboard.pdf',
  attachmentSize: 512000,
};

test('validateOrderForm passes on complete valid data in EN and ID', () => {
  const errEn = validateOrderForm(VALID_ORDER, 'en');
  const errId = validateOrderForm(VALID_ORDER, 'id');
  assert.equal(hasErrors(errEn), false);
  assert.equal(hasErrors(errId), false);
});

test('validateOrderForm catches missing and invalid required fields', () => {
  const invalid: OrderFormData = {
    ...VALID_ORDER,
    fullName: 'A',
    email: 'not-an-email',
    whatsapp: '123',
    serviceCategory: '',
    projectTitle: '',
    description: 'Too short',
    deadline: '',
    budget: '',
  };
  const errors = validateOrderForm(invalid, 'en');
  assert.equal(hasErrors(errors), true);
  assert.ok(errors.fullName);
  assert.ok(errors.email);
  assert.ok(errors.whatsapp);
  assert.ok(errors.serviceCategory);
  assert.ok(errors.projectTitle);
  assert.ok(errors.description);
  assert.ok(errors.deadline);
  assert.ok(errors.budget);
});

test('validateAttachment enforces allowed formats and 10MB cap', () => {
  assert.equal(validateAttachment('sketch.png', 1024 * 1024, 'en'), null);
  assert.ok(validateAttachment('script.exe', 1024, 'en'));
  assert.ok(validateAttachment('huge.psd', 11 * 1024 * 1024, 'id'));
});

test('validateContactForm catches invalid email and short message', () => {
  const errs = validateContactForm(
    { name: '', email: 'bad', subject: 'Hi', message: 'short' },
    'id'
  );
  assert.equal(hasErrors(errs), true);
  assert.ok(errs.name);
  assert.ok(errs.email);
  assert.ok(errs.subject);
  assert.ok(errs.message);

  const ok = validateContactForm(
    {
      name: 'Raka',
      email: 'raka@studio.id',
      subject: 'Poster inquiry',
      message: 'Hello Kreasiku, can we discuss a 3-poster bundle?',
    },
    'en'
  );
  assert.equal(hasErrors(ok), false);
});

test('filterPortfolioItems filters by category and preserves all', () => {
  const all = filterPortfolioItems(PORTFOLIO_ITEMS, 'all');
  assert.equal(all.length, PORTFOLIO_ITEMS.length);

  const posters = filterPortfolioItems(PORTFOLIO_ITEMS, 'poster-design');
  assert.ok(posters.length >= 1);
  assert.ok(posters.every((item) => item.category === 'poster-design'));
});

test('formatFileSize formats bytes, KB, and MB cleanly', () => {
  assert.equal(formatFileSize(512), '512 B');
  assert.equal(formatFileSize(2048), '2.0 KB');
  assert.equal(formatFileSize(2 * 1024 * 1024), '2.00 MB');
});

test('bilingual dictionaries and services cover all 6 disciplines', () => {
  assert.equal(SERVICES_DATA.length, 6);
  assert.equal(TRANSLATIONS.en.hero.accordions.length, 3);
  assert.equal(TRANSLATIONS.id.hero.accordions.length, 3);
  assert.equal(TRANSLATIONS.en.portfolio.filters.length, 7);
  assert.equal(TRANSLATIONS.id.portfolio.filters.length, 7);
});

test('wrapSlideIndex and stepSlideIndex wrap cleanly across bounds', () => {
  assert.equal(wrapSlideIndex(0, 4), 0);
  assert.equal(wrapSlideIndex(-1, 4), 3);
  assert.equal(wrapSlideIndex(4, 4), 0);
  assert.equal(stepSlideIndex(0, -1, 4), 3);
  assert.equal(stepSlideIndex(3, 1, 4), 0);
  assert.equal(stepSlideIndex(1, 1, 4), 2);
  assert.equal(wrapSlideIndex(2, 0), 0);
});

test('testimonials include both handwritten and telegram formats with EN/ID text', () => {
  assert.ok(TESTIMONIALS_DATA.length >= 4);
  assert.ok(TESTIMONIALS_DATA.some((t) => t.style === 'handwritten'));
  assert.ok(TESTIMONIALS_DATA.some((t) => t.style === 'telegram'));
  for (const t of TESTIMONIALS_DATA) {
    assert.ok(t.quote.en.length > 10);
    assert.ok(t.quote.id.length > 10);
    assert.ok(t.senderPlaceholder.en.length > 2);
    assert.ok(t.senderPlaceholder.id.length > 2);
  }
});

test('mapOrderFormToPayload maps form fields to exact orders database columns', () => {
  const payload = mapOrderFormToPayload({
    ...VALID_ORDER,
    fullName: '  Nadia Pratama  ',
    preferences: '   ',
    notes: '',
  });
  assert.deepEqual(payload, {
    customer_name: 'Nadia Pratama',
    email: 'nadia@example.com',
    whatsapp: '+62 812-3456-7890',
    service: 'poster-design',
    project_title: 'Indie Music Night Poster',
    description: 'A3 concert poster with pastel stationery vibe and clean typography.',
    preferences: null,
    deadline: '2026-12-01',
    budget: 'Standard (IDR 500K – 1.5M / $35 – $100)',
    notes: null,
  });
});

test('mapContactFormToPayload maps form fields strictly to name, email, and message columns', () => {
  const payload = mapContactFormToPayload({
    name: '  Raka  ',
    email: ' raka@studio.id ',
    subject: 'Poster inquiry',
    message: 'Hello Kreasiku, can we discuss a 3-poster bundle?',
  });
  assert.deepEqual(payload, {
    name: 'Raka',
    email: 'raka@studio.id',
    message: '[Poster inquiry] Hello Kreasiku, can we discuss a 3-poster bundle?',
  });
  assert.deepEqual(Object.keys(payload).sort(), ['email', 'message', 'name']);
});

test('formatSupabaseErrorMessage distinguishes unconfigured env from API errors in EN and ID', () => {
  const unconfiguredEn = formatSupabaseErrorMessage(null, 'en', false);
  const unconfiguredId = formatSupabaseErrorMessage(null, 'id', false);
  assert.ok(unconfiguredEn.includes('VITE_SUPABASE_URL'));
  assert.ok(unconfiguredId.includes('VITE_SUPABASE_ANON_KEY'));

  const apiErrEn = formatSupabaseErrorMessage(
    { message: 'new row violates row-level security policy' },
    'en',
    true
  );
  const apiErrId = formatSupabaseErrorMessage(
    { message: 'network timeout' },
    'id',
    true
  );
  assert.ok(apiErrEn.includes('row-level security'));
  assert.ok(apiErrId.includes('network timeout'));
});

test('mapOrderFormToPayload includes client-generated id when provided', () => {
  const orderId = '11111111-2222-4333-8444-555555555555';
  const payload = mapOrderFormToPayload(VALID_ORDER, orderId);
  assert.equal(payload.id, orderId);
  assert.equal(payload.customer_name, 'Nadia Pratama');
});

test('extractFileExtension, buildOrderAttachmentPath, and mapOrderAttachmentToPayload format storage paths & metadata', () => {
  assert.equal(extractFileExtension('Moodboard.Final.PDF'), 'pdf');
  assert.equal(extractFileExtension('README'), '');
  assert.equal(extractFileExtension('.hidden'), '');

  const orderId = '11111111-2222-4333-8444-555555555555';
  const fileUuid = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
  const storagePath = buildOrderAttachmentPath(orderId, fileUuid, 'Reference.PNG');
  assert.equal(storagePath, `${orderId}/${fileUuid}.png`);

  assert.throws(() =>
    buildOrderAttachmentPath(orderId, fileUuid, 'malicious.exe')
  );

  const meta = mapOrderAttachmentToPayload(orderId, storagePath, {
    name: 'Reference.PNG',
    type: '',
    size: 4096,
  });
  assert.deepEqual(meta, {
    order_id: orderId,
    bucket_id: 'order-references',
    storage_path: storagePath,
    original_filename: 'Reference.PNG',
    mime_type: 'application/octet-stream',
    file_size: 4096,
    file_ext: 'png',
  });
});
