import { createHash } from 'node:crypto';

export function stripHtml(value: string) {
  return value.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
}
export function normalize(value: string) { return value.toLowerCase().replace(/[^a-z0-9+#.]+/g, ' ').replace(/\s+/g, ' ').trim(); }
export function fingerprint(...parts: string[]) { return createHash('sha256').update(parts.map(normalize).join('|')).digest('hex'); }
export function tokens(value: string) { return new Set(normalize(value).split(' ').filter(x => x.length > 1)); }
