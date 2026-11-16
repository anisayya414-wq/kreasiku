import { createClient, type Session, type SupabaseClient } from '@supabase/supabase-js';
import type {
  AdminContactMessageRecord,
  AdminOrderRecord,
  AdminOrderWithAttachments,
  ContactFormData,
  Language,
  OrderAttachmentRecord,
  OrderFormData,
  OrderStatus,
  SiteContentConfig,
} from '../types/studio';
import {
  buildOrderAttachmentPath,
  formatSupabaseErrorMessage,
  mapContactFormToPayload,
  mapOrderAttachmentToPayload,
  mapOrderFormToPayload,
  ORDER_REFERENCES_BUCKET,
  validateAttachment,
} from '../utils/studioLogic';
import {
  attachFilesToOrders,
  isAdminUser,
  isValidOrderStatus,
} from '../utils/adminLogic';
import {
  buildSiteAssetPath,
  mergeSiteContentConfig,
  SITE_ASSETS_BUCKET,
  validateSiteImageFile,
} from '../utils/siteConfigLogic';

function readEnvString(key: 'VITE_SUPABASE_URL' | 'VITE_SUPABASE_ANON_KEY'): string {
  if (typeof import.meta === 'undefined' || !import.meta.env) {
    return '';
  }
  const raw = import.meta.env[key];
  if (typeof raw !== 'string') {
    return '';
  }
  const trimmed = raw.trim();
  if (!trimmed || trimmed === 'undefined' || trimmed === 'null') {
    return '';
  }
  return trimmed;
}

const supabaseUrl = readEnvString('VITE_SUPABASE_URL');
const supabaseAnonKey = readEnvString('VITE_SUPABASE_ANON_KEY');

function isValidHttpUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export function isSupabaseConfigured(): boolean {
  return isValidHttpUrl(supabaseUrl) && Boolean(supabaseAnonKey);
}

function initSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  try {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
  } catch {
    return null;
  }
}

export const supabase: SupabaseClient | null = initSupabaseClient();

export type SubmissionResult =
  | { ok: true; orderId?: string }
  | { ok: false; error: string };

export async function submitOrderToSupabase(
  data: OrderFormData,
  lang: Language,
  attachmentFile?: File | null
): Promise<SubmissionResult> {
  if (!supabase) {
    return {
      ok: false,
      error: formatSupabaseErrorMessage(null, lang, false),
    };
  }

  if (attachmentFile) {
    const attachmentValidation = validateAttachment(
      attachmentFile.name,
      attachmentFile.size,
      lang
    );
    if (attachmentValidation) {
      return { ok: false, error: attachmentValidation };
    }
  }

  const orderId = crypto.randomUUID();
  const payload = mapOrderFormToPayload(data, orderId);

  try {
    const { error: orderError } = await supabase.from('orders').insert([payload]);
    if (orderError) {
      return {
        ok: false,
        error: formatSupabaseErrorMessage(orderError, lang, true),
      };
    }

    if (attachmentFile) {
      const fileUuid = crypto.randomUUID();
      const storagePath = buildOrderAttachmentPath(
        orderId,
        fileUuid,
        attachmentFile.name
      );

      const { error: uploadError } = await supabase.storage
        .from(ORDER_REFERENCES_BUCKET)
        .upload(storagePath, attachmentFile, {
          contentType: attachmentFile.type || 'application/octet-stream',
          upsert: false,
        });

      if (uploadError) {
        return {
          ok: false,
          error:
            lang === 'id'
              ? `Pesanan tercatat, namun gagal mengunggah file referensi: ${uploadError.message}`
              : `Order was recorded, but uploading the reference file failed: ${uploadError.message}`,
        };
      }

      const attachmentPayload = mapOrderAttachmentToPayload(
        orderId,
        storagePath,
        attachmentFile
      );

      const { error: metadataError } = await supabase
        .from('order_attachments')
        .insert([attachmentPayload]);

      if (metadataError) {
        return {
          ok: false,
          error:
            lang === 'id'
              ? `File terunggah, namun gagal menyimpan metadata lampiran: ${metadataError.message}`
              : `File uploaded, but saving attachment metadata failed: ${metadataError.message}`,
        };
      }
    }

    return { ok: true, orderId };
  } catch (err) {
    return {
      ok: false,
      error: formatSupabaseErrorMessage(err, lang, true),
    };
  }
}

