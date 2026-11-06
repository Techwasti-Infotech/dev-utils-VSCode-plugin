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

/**
 * SQL Formatter
 */
export function formatSql(sql: string): string {
  const keywords = [
    'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
    'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
    'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE',
    'ALTER TABLE', 'UNION', 'UNION ALL'
  ];

  let cleaned = sql.replace(/\s+/g, ' ').trim();
  for (const kw of keywords) {
    const regex = new RegExp(`\\b${kw}\\b`, 'gi');
    cleaned = cleaned.replace(regex, `\n${kw.toUpperCase()}`);
  }

  const lines = cleaned.split('\n').map(l => l.trim()).filter(Boolean);
  let indent = 0;
  const formattedLines: string[] = [];

  for (const line of lines) {
    if (line.startsWith('SELECT') || line.startsWith('INSERT') || line.startsWith('UPDATE') || line.startsWith('DELETE') || line.startsWith('CREATE')) {
      indent = 0;
    } else if (line.startsWith('FROM') || line.startsWith('WHERE') || line.startsWith('ORDER BY') || line.startsWith('GROUP BY') || line.startsWith('HAVING') || line.startsWith('SET') || line.startsWith('VALUES')) {
      indent = 0;
    } else if (line.startsWith('AND') || line.startsWith('OR') || line.includes('JOIN')) {
      indent = 1;
    }
    formattedLines.push('  '.repeat(indent) + line);
  }

  return formattedLines.join('\n').trim();
}

/**
 * CSV <-> JSON Converter
 */
