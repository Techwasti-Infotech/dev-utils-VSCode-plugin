import { test } from 'node:test';
import * as assert from 'node:assert';
import {
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  htmlEncode,
  htmlDecode,
  hexEncode,
  hexDecode,
  formatJson,
  minifyJson,
  formatXml,
  minifyXml,
  decodeJwt,
  generateUuidV4,
  generateNanoid,
  generateHash,
  timestampToDate,
  getCurrentTimestamp,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase,
  toTitleCase,
  sortLines,
  deduplicateLines,
  countTextStats,
  hexToRgb,
  rgbToHex,
  generateLoremIpsum,
  formatSql,
  csvToJson,
  jsonToCsv
} from '../utils/coreUtils';

test('Base64 encoding and decoding', () => {
  const original = 'Techwasti Infotech - DevUtils';
  const encoded = base64Encode(original);
  assert.strictEqual(encoded, 'VGVjaHdhc3RpIEluZm90ZWNoIC0gRGV2VXRpbHM=');
  assert.strictEqual(base64Decode(encoded), original);
});

test('Hex encoding and decoding', () => {
  const original = 'Techwasti';
  const hex = hexEncode(original);
  assert.strictEqual(hex, '546563687761737469');
  assert.strictEqual(hexDecode(hex), original);
});

test('XML formatting and minifying', () => {
  const xml = '<root><user id="1"><name>Techwasti</name></user></root>';
  const formatted = formatXml(xml);
  assert.ok(formatted.includes('\n'));
  assert.strictEqual(minifyXml(formatted), xml);
});

test('Line utilities: sort & deduplicate', () => {
  const messy = 'cherry\napple\nbanana\napple\nbanana';
  const sorted = sortLines(messy);
  assert.strictEqual(sorted.split('\n')[0], 'apple');
  const unique = deduplicateLines(messy);
  assert.strictEqual(unique.split('\n').length, 3);
});

test('Text statistics counter', () => {
  const stats = countTextStats('Hello Techwasti Infotech');
  assert.strictEqual(stats.words, 3);
  assert.strictEqual(stats.characters, 24);
  assert.strictEqual(stats.lines, 1);
});

test('Color conversions: HEX <-> RGB', () => {
  const rgb = hexToRgb('#2563eb');
  assert.strictEqual(rgb.r, 37);
  assert.strictEqual(rgb.g, 99);
  assert.strictEqual(rgb.b, 235);
  assert.strictEqual(rgbToHex(rgb.r, rgb.g, rgb.b), '#2563eb');
});

test('Nanoid generator', () => {
  const id = generateNanoid(16);
  assert.strictEqual(id.length, 16);
});

test('Lorem Ipsum generator', () => {
  const lorem = generateLoremIpsum(2);
  assert.ok(lorem.includes('Lorem ipsum'));
  assert.ok(lorem.includes('\n\n'));
});

test('URL encoding and decoding', () => {
  const original = 'name=Techwasti Infotech&status=awesome!';
  const encoded = urlEncode(original);
  assert.strictEqual(encoded, 'name%3DTechwasti%20Infotech%26status%3Dawesome!');
  assert.strictEqual(urlDecode(encoded), original);
});

test('HTML encoding and decoding', () => {
  const original = '<div class="test">Techwasti & "Friends"</div>';
  const encoded = htmlEncode(original);
  assert.strictEqual(encoded, '&lt;div class=&quot;test&quot;&gt;Techwasti &amp; &quot;Friends&quot;&lt;/div&gt;');
  assert.strictEqual(htmlDecode(encoded), original);
});

test('JSON formatting and minifying', () => {
  const obj = { name: 'Techwasti', active: true, count: 42 };
  const str = JSON.stringify(obj);
  const formatted = formatJson(str, 2);
  assert.ok(formatted.includes('\n'));
  assert.strictEqual(minifyJson(formatted), str);
});

test('JWT decoder parses header and payload', () => {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlY2h3YXN0aSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxOTk5OTk5OTk5fQ.signature_dummy';
  const decoded = decodeJwt(token);
  assert.strictEqual(decoded.header.alg, 'HS256');
  assert.strictEqual(decoded.payload.name, 'Techwasti');
  assert.strictEqual(decoded.isExpired, false);
});

test('UUID v4 generator generates valid RFC 4122 v4 uuid', () => {
  const uuid = generateUuidV4();
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  assert.ok(uuidRegex.test(uuid), `Generated UUID ${uuid} did not match RFC 4122 v4 pattern`);
});

test('Hash generators match expected checksums', () => {
  const input = 'techwasti';
  const sha256 = generateHash(input, 'sha256');
  const md5 = generateHash(input, 'md5');
  assert.strictEqual(sha256.length, 64);
  assert.strictEqual(md5.length, 32);
});

test('Timestamp converter handles seconds and milliseconds', () => {
  const resultFromSec = timestampToDate(1700000000);
  assert.strictEqual(resultFromSec.iso, '2023-11-14T22:13:20.000Z');

  const resultFromMs = timestampToDate(1700000000000);
  assert.strictEqual(resultFromMs.iso, '2023-11-14T22:13:20.000Z');

  const current = getCurrentTimestamp();
  assert.ok(current.seconds > 0);
  assert.ok(current.milliseconds > 0);
});

test('Case converters transform text formats properly', () => {
  const text = 'hello world dev-utils';
  assert.strictEqual(toCamelCase(text), 'helloWorldDevUtils');
  assert.strictEqual(toPascalCase(text), 'HelloWorldDevUtils');
  assert.strictEqual(toSnakeCase(text), 'hello_world_dev_utils');
  assert.strictEqual(toKebabCase(text), 'hello-world-dev-utils');
  assert.strictEqual(toConstantCase(text), 'HELLO_WORLD_DEV_UTILS');
  assert.strictEqual(toTitleCase(text), 'Hello World Dev Utils');
});

test('SQL Formatter formats query statements', () => {
  const query = 'select id, name from users where age > 18 and active = 1 order by name';
  const formatted = formatSql(query);
  assert.ok(formatted.includes('SELECT id, name'));
  assert.ok(formatted.includes('FROM users'));
  assert.ok(formatted.includes('WHERE age > 18'));
  assert.ok(formatted.includes('  AND active = 1'));
  assert.ok(formatted.includes('ORDER BY name'));
});

test('CSV to JSON and JSON to CSV conversion', () => {
  const csv = 'name,role,active\nTechwasti,Admin,true\nDeveloper,User,false';
  const jsonStr = csvToJson(csv);
  const parsed = JSON.parse(jsonStr);
  assert.strictEqual(parsed.length, 2);
  assert.strictEqual(parsed[0].name, 'Techwasti');
  assert.strictEqual(parsed[0].active, true);

  const backToCsv = jsonToCsv(jsonStr);
  assert.strictEqual(backToCsv.split('\n')[0], 'name,role,active');
  assert.ok(backToCsv.includes('Techwasti,Admin,true'));
});
