import {
  ORDER_STATUSES,
  type AdminContactMessageRecord,
  type AdminOrderRecord,
  type AdminOrderWithAttachments,
  type Language,
  type OrderAttachmentRecord,
  type OrderStatus,
  type OrderStatusCounts,
} from '../types/studio';

export interface AuthUserLike {
  id?: string;
  email?: string | null;
  app_metadata?: Record<string, unknown> | null;
  user_metadata?: Record<string, unknown> | null;
}

export function isAdminRoute(pathname: string, hash: string): boolean {
  const cleanPath = pathname.replace(/\/+$/, '').toLowerCase();
  const cleanHash = hash.toLowerCase();
  return (
    cleanPath === '/admin' ||
    cleanPath.endsWith('/admin') ||
    cleanHash === '#/admin' ||
    cleanHash.startsWith('#/admin/') ||
    cleanHash.startsWith('#/admin?')
  );
}

/**
 * Strictly checks `app_metadata.role === 'admin'`.
 * Never trusts `user_metadata` (which end users can modify) or mere authentication.
 */
export function isAdminUser(user: AuthUserLike | null | undefined): boolean {
  if (!user || !user.app_metadata || typeof user.app_metadata !== 'object') {
    return false;
  }
  return user.app_metadata.role === 'admin';
}

export function isValidOrderStatus(value: string): value is OrderStatus {
  return (ORDER_STATUSES as readonly string[]).includes(value);
}

export function normalizeOrderStatus(value: unknown): OrderStatus {
  if (typeof value !== 'string') {
    return 'Pending';
  }
  const trimmed = value.trim();
  if (isValidOrderStatus(trimmed)) {
    return trimmed;
  }
  const lower = trimmed.toLowerCase();
  if (lower === 'in review' || lower === 'in_review') return 'In Review';
  if (lower === 'in progress' || lower === 'in_progress') return 'In Progress';
  if (lower === 'completed' || lower === 'done') return 'Completed';
  if (lower === 'cancelled' || lower === 'canceled') return 'Cancelled';
  return 'Pending';
}

export function attachFilesToOrders(
  orders: AdminOrderRecord[],
  attachments: OrderAttachmentRecord[]
): AdminOrderWithAttachments[] {
  const byOrder = new Map<string, OrderAttachmentRecord[]>();
  for (const att of attachments) {
    const existing = byOrder.get(att.order_id);
    if (existing) {
      existing.push(att);
    } else {
      byOrder.set(att.order_id, [att]);
    }
  }
  return orders.map((order) => ({
    ...order,
    status: normalizeOrderStatus(order.status),
    attachments: byOrder.get(order.id) ?? [],
  }));
}

export function computeOrderStatusCounts(
  orders: ReadonlyArray<Pick<AdminOrderRecord, 'status'>>
): OrderStatusCounts {
  const counts: OrderStatusCounts = {
    total: orders.length,
    Pending: 0,
    'In Review': 0,
    'In Progress': 0,
    Completed: 0,
    Cancelled: 0,
  };

  for (const order of orders) {
    const normalized = normalizeOrderStatus(order.status);
    counts[normalized] += 1;
  }

  return counts;
}

export function filterAdminOrders(
  orders: AdminOrderWithAttachments[],
  statusFilter: OrderStatus | 'ALL',
  searchQuery: string
): AdminOrderWithAttachments[] {
  const q = searchQuery.trim().toLowerCase();
  return orders.filter((order) => {
    if (statusFilter !== 'ALL' && order.status !== statusFilter) {
      return false;
    }
    if (!q) {
      return true;
    }
    return (
      order.customer_name.toLowerCase().includes(q) ||
      order.email.toLowerCase().includes(q) ||
      order.project_title.toLowerCase().includes(q) ||
      order.service.toLowerCase().includes(q) ||
      order.whatsapp.toLowerCase().includes(q) ||
      order.id.toLowerCase().includes(q)
    );
  });
}

export function filterContactMessages(
  messages: AdminContactMessageRecord[],
  searchQuery: string
): AdminContactMessageRecord[] {
  const q = searchQuery.trim().toLowerCase();
  if (!q) {
    return messages;
  }
  return messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(q) ||
      msg.email.toLowerCase().includes(q) ||
      msg.message.toLowerCase().includes(q)
  );
}

export function formatAdminDate(isoString: string, lang: Language): string {
  if (!isoString) {
    return '-';
  }
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  return new Intl.DateTimeFormat(lang === 'id' ? 'id-ID' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatWhatsAppHref(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, '');
  if (!digits) {
    return '#';
  }
  const normalized = digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
  return `https://wa.me/${normalized}`;
}

export function isPreviewableImageExt(fileExt: string): boolean {
  const ext = fileExt.trim().toLowerCase().replace(/^\./, '');
  return ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(ext);
}
