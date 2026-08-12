/**
 * TikTok Pixel helper utility with SHA-256 client-side PII hashing.
 */

/**
 * Client-side SHA-256 hash generator using standard Web Crypto API.
 */
export async function hashSHA256(value: string): Promise<string> {
  if (!value) return '';
  const normalized = value.trim().toLowerCase();
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(normalized);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {
    console.warn('Crypto subtle SHA-256 error:', e);
  }
  return normalized;
}

export interface TikTokPIIData {
  email?: string;
  phone_number?: string;
  external_id?: string;
}

/**
 * Identifies the user on TikTok Pixel with SHA-256 hashed PII data.
 */
export async function identifyTikTokUser(data: TikTokPIIData): Promise<void> {
  if (typeof window === 'undefined') return;
  const ttq = (window as Record<string, unknown>).ttq as {
    identify: (params: Record<string, string>) => void;
  } | undefined;

  if (!ttq || typeof ttq.identify !== 'function') return;

  try {
    const hashedEmail = data.email ? await hashSHA256(data.email) : '';
    const hashedPhone = data.phone_number ? await hashSHA256(data.phone_number) : '';
    const hashedExternalId = data.external_id
      ? await hashSHA256(data.external_id)
      : (hashedEmail || hashedPhone);

    const payload: Record<string, string> = {};
    if (hashedEmail) payload.email = hashedEmail;
    if (hashedPhone) payload.phone_number = hashedPhone;
    if (hashedExternalId) payload.external_id = hashedExternalId;

    if (Object.keys(payload).length > 0) {
      ttq.identify(payload);
    }
  } catch (err) {
    console.warn('TikTok identify error:', err);
  }
}

export interface TikTokContentItem {
  content_id?: string;
  content_type?: string;
  content_name?: string;
}

export interface TikTokEventParams {
  contents?: TikTokContentItem[];
  value?: number;
  currency?: string;
  search_string?: string;
  query?: string;
  [key: string]: unknown;
}

/**
 * Tracks a standard or custom event on TikTok Pixel.
 */
export function trackTikTokEvent(eventName: string, params?: TikTokEventParams): void {
  if (typeof window === 'undefined') return;
  const ttq = (window as Record<string, unknown>).ttq as {
    track: (event: string, params?: Record<string, unknown>) => void;
  } | undefined;

  if (!ttq || typeof ttq.track !== 'function') return;

  try {
    ttq.track(eventName, params);
  } catch (err) {
    console.warn(`TikTok track event '${eventName}' error:`, err);
  }
}