export async function submitContactToSupabase(
  data: ContactFormData,
  lang: Language
): Promise<SubmissionResult> {
  if (!supabase) {
    return {
      ok: false,
      error: formatSupabaseErrorMessage(null, lang, false),
    };
  }

  const payload = mapContactFormToPayload(data);

  try {
    const { error } = await supabase
      .from('contact_messages')
      .insert([payload]);
    if (error) {
      return {
        ok: false,
        error: formatSupabaseErrorMessage(error, lang, true),
      };
    }
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: formatSupabaseErrorMessage(err, lang, true),
    };
  }
}

export type AdminActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; error: string };

async function requireAdminSession(
  lang: Language
): Promise<{ ok: true; session: Session } | { ok: false; error: string }> {
  if (!supabase) {
    return {
      ok: false,
      error: formatSupabaseErrorMessage(null, lang, false),
    };
  }
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    return {
      ok: false,
      error:
        lang === 'id'
          ? 'Sesi admin tidak ditemukan. Silakan masuk kembali.'
          : 'No active admin session. Please sign in again.',
    };
  }
  if (!isAdminUser(data.session.user)) {
    return {
      ok: false,
      error:
        lang === 'id'
          ? 'Akses ditolak: akun Anda tidak memiliki peran admin.'
          : 'Access denied: your account does not have the admin role.',
    };
  }
  return { ok: true, session: data.session };
}

export async function signInAdmin(
  email: string,
  password: string,
  lang: Language
): Promise<AdminActionResult<Session>> {
  if (!supabase) {
    return {
      ok: false,
      error: formatSupabaseErrorMessage(null, lang, false),
    };
  }
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error || !data.session || !data.user) {
      return {
        ok: false,
        error:
          error?.message ||
          (lang === 'id'
            ? 'Email atau kata sandi tidak valid.'
            : 'Invalid email or password.'),
      };
    }

    if (!isAdminUser(data.user)) {
      await supabase.auth.signOut();
      return {
        ok: false,
        error:
          lang === 'id'
            ? 'Akses ditolak: akun ini tidak memiliki role admin yang berwenang.'
            : 'Access denied: this account does not have the authorized admin role.',
      };
    }

    return { ok: true, data: data.session };
  } catch (err) {
    return {
      ok: false,
      error: formatSupabaseErrorMessage(err, lang, true),
    };
  }
}

export async function signOutAdmin(): Promise<void> {
  if (!supabase) {
    return;
  }
  await supabase.auth.signOut();
}

export interface AdminDashboardPayload {
  orders: AdminOrderWithAttachments[];
  messages: AdminContactMessageRecord[];
}

export async function fetchAdminDashboardData(
  lang: Language
): Promise<AdminActionResult<AdminDashboardPayload>> {
  const gate = await requireAdminSession(lang);
  if (!gate.ok || !supabase) {
    return { ok: false, error: gate.ok ? 'Not configured' : gate.error };
  }

  try {
    const [ordersRes, attachmentsRes, messagesRes] = await Promise.all([
      supabase
        .from('orders')
        .select(
          'id, customer_name, email, whatsapp, service, project_title, description, preferences, deadline, budget, notes, status, created_at'
        )
        .order('created_at', { ascending: false }),
      supabase
        .from('order_attachments')
        .select(
          'id, order_id, bucket_id, storage_path, original_filename, mime_type, file_size, file_ext, created_at'
        )
        .order('created_at', { ascending: true }),
      supabase
        .from('contact_messages')
        .select('id, name, email, message, created_at')
        .order('created_at', { ascending: false }),
    ]);

    if (ordersRes.error) {
      return {
        ok: false,
        error: formatSupabaseErrorMessage(ordersRes.error, lang, true),
      };
    }
    if (attachmentsRes.error) {
      return {
        ok: false,
        error: formatSupabaseErrorMessage(attachmentsRes.error, lang, true),
      };
    }
    if (messagesRes.error) {
      return {
        ok: false,
        error: formatSupabaseErrorMessage(messagesRes.error, lang, true),
      };
    }

    const orders = (ordersRes.data ?? []) as AdminOrderRecord[];
    const attachments = (attachmentsRes.data ?? []) as OrderAttachmentRecord[];
    const messages = (messagesRes.data ?? []) as AdminContactMessageRecord[];

    return {
      ok: true,
      data: {
        orders: attachFilesToOrders(orders, attachments),
        messages,
      },
    };
  } catch (err) {
    return {
      ok: false,
      error: formatSupabaseErrorMessage(err, lang, true),
    };
  }
}

