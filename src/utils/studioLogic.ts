import type {
  ContactFormData,
  ContactFormErrors,
  ContactMessageInsertPayload,
  Language,
  OrderAttachmentInsertPayload,
  OrderFormData,
  OrderFormErrors,
  OrderInsertPayload,
  PortfolioCategory,
  PortfolioItem,
} from '../types/studio';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const WHATSAPP_REGEX = /^\+?[0-9\s\-()]{8,20}$/;

export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024; // 10 MB

export const ALLOWED_ATTACHMENT_EXTENSIONS = [
  '.pdf',
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.svg',
  '.zip',
  '.fig',
  '.ai',
  '.psd',
];

export function filterPortfolioItems(
  items: PortfolioItem[],
  category: PortfolioCategory
): PortfolioItem[] {
  if (category === 'all') {
    return items;
  }
  return items.filter((item) => item.category === category);
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 KB';
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function validateAttachment(
  fileName: string,
  fileSize: number,
  lang: Language
): string | null {
  if (!fileName) {
    return null;
  }
  const lower = fileName.toLowerCase();
  const hasAllowedExtension = ALLOWED_ATTACHMENT_EXTENSIONS.some((ext) =>
    lower.endsWith(ext)
  );
  if (!hasAllowedExtension) {
    return lang === 'id'
      ? 'Format file harus berupa PDF, PNG, JPG, WEBP, SVG, ZIP, FIG, AI, atau PSD.'
      : 'File format must be PDF, PNG, JPG, WEBP, SVG, ZIP, FIG, AI, or PSD.';
  }
  if (fileSize > MAX_ATTACHMENT_BYTES) {
    return lang === 'id'
      ? 'Ukuran file maksimal 10 MB.'
      : 'Maximum file size is 10 MB.';
  }
  return null;
}

export function validateOrderForm(
  data: OrderFormData,
  lang: Language
): OrderFormErrors {
  const errors: OrderFormErrors = {};
  const isId = lang === 'id';

  if (!data.fullName.trim() || data.fullName.trim().length < 2) {
    errors.fullName = isId
      ? 'Nama lengkap wajib diisi (minimal 2 karakter).'
      : 'Full name is required (at least 2 characters).';
  }

  if (!data.email.trim()) {
    errors.email = isId
      ? 'Alamat email wajib diisi.'
      : 'Email address is required.';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = isId
      ? 'Masukkan format alamat email yang valid.'
      : 'Please enter a valid email address.';
  }

  if (!data.whatsapp.trim()) {
    errors.whatsapp = isId
      ? 'Nomor WhatsApp wajib diisi.'
      : 'WhatsApp number is required.';
  } else {
    const digitsOnly = data.whatsapp.replace(/\D/g, '');
    if (!WHATSAPP_REGEX.test(data.whatsapp.trim()) || digitsOnly.length < 8) {
      errors.whatsapp = isId
        ? 'Masukkan nomor WhatsApp yang valid (minimal 8 digit).'
        : 'Please enter a valid WhatsApp number (at least 8 digits).';
    }
  }

  if (!data.serviceCategory) {
    errors.serviceCategory = isId
      ? 'Pilih salah satu kategori layanan.'
      : 'Please select a service category.';
  }

  if (!data.projectTitle.trim() || data.projectTitle.trim().length < 3) {
    errors.projectTitle = isId
      ? 'Judul proyek wajib diisi (minimal 3 karakter).'
      : 'Project title is required (at least 3 characters).';
  }

  if (!data.description.trim() || data.description.trim().length < 15) {
    errors.description = isId
      ? 'Mohon jelaskan detail proyek minimal 15 karakter.'
      : 'Please describe your project in at least 15 characters.';
  }

  if (!data.deadline.trim()) {
    errors.deadline = isId
      ? 'Target tenggat waktu wajib dipilih.'
      : 'Target deadline is required.';
  }

  if (!data.budget.trim()) {
    errors.budget = isId
      ? 'Pilih atau isi estimasi anggaran.'
      : 'Please specify an estimated budget.';
  }

  if (data.attachmentName) {
    const fileErr = validateAttachment(
      data.attachmentName,
      data.attachmentSize,
      lang
    );
    if (fileErr) {
      errors.attachmentName = fileErr;
    }
  }

  return errors;
}

export function validateContactForm(
  data: ContactFormData,
  lang: Language
): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const isId = lang === 'id';

  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = isId
      ? 'Nama pengirim wajib diisi.'
      : 'Your name is required.';
  }

  if (!data.email.trim()) {
    errors.email = isId
      ? 'Alamat email wajib diisi.'
      : 'Email address is required.';
  } else if (!EMAIL_REGEX.test(data.email.trim())) {
    errors.email = isId
      ? 'Format email tidak valid.'
      : 'Please enter a valid email address.';
  }

  if (!data.subject.trim() || data.subject.trim().length < 3) {
    errors.subject = isId
      ? 'Subjek pesan wajib diisi.'
      : 'Subject is required.';
  }

  if (!data.message.trim() || data.message.trim().length < 10) {
    errors.message = isId
      ? 'Tuliskan pesan minimal 10 karakter.'
      : 'Message must be at least 10 characters.';
  }

  return errors;
}

