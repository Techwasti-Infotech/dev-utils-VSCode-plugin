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
 * Hex Encoding & Decoding
 */
export function hexEncode(input: string): string {
  return Buffer.from(input, 'utf-8').toString('hex');
}

export function hexDecode(input: string): string {
  const clean = input.replace(/\s+/g, '');
  if (clean.length % 2 !== 0) {
    throw new Error('Hex string length must be an even number of characters.');
  }
  return Buffer.from(clean, 'hex').toString('utf-8');
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
 * XML Formatter & Minifier
 */
export function formatXml(xml: string): string {
  let formatted = '';
  let indent = 0;
  const tab = '  ';
  xml = xml.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3');
  const lines = xml.split('\r\n');

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;
    if (line.match(/^<\/\w/)) {
      if (indent > 0) indent--;
    }
    formatted += tab.repeat(indent) + line + '\n';
    if (line.match(/^<\w[^>]*[^\/]>.*$/) && !line.match(/^<\w[^>]*\/>/)) {
      if (!line.match(/<\/[^>]+>$/)) {
        indent++;
      }
    }
  }
  return formatted.trim();
}

export function minifyXml(xml: string): string {
  return xml.replace(/>\s+</g, '><').trim();
}

/**
 * JWT Decoder
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
 * UUID & Identifier Generators
 */
export function generateUuidV4(): string {
  return crypto.randomUUID();
}

export function generateNanoid(size: number = 21): string {
  const alphabet = 'useandom-26T1983_40STAkjlqyfZ凤院whbgpvRIFnocx';
  const bytes = crypto.randomBytes(size);
  let id = '';
  for (let i = 0; i < size; i++) {
    id += alphabet[bytes[i] % alphabet.length];
  }
  return id;
}

/**
 * Hash Checksums
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

export function toTitleCase(input: string): string {
  const words = splitWords(input);
  return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

/**
 * Text & Line Utilities
 */
export function sortLines(input: string, reverse: boolean = false): string {
  const lines = input.split(/\r?\n/);
  lines.sort((a, b) => a.localeCompare(b));
  if (reverse) lines.reverse();
  return lines.join('\n');
}

export function deduplicateLines(input: string): string {
  const lines = input.split(/\r?\n/);
  const seen = new Set<string>();
  const unique: string[] = [];
  for (const line of lines) {
    if (!seen.has(line)) {
      seen.add(line);
      unique.push(line);
    }
  }
  return unique.join('\n');
}

export function countTextStats(input: string): { characters: number; words: number; lines: number; bytes: number } {
  const characters = input.length;
  const words = input.trim() ? input.trim().split(/\s+/).length : 0;
  const lines = input ? input.split(/\r?\n/).length : 0;
  const bytes = Buffer.byteLength(input, 'utf-8');
  return { characters, words, lines, bytes };
}

/**
 * Color Utilities
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number; css: string } {
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map(char => char + char).join('');
  }
  if (c.length !== 6) {
    throw new Error('Invalid HEX color format. Expected 3 or 6 hex digits.');
  }
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return { r, g, b, css: `rgb(${r}, ${g}, ${b})` };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Lorem Ipsum Text Generator
 */
export function generateLoremIpsum(paragraphs: number = 1): string {
  const loremPhrases = [
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    "Curabitur pretium tincidunt lacus nulla gravida orci a odio tempus dictum.",
    "Maecenas tristique orci ac sem duis ultricies pharetra magna donec accumsan malesuada."
  ];

  const result: string[] = [];
  for (let p = 0; p < paragraphs; p++) {
    const count = 3 + (p % 3);
    const sent = [];
    for (let i = 0; i < count; i++) {
      sent.push(loremPhrases[(p * 2 + i) % loremPhrases.length]);
    }
    result.push(sent.join(' '));
  }
  return result.join('\n\n');
}
