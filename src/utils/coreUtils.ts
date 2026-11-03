import * as crypto from 'crypto';

/**
 * Base64 Encoding & Decoding
 */
export function base64Encode(input: string): string {
  return Buffer.from(input, 'utf-8').toString('base64');
}

export function base64Decode(input: string): string {
  return Buffer.from(input, 'base64').toString('utf-8');
}

/**
 * URL Encoding & Decoding
 */
export function urlEncode(input: string): string {
  return encodeURIComponent(input);
}

export function urlDecode(input: string): string {
  return decodeURIComponent(input);
}

/**
 * HTML Entities Encoding & Decoding
 */
export function htmlEncode(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function htmlDecode(input: string): string {
  const map: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'"
  };
  return input.replace(/&(?:amp|lt|gt|quot|#39|apos);/g, (match) => map[match] || match);
}

/**
 * JSON Formatting and Minification
 */
export function formatJson(input: string, indent: number = 2): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indent);
}

export function minifyJson(input: string): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed);
}

/**
 * JWT Decoder (Offline, zero network, parses header and payload)
 */
export interface DecodedJwt {
  header: Record<string, any>;
  payload: Record<string, any>;
  isExpired?: boolean;
  expiresAt?: string;
  issuedAt?: string;
}

export function decodeJwt(token: string): DecodedJwt {
  const parts = token.trim().split('.');
  if (parts.length < 2) {
    throw new Error('Invalid JWT token format: Must contain at least header and payload segments.');
  }

  const decodeSegment = (segment: string) => {
    let base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4 !== 0) {
      base64 += '=';
    }
    const jsonStr = Buffer.from(base64, 'base64').toString('utf-8');
    return JSON.parse(jsonStr);
  };

  const header = decodeSegment(parts[0]);
  const payload = decodeSegment(parts[1]);

  let isExpired: boolean | undefined;
  let expiresAt: string | undefined;
  let issuedAt: string | undefined;

  if (payload.exp && typeof payload.exp === 'number') {
    const expDate = new Date(payload.exp * 1000);
    expiresAt = expDate.toISOString();
    isExpired = Date.now() >= expDate.getTime();
  }

  if (payload.iat && typeof payload.iat === 'number') {
    issuedAt = new Date(payload.iat * 1000).toISOString();
  }

  return { header, payload, isExpired, expiresAt, issuedAt };
}

/**
 * UUID Generator (RFC 4122 v4)
 */
export function generateUuidV4(): string {
  return crypto.randomUUID();
}

/**
 * Hash Checksums (MD5, SHA-1, SHA-256, SHA-512)
 */
export function generateHash(input: string, algorithm: 'md5' | 'sha1' | 'sha256' | 'sha512' = 'sha256'): string {
  return crypto.createHash(algorithm).update(input, 'utf-8').digest('hex');
}

/**
 * Timestamp Converter
 */
export function timestampToDate(timestamp: number | string): { iso: string; utc: string; local: string } {
  let num = typeof timestamp === 'string' ? Number(timestamp.trim()) : timestamp;
  if (isNaN(num)) {
    throw new Error('Invalid timestamp number');
  }
  // Automatically detect seconds vs milliseconds (if seconds, length is <= 10 digits)
  if (num < 10000000000) {
    num = num * 1000;
  }

  const date = new Date(num);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid timestamp value');
  }

  return {
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toString()
  };
}

export function getCurrentTimestamp(): { seconds: number; milliseconds: number; iso: string } {
  const now = new Date();
  return {
    seconds: Math.floor(now.getTime() / 1000),
    milliseconds: now.getTime(),
    iso: now.toISOString()
  };
}

/**
 * String Case Converters
 */
function splitWords(input: string): string[] {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[-_.\s]+/g, ' ')
    .trim()
    .split(' ')
    .filter(Boolean);
}

export function toCamelCase(input: string): string {
  const words = splitWords(input);
  if (words.length === 0) return '';
  return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

export function toPascalCase(input: string): string {
  const words = splitWords(input);
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
}

export function toSnakeCase(input: string): string {
  const words = splitWords(input);
  return words.map(w => w.toLowerCase()).join('_');
}

export function toKebabCase(input: string): string {
  const words = splitWords(input);
  return words.map(w => w.toLowerCase()).join('-');
}

export function toConstantCase(input: string): string {
  const words = splitWords(input);
  return words.map(w => w.toUpperCase()).join('_');
}