export function csvToJson(csv: string): string {
  const lines = csv.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return '[]';
  const headers = lines[0].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
  const result: Record<string, any>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const current = lines[i].split(',').map(val => val.trim().replace(/^["']|["']$/g, ''));
    const obj: Record<string, any> = {};
    for (let j = 0; j < headers.length; j++) {
      let val: any = current[j] ?? '';
      if (!isNaN(Number(val)) && val !== '') {
        val = Number(val);
      } else if (val.toLowerCase() === 'true') {
        val = true;
      } else if (val.toLowerCase() === 'false') {
        val = false;
      }
      obj[headers[j]] = val;
    }
    result.push(obj);
  }
  return JSON.stringify(result, null, 2);
}

export function jsonToCsv(jsonStr: string): string {
  const data = JSON.parse(jsonStr);
  const arr = Array.isArray(data) ? data : [data];
  if (arr.length === 0) return '';
  const headers = Object.keys(arr[0]);
  const rows = [headers.join(',')];

  for (const item of arr) {
    const row = headers.map(header => {
      let val = item[header] ?? '';
      if (typeof val === 'object' && val !== null) {
        val = JSON.stringify(val);
      }
      val = String(val);
      if (val.includes(',') || val.includes('"') || val.includes('\n')) {
        val = `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    });
    rows.push(row.join(','));
  }
  return rows.join('\n');
}

/**
 * 1. cURL to Fetch / Axios / Python Code Converter
 */
export interface CurlParseResult {
  url: string;
  method: string;
  headers: Record<string, string>;
  data?: string;
}

export function parseCurl(curlCmd: string): CurlParseResult {
  const clean = curlCmd.replace(/\\\r?\n/g, ' ').trim();
  let method = 'GET';
  let url = '';
  const headers: Record<string, string> = {};
  let data: string | undefined;

  // Regex to extract arguments preserving quotes
  const argRegex = /(-[A-Za-z]|--[A-Za-z-]+)(?:\s+(?:'([^']*)'|"([^"]*)"|([^\s]+)))?/g;
  let match: RegExpExecArray | null;

  // Extract URL
  const urlMatch = clean.match(/(?:curl\s+)?(?:'([^']*)'|"([^"]*)"|(https?:\/\/[^\s'"]+))/i);
  if (urlMatch) {
    url = urlMatch[1] || urlMatch[2] || urlMatch[3] || '';
  }

  while ((match = argRegex.exec(clean)) !== null) {
    const flag = match[1];
    const val = match[2] ?? match[3] ?? match[4] ?? '';

    if (flag === '-X' || flag === '--request') {
      method = val.toUpperCase();
    } else if (flag === '-H' || flag === '--header') {
      const colonIdx = val.indexOf(':');
      if (colonIdx > -1) {
        const k = val.substring(0, colonIdx).trim();
        const v = val.substring(colonIdx + 1).trim();
        headers[k] = v;
      }
    } else if (flag === '-d' || flag === '--data' || flag === '--data-raw') {
      data = val;
      if (method === 'GET') method = 'POST';
    }
  }

  if (!url) {
    const fallback = clean.split(/\s+/).find(p => p.startsWith('http://') || p.startsWith('https://'));
    if (fallback) url = fallback.replace(/['"]/g, '');
  }

  return { url: url || 'https://api.example.com/data', method, headers, data };
}

export function curlToFetch(curlCmd: string): string {
  const p = parseCurl(curlCmd);
  const options: Record<string, any> = { method: p.method };
  if (Object.keys(p.headers).length > 0) options.headers = p.headers;
  if (p.data) {
    try {
      options.body = JSON.stringify(JSON.parse(p.data), null, 2);
    } catch {
      options.body = p.data;
    }
  }

  let bodyStr = '';
  if (options.body) {
    bodyStr = `,\n  body: JSON.stringify(${options.body})`;
  }

  const headersStr = options.headers ? `,\n  headers: ${JSON.stringify(options.headers, null, 4).replace(/\n/g, '\n  ')}` : '';

  return `// JavaScript Fetch
fetch("${p.url}", {
  method: "${p.method}"${headersStr}${bodyStr}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));`;
}

export function curlToPython(curlCmd: string): string {
  const p = parseCurl(curlCmd);
  const lines: string[] = ['import requests', ''];
  const args: string[] = [`"${p.url}"`];

  if (Object.keys(p.headers).length > 0) {
    lines.push(`headers = ${JSON.stringify(p.headers, null, 4)}`);
    args.push('headers=headers');
  }

  if (p.data) {
    try {
      lines.push(`data = ${JSON.stringify(JSON.parse(p.data), null, 4)}`);
      args.push('json=data');
    } catch {
      lines.push(`data = ${JSON.stringify(p.data)}`);
      args.push('data=data');
    }
  }

  const method = p.method.toLowerCase();
  lines.push('');
  lines.push(`response = requests.${method}(${args.join(', ')})`);
  lines.push('print(response.status_code)');
  lines.push('print(response.json())');

  return lines.join('\n');
}

/**
 * 2. JSON to TypeScript Interface Generator
 */
export function jsonToTypeScript(jsonStr: string, rootInterfaceName: string = 'RootObject'): string {
  const data = JSON.parse(jsonStr);
  const interfaces: Record<string, Record<string, string>> = {};

  function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getType(val: any, propName: string): string {
    if (val === null || val === undefined) return 'any';
    if (typeof val === 'string') return 'string';
    if (typeof val === 'number') return 'number';
    if (typeof val === 'boolean') return 'boolean';

    if (Array.isArray(val)) {
      if (val.length === 0) return 'any[]';
      const itemType = getType(val[0], propName.endsWith('s') ? propName.slice(0, -1) : propName + 'Item');
      return `${itemType}[]`;
    }

    if (typeof val === 'object') {
      const childName = capitalize(propName);
      buildInterface(val, childName);
      return childName;
    }

    return 'any';
  }

  function buildInterface(obj: Record<string, any>, name: string) {
    if (interfaces[name]) return;
    const props: Record<string, string> = {};
    for (const [k, v] of Object.entries(obj)) {
      props[k] = getType(v, k);
    }
    interfaces[name] = props;
  }

  if (Array.isArray(data)) {
    if (data.length > 0 && typeof data[0] === 'object') {
      buildInterface(data[0], rootInterfaceName);
    }
  } else if (typeof data === 'object' && data !== null) {
    buildInterface(data, rootInterfaceName);
  }

  const output: string[] = [];
  for (const [name, props] of Object.entries(interfaces)) {
    output.push(`export interface ${name} {`);
    for (const [prop, type] of Object.entries(props)) {
      output.push(`  ${prop}: ${type};`);
    }
    output.push('}\n');
  }

  return output.join('\n').trim();
}

/**
 * 3. Cron Expression Explainer & Humanizer
 */
export function explainCron(cronStr: string): string {
  const parts = cronStr.trim().split(/\s+/);
  if (parts.length < 5) {
    throw new Error('Cron expression must have at least 5 fields: minute hour day-of-month month day-of-week');
  }

  const [min, hour, dom, mon, dow] = parts;

  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const desc: string[] = [];

  // Minutes
  if (min === '*') {
    desc.push('every minute');
  } else if (min.startsWith('*/')) {
    desc.push(`every ${min.substring(2)} minutes`);
  } else {
    desc.push(`at minute ${min}`);
  }

  // Hours
  if (hour === '*') {
    // of every hour
  } else if (hour.startsWith('*/')) {
    desc.push(`every ${hour.substring(2)} hours`);
  } else if (hour.includes('-')) {
    desc.push(`between hours ${hour}`);
  } else {
    desc.push(`past hour ${hour}:00`);
  }

  // Day of month
  if (dom !== '*') {
    desc.push(`on day-of-month ${dom}`);
  }

  // Month
  if (mon !== '*') {
    const mNum = parseInt(mon, 10);
    const mStr = monthNames[mNum] || mon;
    desc.push(`in ${mStr}`);
  }

  // Day of week
  if (dow !== '*') {
    if (dow === '1-5') {
      desc.push('Monday through Friday');
    } else {
      const dNum = parseInt(dow, 10);
      const dStr = dayNames[dNum] || dow;
      desc.push(`on ${dStr}`);
    }
  }

  const human = desc.join(', ');
  return human.charAt(0).toUpperCase() + human.slice(1);
}

/**
 * 4. JSON Escaped Stringify & Unescape Stringified JSON
 */
export function jsonToStringified(input: string): string {
  // Accepts raw JSON or text and converts into an escaped JSON string literal
  let obj: any;
  try {
    obj = JSON.parse(input);
  } catch {
    // If not valid JSON, treat as raw string to stringify
    return JSON.stringify(input);
  }
  return JSON.stringify(JSON.stringify(obj));
}

export function stringifiedToJson(input: string, indent: number = 2): string {
  let trimmed = input.trim();
  // If wrapped in outer quotes, parse the string layer first
  let unescaped = trimmed;
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    try {
      unescaped = JSON.parse(trimmed);
    } catch {
      // fallback
    }
  } else {
    // Handle unescaped backslash sequences if user pasted string without quotes
    try {
      unescaped = JSON.parse(`"${trimmed.replace(/"/g, '\\"')}"`);
    } catch {
      // fallback
    }
  }

  // Now parse the underlying JSON structure
  const parsed = typeof unescaped === 'string' ? JSON.parse(unescaped) : unescaped;
  return JSON.stringify(parsed, null, indent);
}

/**
 * 5. YAML <-> JSON
 */
import * as yaml from 'js-yaml';

export function formatYaml(yamlStr: string, indent: number = 2): string {
  const parsed = yaml.load(yamlStr);
  return yaml.dump(parsed, { indent });
}

export function yamlToJson(yamlStr: string, indent: number = 2): string {
  const parsed = yaml.load(yamlStr);
  return JSON.stringify(parsed, null, indent);
}

export function jsonToYaml(jsonStr: string, indent: number = 2): string {
  const parsed = JSON.parse(jsonStr);
  return yaml.dump(parsed, { indent });
}

/**
 * 6. YAML <-> Java .properties file
 */
export function yamlToProperties(yamlStr: string): string {
  const obj = yaml.load(yamlStr);
  if (!obj || typeof obj !== 'object') {
    return '';
  }

  const lines: string[] = [];

  function flatten(current: any, prefix: string) {
    if (current === null || current === undefined) {
      lines.push(`${prefix}=`);
    } else if (Array.isArray(current)) {
      current.forEach((item, index) => {
        flatten(item, `${prefix}[${index}]`);
      });
    } else if (typeof current === 'object') {
      const keys = Object.keys(current);
      for (const k of keys) {
        const nextKey = prefix ? `${prefix}.${k}` : k;
        flatten(current[k], nextKey);
      }
    } else {
      lines.push(`${prefix}=${String(current)}`);
    }
  }

  flatten(obj, '');
  return lines.join('\n');
}

export function propertiesToYaml(propertiesStr: string, indent: number = 2): string {
  const lines = propertiesStr.split(/\r?\n/);
  const root: Record<string, any> = {};

  function parseVal(v: string): any {
    const trimmed = v.trim();
    if (trimmed.toLowerCase() === 'true') return true;
    if (trimmed.toLowerCase() === 'false') return false;
    if (!isNaN(Number(trimmed)) && trimmed !== '') return Number(trimmed);
    return trimmed;
  }

  for (let rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith('!')) {
      continue;
    }
    const sepIdx = line.search(/[=:]/);
    if (sepIdx === -1) {
      continue;
    }
    const key = line.substring(0, sepIdx).trim();
    const val = line.substring(sepIdx + 1).trim();

    // Parse dotted key and array index, e.g. server.port or app.hosts[0]
    const keyParts = key.split('.').filter(Boolean);
    let curr = root;

    for (let i = 0; i < keyParts.length; i++) {
      let part = keyParts[i];
      const isLast = i === keyParts.length - 1;

      // Check array indexing e.g. items[0]
      const arrayMatch = part.match(/^([^\[]+)\[(\d+)\]$/);
      if (arrayMatch) {
        const propName = arrayMatch[1];
        const arrIdx = parseInt(arrayMatch[2], 10);
        if (!curr[propName] || !Array.isArray(curr[propName])) {
          curr[propName] = [];
        }
        if (isLast) {
          curr[propName][arrIdx] = parseVal(val);
        } else {
          if (!curr[propName][arrIdx] || typeof curr[propName][arrIdx] !== 'object') {
            curr[propName][arrIdx] = {};
          }
          curr = curr[propName][arrIdx];
        }
      } else {
        if (isLast) {
          curr[part] = parseVal(val);
        } else {
          if (!curr[part] || typeof curr[part] !== 'object') {
            curr[part] = {};
          }
          curr = curr[part];
        }
      }
    }
  }

  return yaml.dump(root, { indent });
}

/**
 * 7. Difference Checker (Text, Normalized JSON, and Normalized YAML)
 */
export interface DiffLine {
  type: 'equal' | 'added' | 'removed';
  text: string;
  leftLineNumber?: number;
  rightLineNumber?: number;
}

export interface DiffResult {
  lines: DiffLine[];
  additions: number;
  deletions: number;
  unchanged: number;
  hasDifferences: boolean;
}

export function computeLineDiff(text1: string, text2: string): DiffResult {
  const lines1 = text1.split(/\r?\n/);
  const lines2 = text2.split(/\r?\n/);
  const m = lines1.length;
  const n = lines2.length;

  // Standard Myers / LCS Dynamic Programming
  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));

  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      if (lines1[i] === lines2[j]) {
        dp[i + 1][j + 1] = dp[i][j] + 1;
      } else {
        dp[i + 1][j + 1] = Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
  }

  const diffLines: DiffLine[] = [];
  let i = m;
  let j = n;
  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
      diffLines.push({
        type: 'equal',
        text: lines1[i - 1],
        leftLineNumber: i,
        rightLineNumber: j
      });
      unchanged++;
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diffLines.push({
        type: 'added',
        text: lines2[j - 1],
        rightLineNumber: j
      });
      additions++;
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diffLines.push({
        type: 'removed',
        text: lines1[i - 1],
        leftLineNumber: i
      });
      deletions++;
      i--;
    }
  }

  diffLines.reverse();

  return {
    lines: diffLines,
    additions,
    deletions,
    unchanged,
    hasDifferences: additions > 0 || deletions > 0
  };
}

