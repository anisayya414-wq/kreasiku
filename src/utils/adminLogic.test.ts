import test from 'node:test';
import assert from 'node:assert/strict';
import {
  attachFilesToOrders,
  computeOrderStatusCounts,
  filterAdminOrders,
  filterContactMessages,
  formatWhatsAppHref,
  isAdminRoute,
  isAdminUser,
  isPreviewableImageExt,
  isValidOrderStatus,
  normalizeOrderStatus,
} from './adminLogic';
import type {
  AdminContactMessageRecord,
  AdminOrderRecord,
  OrderAttachmentRecord,
} from '../types/studio';

const SAMPLE_ORDERS: AdminOrderRecord[] = [
  {
    id: 'ord-1',
    customer_name: 'Nadia Pratama',
    email: 'nadia@example.com',
    whatsapp: '0812-3456-7890',
    service: 'poster-design',
    project_title: 'Indie Music Poster',
    description: 'Warm retro concert poster.',
    preferences: 'Dusty pink',
    deadline: '2026-12-01',
    budget: 'Standard',
    notes: null,
    status: 'Pending',
    created_at: '2026-11-12T10:00:00Z',
  },
  {
    id: 'ord-2',
    customer_name: 'Bima Santoso',
    email: 'bima@brand.id',
    whatsapp: '+62 813-9999-0000',
    service: 'video-editing',
    project_title: 'Launch Teaser Reel',
    description: 'Vertical motion edit.',
    preferences: null,
    deadline: '2026-12-05',
    budget: 'Studio Pack',
    notes: 'Include captions',
    status: 'In Progress',
    created_at: '2026-11-12T12:00:00Z',
  },
  {
    id: 'ord-3',
    customer_name: 'Clara Wijaya',
    email: 'clara@zine.org',
    whatsapp: '+62 811-2222-3333',
    service: 'digital-illustration',
    project_title: 'Sticker Pack Flora',
    description: '8 botanical die-cut stickers.',
    preferences: null,
    deadline: '2026-12-10',
    budget: 'Starter',
    notes: null,
    status: 'Completed',
    created_at: '2026-11-11T09:00:00Z',
  },
];

const SAMPLE_ATTACHMENTS: OrderAttachmentRecord[] = [
  {
    id: 'att-1',
    order_id: 'ord-1',
    bucket_id: 'order-references',
    storage_path: 'ord-1/file-1.png',
    original_filename: 'moodboard.png',
    mime_type: 'image/png',
    file_size: 20480,
    file_ext: 'png',
    created_at: '2026-11-12T10:01:00Z',
  },
];

test('isAdminRoute recognizes /admin and #/admin without matching public paths', () => {
  assert.equal(isAdminRoute('/admin', ''), true);
  assert.equal(isAdminRoute('/admin/', ''), true);
  assert.equal(isAdminRoute('/', '#/admin'), true);
  assert.equal(isAdminRoute('/', '#/admin/orders'), true);
  assert.equal(isAdminRoute('/', ''), false);
  assert.equal(isAdminRoute('/', '#order'), false);
  assert.equal(isAdminRoute('/portfolio', '#about'), false);
});

test('isAdminUser strictly requires app_metadata.role === admin and rejects user_metadata spoofing', () => {
  assert.equal(isAdminUser(null), false);
  assert.equal(isAdminUser(undefined), false);
  assert.equal(isAdminUser({ id: 'u1', app_metadata: {} }), false);
  assert.equal(
    isAdminUser({ id: 'u2', app_metadata: { role: 'customer' } }),
    false
  );
  assert.equal(
    isAdminUser({ id: 'u3', user_metadata: { role: 'admin' }, app_metadata: {} }),
    false
  );
  assert.equal(
    isAdminUser({ id: 'u4', app_metadata: { role: 'admin' } }),
    true
  );
});

test('status validation and counts compute exact totals across all 5 statuses', () => {
  assert.equal(isValidOrderStatus('Pending'), true);
  assert.equal(isValidOrderStatus('In Review'), true);
  assert.equal(isValidOrderStatus('In Progress'), true);
  assert.equal(isValidOrderStatus('Completed'), true);
  assert.equal(isValidOrderStatus('Cancelled'), true);
  assert.equal(isValidOrderStatus('Unknown'), false);

  assert.equal(normalizeOrderStatus('in_review'), 'In Review');
  assert.equal(normalizeOrderStatus('unknown'), 'Pending');

  const counts = computeOrderStatusCounts(SAMPLE_ORDERS);
  assert.deepEqual(counts, {
    total: 3,
    Pending: 1,
    'In Review': 0,
    'In Progress': 1,
    Completed: 1,
    Cancelled: 0,
  });
});

test('attachFilesToOrders and filterAdminOrders link attachments and filter by status and search query', () => {
  const joined = attachFilesToOrders(SAMPLE_ORDERS, SAMPLE_ATTACHMENTS);
  assert.equal(joined[0].attachments.length, 1);
  assert.equal(joined[1].attachments.length, 0);

  assert.equal(filterAdminOrders(joined, 'ALL', '').length, 3);
  assert.equal(filterAdminOrders(joined, 'In Progress', '').length, 1);
  assert.equal(filterAdminOrders(joined, 'ALL', 'nadia').length, 1);
  assert.equal(filterAdminOrders(joined, 'Completed', 'flora').length, 1);
  assert.equal(filterAdminOrders(joined, 'Pending', 'flora').length, 0);
});

test('filterContactMessages, formatWhatsAppHref, and isPreviewableImageExt behave cleanly', () => {
  const msgs: AdminContactMessageRecord[] = [
    {
      id: 'm1',
      name: 'Raka',
      email: 'raka@studio.id',
      message: '[Poster inquiry] Need 3 posters',
      created_at: '2026-11-12T08:00:00Z',
    },
    {
      id: 'm2',
      name: 'Sinta',
      email: 'sinta@cafe.com',
      message: 'Menu illustration quote',
      created_at: '2026-11-12T09:00:00Z',
    },
  ];
  assert.equal(filterContactMessages(msgs, '').length, 2);
  assert.equal(filterContactMessages(msgs, 'poster').length, 1);
  assert.equal(filterContactMessages(msgs, 'sinta@cafe').length, 1);

  assert.equal(formatWhatsAppHref('0812-3456-7890'), 'https://wa.me/6281234567890');
  assert.equal(formatWhatsAppHref('+62 813-9999-0000'), 'https://wa.me/6281399990000');

  assert.equal(isPreviewableImageExt('PNG'), true);
  assert.equal(isPreviewableImageExt('.webp'), true);
  assert.equal(isPreviewableImageExt('pdf'), false);
  assert.equal(isPreviewableImageExt('zip'), false);
});