export async function updateOrderStatusAsAdmin(
  orderId: string,
  nextStatus: OrderStatus,
  lang: Language
): Promise<AdminActionResult<{ id: string; status: OrderStatus }>> {
  const gate = await requireAdminSession(lang);
  if (!gate.ok || !supabase) {
    return { ok: false, error: gate.ok ? 'Not configured' : gate.error };
  }
  if (!isValidOrderStatus(nextStatus)) {
    return {
      ok: false,
      error:
        lang === 'id' ? 'Status pesanan tidak valid.' : 'Invalid order status.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status: nextStatus })
      .eq('id', orderId)
      .select('id, status')
      .single();

    if (error || !data) {
      return {
        ok: false,
        error: formatSupabaseErrorMessage(
          error ??
            new Error(
              lang === 'id'
                ? 'Pembaruan ditolak oleh kebijakan keamanan atau pesanan tidak ditemukan.'
                : 'Update rejected by security policy or order not found.'
            ),
          lang,
          true
        ),
      };
    }

    return {
      ok: true,
      data: { id: data.id as string, status: data.status as OrderStatus },
    };
  } catch (err) {
    return {
      ok: false,
      error: formatSupabaseErrorMessage(err, lang, true),
    };
  }
}

export async function createAttachmentSignedUrl(
  storagePath: string,
  lang: Language,
  expiresInSeconds = 120
): Promise<AdminActionResult<string>> {
  const gate = await requireAdminSession(lang);
  if (!gate.ok || !supabase) {
    return { ok: false, error: gate.ok ? 'Not configured' : gate.error };
  }

  try {
    const { data, error } = await supabase.storage
      .from(ORDER_REFERENCES_BUCKET)
      .createSignedUrl(storagePath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      return {
        ok: false,
        error: formatSupabaseErrorMessage(error, lang, true),
      };
    }

    return { ok: true, data: data.signedUrl };
  } catch (err) {
    return {
      ok: false,
      error: formatSupabaseErrorMessage(err, lang, true),
    };
  }
}

export async function fetchPublicSiteConfig(): Promise<SiteContentConfig | null> {
  if (!supabase) {
    return null;
  }
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('config')
      .eq('id', 'default')
      .maybeSingle();

    if (error || !data || !data.config) {
      return null;
    }

    return mergeSiteContentConfig(data.config);
  } catch {
    return null;
  }
}

export async function saveSiteContentConfig(
  config: SiteContentConfig,
  lang: Language
): Promise<AdminActionResult<SiteContentConfig>> {
  const gate = await requireAdminSession(lang);
  if (!gate.ok || !supabase) {
    return { ok: false, error: gate.ok ? 'Not configured' : gate.error };
  }

  const normalized = mergeSiteContentConfig(config);

  try {
    const { error } = await supabase.from('site_settings').upsert(
      {
        id: 'default',
        config: normalized,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      return {
        ok: false,
        error: formatSupabaseErrorMessage(error, lang, true),
      };
    }

    return { ok: true, data: normalized };
  } catch (err) {
    return {
      ok: false,
      error: formatSupabaseErrorMessage(err, lang, true),
    };
  }
}

export async function uploadSiteAssetImage(
  folder: 'hero' | 'team' | 'portfolio',
  file: File,
  lang: Language
): Promise<AdminActionResult<string>> {
  const gate = await requireAdminSession(lang);
  if (!gate.ok || !supabase) {
    return { ok: false, error: gate.ok ? 'Not configured' : gate.error };
  }

  const validationError = validateSiteImageFile(file.name, file.size, lang);
  if (validationError) {
    return { ok: false, error: validationError };
  }

  try {
    const storagePath = buildSiteAssetPath(
      folder,
      crypto.randomUUID(),
      file.name
    );

    const { error: uploadError } = await supabase.storage
      .from(SITE_ASSETS_BUCKET)
      .upload(storagePath, file, {
        contentType: file.type || 'image/png',
        upsert: false,
      });

    if (uploadError) {
      return {
        ok: false,
        error: formatSupabaseErrorMessage(uploadError, lang, true),
      };
    }

    const { data: publicUrlData } = supabase.storage
      .from(SITE_ASSETS_BUCKET)
      .getPublicUrl(storagePath);

    if (!publicUrlData?.publicUrl) {
      return {
        ok: false,
        error:
          lang === 'id'
            ? 'Gambar terunggah, namun gagal mendapatkan URL publik.'
            : 'Image uploaded, but could not generate public URL.',
      };
    }

    return { ok: true, data: publicUrlData.publicUrl };
  } catch (err) {
    return {
      ok: false,
      error: formatSupabaseErrorMessage(err, lang, true),
    };
  }
}