export function computeNormalizedDiff(text1: string, text2: string, mode: 'text' | 'json' | 'yaml'): DiffResult {
  let normalized1 = text1;
  let normalized2 = text2;

  if (mode === 'json') {
    try {
      normalized1 = JSON.stringify(JSON.parse(text1), null, 2);
    } catch {}
    try {
      normalized2 = JSON.stringify(JSON.parse(text2), null, 2);
    } catch {}
  } else if (mode === 'yaml') {
    try {
      normalized1 = yaml.dump(yaml.load(text1), { indent: 2 });
    } catch {}
    try {
      normalized2 = yaml.dump(yaml.load(text2), { indent: 2 });
    } catch {}
  }

  return computeLineDiff(normalized1, normalized2);
}

// ==========================================
// DEVELOPER & QA / TESTER UTILITIES
// ==========================================

export interface RegexMatchResult {
  match: string;
  index: number;
  groups: string[];
}

export interface RegexTestOutput {
  matches: RegexMatchResult[];
  count: number;
  error?: string;
}

export const REGEX_PRESETS: Record<string, { label: string; pattern: string; flags: string; description: string }> = {
  email: {
    label: 'Email Address',
    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
    flags: '',
    description: 'Validates standard email format'
  },
  url: {
    label: 'URL (HTTP/HTTPS)',
    pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
    flags: 'i',
    description: 'Matches valid web URLs with optional query strings'
  },
  ipv4: {
    label: 'IPv4 Address',
    pattern: '^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$',
    flags: '',
    description: 'Matches valid IPv4 addresses (0.0.0.0 to 255.255.255.255)'
  },
  uuid: {
    label: 'UUID / GUID v4',
    pattern: '^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
    flags: 'i',
    description: 'Validates standard UUID v4 hexadecimal format'
  },
  isoDate: {
    label: 'ISO Date (YYYY-MM-DD)',
    pattern: '^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$',
    flags: '',
    description: 'Matches YYYY-MM-DD date representation'
  },
  hexColor: {
    label: 'Hex Color (#RGB / #RRGGBB)',
    pattern: '^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$',
    flags: '',
    description: 'Matches 3 or 6 digit hex color codes'
  },
  strongPassword: {
    label: 'Strong Password Policy',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    flags: '',
    description: 'At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special character'
  },
  phoneUs: {
    label: 'US/International Phone',
    pattern: '^\\+?\\d{1,3}?[-.\\s]?\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$',
    flags: '',
    description: 'Matches US and standard international phone numbers'
  }
};