export function hasErrors<T extends Record<string, string | undefined>>(
  errors: T
): boolean {
  return Object.values(errors).some((val) => Boolean(val));
}

export function wrapSlideIndex(index: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return ((index % total) + total) % total;
}

export function stepSlideIndex(
  current: number,
  delta: number,
  total: number
): number {
  return wrapSlideIndex(current + delta, total);
}

export function mapOrderFormToPayload(
  data: OrderFormData,
  orderId?: string
): OrderInsertPayload {
  const payload: OrderInsertPayload = {
    customer_name: data.fullName.trim(),
    email: data.email.trim(),
    whatsapp: data.whatsapp.trim(),
    service: data.serviceCategory,
    project_title: data.projectTitle.trim(),
    description: data.description.trim(),
    preferences: data.preferences.trim() || null,
    deadline: data.deadline.trim(),
    budget: data.budget.trim(),
    notes: data.notes.trim() || null,
  };
  if (orderId) {
    payload.id = orderId;
  }
  return payload;
}

export const ORDER_REFERENCES_BUCKET = 'order-references' as const;

export function extractFileExtension(fileName: string): string {
  const trimmed = fileName.trim();
  const lastDot = trimmed.lastIndexOf('.');
  if (lastDot <= 0 || lastDot === trimmed.length - 1) {
    return '';
  }
  return trimmed.slice(lastDot + 1).toLowerCase();
}

export function buildOrderAttachmentPath(
  orderId: string,
  fileUuid: string,
  fileName: string
): string {
  const ext = extractFileExtension(fileName);
  if (!ext || !ALLOWED_ATTACHMENT_EXTENSIONS.includes(`.${ext}`)) {
    throw new Error(`Unsupported attachment extension for file: ${fileName}`);
  }
  return `${orderId}/${fileUuid}.${ext}`;
}

export function mapOrderAttachmentToPayload(
  orderId: string,
  storagePath: string,
  file: { name: string; type: string; size: number }
): OrderAttachmentInsertPayload {
  const ext = extractFileExtension(file.name);
  return {
    order_id: orderId,
    bucket_id: ORDER_REFERENCES_BUCKET,
    storage_path: storagePath,
    original_filename: file.name,
    mime_type: file.type.trim() || 'application/octet-stream',
    file_size: file.size,
    file_ext: ext,
  };
}

export function mapContactFormToPayload(
  data: ContactFormData
): ContactMessageInsertPayload {
  const trimmedSubject = data.subject.trim();
  const trimmedMessage = data.message.trim();
  return {
    name: data.name.trim(),
    email: data.email.trim(),
    message: trimmedSubject
      ? `[${trimmedSubject}] ${trimmedMessage}`
      : trimmedMessage,
  };
}

export function formatSupabaseErrorMessage(
  error: unknown,
  lang: Language,
  isConfigured: boolean
): string {
  const isId = lang === 'id';

  if (!isConfigured) {
    return isId
      ? 'Konfigurasi Supabase belum aktif (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY belum diatur). Pengiriman tidak dapat disimpan.'
      : 'Supabase is not configured yet (missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY). Submission could not be saved.';
  }

  let detail = '';
  if (typeof error === 'string') {
    detail = error;
  } else if (
    error &&
    typeof error === 'object' &&
    'message' in error &&
    typeof (error as { message: unknown }).message === 'string'
  ) {
    detail = (error as { message: string }).message;
  }

  if (detail) {
    return isId
      ? `Gagal mengirim data ke server: ${detail}. Silakan coba lagi.`
      : `Failed to save submission: ${detail}. Please try again.`;
  }

  return isId
    ? 'Terjadi kesalahan saat mengirim data ke server. Silakan periksa koneksi Anda dan coba lagi.'
    : 'An unexpected error occurred while saving your submission. Please check your connection and try again.';
}