/**
 * Live regular expression tester with captured groups breakdown
 */
export function testRegex(pattern: string, flags: string, testString: string): RegexTestOutput {
  try {
    const rx = new RegExp(pattern, flags);
    const matches: RegexMatchResult[] = [];

    if (flags.includes('g')) {
      let m: RegExpExecArray | null;
      // Guard against zero-length infinite match loops
      let lastIdx = -1;
      while ((m = rx.exec(testString)) !== null) {
        if (rx.lastIndex === lastIdx) {
          rx.lastIndex++;
        }
        lastIdx = rx.lastIndex;
        matches.push({
          match: m[0],
          index: m.index,
          groups: m.slice(1)
        });
        if (!flags.includes('g') || rx.lastIndex >= testString.length && m[0].length === 0) {
          break;
        }
      }
    } else {
      const m = rx.exec(testString);
      if (m) {
        matches.push({
          match: m[0],
          index: m.index,
          groups: m.slice(1)
        });
      }
    }

    return {
      matches,
      count: matches.length
    };
  } catch (err: any) {
    return {
      matches: [],
      count: 0,
      error: err.message
    };
  }
}

/**
 * Mock Test Data Generator (Users, Products, Orders) in JSON or CSV
 */
const FIRST_NAMES = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Sam', 'Chris', 'Pat', 'Riley', 'Avery', 'Devin', 'Logan'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const CITIES = ['New York', 'San Francisco', 'London', 'Berlin', 'Tokyo', 'Sydney', 'Toronto', 'Singapore', 'Paris', 'Mumbai'];
const DOMAINS = ['example.com', 'testmail.org', 'techwasti.com', 'company.io', 'qa-staging.net'];
const PRODUCT_NAMES = ['Wireless Headphones', 'Mechanical Keyboard', '4K Monitor', 'USB-C Dock', 'Ergonomic Chair', 'Laptop Stand', 'Webcam HD', 'Smartwatch Pro'];
const CATEGORIES = ['Electronics', 'Accessories', 'Office Furniture', 'Peripherals'];
const STATUSES = ['PENDING', 'COMPLETED', 'SHIPPED', 'CANCELLED', 'REFUNDED'];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMockRecords(schemaType: 'users' | 'products' | 'orders', count: number): any[] {
  const safeCount = Math.max(1, Math.min(count, 500));
  const records: any[] = [];

  for (let i = 1; i <= safeCount; i++) {
    if (schemaType === 'users') {
      const first = randomChoice(FIRST_NAMES);
      const last = randomChoice(LAST_NAMES);
      const domain = randomChoice(DOMAINS);
      const email = `${first.toLowerCase()}.${last.toLowerCase()}${i}@${domain}`;
      records.push({
        id: 1000 + i,
        name: `${first} ${last}`,
        email,
        phone: `+1-${randomInt(200, 999)}-${randomInt(100, 999)}-${randomInt(1000, 9999)}`,
        city: randomChoice(CITIES),
        isActive: Math.random() > 0.2,
        role: i === 1 ? 'ADMIN' : randomChoice(['USER', 'EDITOR', 'VIEWER']),
        createdAt: new Date(Date.now() - randomInt(1, 365) * 86400000).toISOString()
      });
    } else if (schemaType === 'products') {
      const product = randomChoice(PRODUCT_NAMES);
      records.push({
        id: `PROD-${2000 + i}`,
        title: `${product} ${i > 8 ? 'v' + (i % 5 + 1) : ''}`.trim(),
        category: randomChoice(CATEGORIES),
        price: Number((randomInt(15, 800) + 0.99).toFixed(2)),
        stock: randomInt(0, 150),
        inStock: Math.random() > 0.15,
        rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
        sku: `SKU-${randomInt(10000, 99999)}`
      });
    } else if (schemaType === 'orders') {
      records.push({
        orderId: `ORD-${5000 + i}`,
        userId: 1000 + randomInt(1, 50),
        status: randomChoice(STATUSES),
        itemCount: randomInt(1, 8),
        totalAmount: Number((randomInt(20, 1500) + 0.50).toFixed(2)),
        currency: 'USD',
        paymentMethod: randomChoice(['CREDIT_CARD', 'PAYPAL', 'APPLE_PAY', 'STRIPE']),
        orderDate: new Date(Date.now() - randomInt(0, 60) * 86400000).toISOString()
      });
    }
  }

  return records;
}

export function generateMockData(schemaType: 'users' | 'products' | 'orders', count: number, format: 'json' | 'csv'): string {
  const records = generateMockRecords(schemaType, count);
  if (format === 'csv') {
    return jsonToCsv(JSON.stringify(records));
  }
  return JSON.stringify(records, null, 2);
}

/**
 * HTTP Status Reference & Header Guide for Dev & QA
 */
export interface HttpStatusInfo {
  code: number;
  phrase: string;
  category: '1xx' | '2xx' | '3xx' | '4xx' | '5xx';
  description: string;
  qaVerification: string;
}

export const HTTP_STATUS_LIST: HttpStatusInfo[] = [
  // 1xx
  { code: 100, phrase: 'Continue', category: '1xx', description: 'Server received initial request headers; client should proceed to send request body.', qaVerification: 'Verify client sends large payload after receiving 100 Continue header.' },
  { code: 101, phrase: 'Switching Protocols', category: '1xx', description: 'Server agrees to switch protocols (e.g. HTTP to WebSocket Upgrade).', qaVerification: 'Check WebSocket connection handshake 101 response and protocol upgrade headers.' },
  
  // 2xx
  { code: 200, phrase: 'OK', category: '2xx', description: 'Standard response for successful HTTP requests.', qaVerification: 'Verify response body schema matches API documentation; assert accurate status and payload integrity.' },
  { code: 201, phrase: 'Created', category: '2xx', description: 'Request succeeded and a new resource was created.', qaVerification: 'Verify Location header points to newly created resource URI; check resource can be retrieved via GET.' },
  { code: 202, phrase: 'Accepted', category: '2xx', description: 'Request accepted for background asynchronous processing; processing is not complete.', qaVerification: 'Verify status polling URL or job ID in response payload.' },
  { code: 204, phrase: 'No Content', category: '2xx', description: 'Server successfully fulfilled request and there is no additional content to return.', qaVerification: 'Assert response body is empty (0 bytes); verify DELETE or PUT succeeded in subsequent queries.' },

  // 3xx
  { code: 301, phrase: 'Moved Permanently', category: '3xx', description: 'Target resource has been assigned a new permanent URI.', qaVerification: 'Verify Location header is present and client/browser automatically redirects to target URL.' },
  { code: 302, phrase: 'Found / Temporary Redirect', category: '3xx', description: 'Resource resides temporarily under a different URI.', qaVerification: 'Verify redirection target; ensure original request method is preserved or handled per client expectations.' },
  { code: 304, phrase: 'Not Modified', category: '3xx', description: 'Resource has not been modified since version specified by request headers (If-None-Match or If-Modified-Since).', qaVerification: 'Verify ETag / Last-Modified caching flow; ensure response body is completely omitted.' },

  // 4xx
  { code: 400, phrase: 'Bad Request', category: '4xx', description: 'Server cannot process request due to client error (e.g., malformed syntax, invalid JSON, or missing required field).', qaVerification: 'Submit invalid payload, missing parameters, and malformed types; assert structured validation error messages.' },
  { code: 401, phrase: 'Unauthorized', category: '4xx', description: 'Authentication is required and has failed or has not yet been provided.', qaVerification: 'Send request with missing, expired, or tampered Bearer token; assert WWW-Authenticate header.' },
  { code: 403, phrase: 'Forbidden', category: '4xx', description: 'Server understood request, but refuses to authorize it (insufficient user permissions or role).', qaVerification: 'Attempt accessing admin endpoints with normal user credentials; verify 403 is returned rather than 401.' },
  { code: 404, phrase: 'Not Found', category: '4xx', description: 'Server cannot find the requested resource.', qaVerification: 'Test queries with nonexistent IDs and invalid endpoints; verify clean error JSON without stack traces.' },
  { code: 405, phrase: 'Method Not Allowed', category: '4xx', description: 'Request method is recognized by server but not supported by target resource.', qaVerification: 'Send POST to a GET-only endpoint; assert Allow response header lists supported methods.' },
  { code: 409, phrase: 'Conflict', category: '4xx', description: 'Request could not be processed because of conflict in current state of resource (e.g. duplicate email/username).', qaVerification: 'Attempt creating resource with duplicate unique constraint; verify idempotency safeguards.' },
  { code: 422, phrase: 'Unprocessable Entity', category: '4xx', description: 'Request syntax was correct, but server was unable to process contained instructions (semantic validation errors).', qaVerification: 'Send payload failing domain validations (e.g. negative prices, invalid email format).' },
  { code: 429, phrase: 'Too Many Requests', category: '4xx', description: 'Client has sent too many requests in a given amount of time (rate limiting).', qaVerification: 'Fire burst requests exceeding rate limits; assert Retry-After header and clear rate limit error messages.' },

  // 5xx
  { code: 500, phrase: 'Internal Server Error', category: '5xx', description: 'Server encountered an unexpected condition preventing it from fulfilling request.', qaVerification: 'Verify backend logs capture stack trace; ensure no sensitive internals or database queries leak to client.' },
  { code: 502, phrase: 'Bad Gateway', category: '5xx', description: 'Server acting as gateway or proxy received invalid response from inbound server.', qaVerification: 'Simulate downstream service downtime or timeout behind proxy/ingress.' },
  { code: 503, phrase: 'Service Unavailable', category: '5xx', description: 'Server is currently unable to handle request due to temporary overloading or maintenance.', qaVerification: 'Assert Retry-After header; verify healthcheck endpoints reflect degraded status.' },
  { code: 504, phrase: 'Gateway Timeout', category: '5xx', description: 'Server acting as gateway or proxy did not receive timely response from upstream server.', qaVerification: 'Verify timeout configurations between ingress/reverse proxy and internal microservices.' }
];

export function lookupHttpStatus(query: string | number): HttpStatusInfo[] {
  const str = String(query).trim().toLowerCase();
  if (!str) return HTTP_STATUS_LIST;

  return HTTP_STATUS_LIST.filter(item => 
    String(item.code).includes(str) ||
    item.phrase.toLowerCase().includes(str) ||
    item.category.toLowerCase().includes(str) ||
    item.description.toLowerCase().includes(str)
  );
}



