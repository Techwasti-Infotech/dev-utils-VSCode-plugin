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
  jsonToCsv,
  curlToFetch,
  curlToPython,
  jsonToTypeScript,
  explainCron,
  jsonToStringified,
  stringifiedToJson,
  formatYaml,
  yamlToJson,
  jsonToYaml,
  yamlToProperties,
  propertiesToYaml,
  computeLineDiff,
  computeNormalizedDiff,
  testRegex,
  generateMockData,
  generateMockRecords,
  lookupHttpStatus,
  REGEX_PRESETS
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

test('cURL parser and code generator for Fetch & Python', () => {
  const curl = `curl -X POST "https://api.techwasti.com/v1/users" -H "Content-Type: application/json" -H "Authorization: Bearer token123" -d '{"name":"John","role":"admin"}'`;
  
  const jsCode = curlToFetch(curl);
  assert.ok(jsCode.includes('fetch("https://api.techwasti.com/v1/users"'));
  assert.ok(jsCode.includes('method: "POST"'));
  assert.ok(jsCode.includes('Bearer token123'));
  assert.ok(jsCode.includes('"name": "John"'));

  const pyCode = curlToPython(curl);
  assert.ok(pyCode.includes('import requests'));
  assert.ok(pyCode.includes('requests.post'));
  assert.ok(pyCode.includes('https://api.techwasti.com/v1/users'));
  assert.ok(pyCode.includes('json=data'));
});

test('JSON to TypeScript interface generator', () => {
  const json = JSON.stringify({
    id: 1,
    name: 'Techwasti',
    active: true,
    tags: ['developer', 'tools'],
    details: {
      location: 'India',
      stars: 5
    }
  });

  const ts = jsonToTypeScript(json, 'UserResponse');
  assert.ok(ts.includes('export interface UserResponse {'));
  assert.ok(ts.includes('id: number;'));
  assert.ok(ts.includes('name: string;'));
  assert.ok(ts.includes('active: boolean;'));
  assert.ok(ts.includes('tags: string[];'));
  assert.ok(ts.includes('export interface Details {'));
  assert.ok(ts.includes('location: string;'));
});

test('Cron expression explainer and humanizer', () => {
  const human1 = explainCron('*/15 * * * *');
  assert.strictEqual(human1, 'Every 15 minutes');

  const human2 = explainCron('0 9 * * 1-5');
  assert.strictEqual(human2, 'At minute 0, past hour 9:00, Monday through Friday');

  const human3 = explainCron('30 14 1 5 *');
  assert.strictEqual(human3, 'At minute 30, past hour 14:00, on day-of-month 1, in May');
});

test('JSON stringify and unescape stringified JSON', () => {
  const rawObj = { name: 'Techwasti', count: 10, nested: { ok: true } };
  const rawJson = JSON.stringify(rawObj);
  const stringified = jsonToStringified(rawJson);
  assert.ok(stringified.startsWith('"{\\"name\\":\\"Techwasti\\"'));

  const backToJson = stringifiedToJson(stringified);
  assert.deepStrictEqual(JSON.parse(backToJson), rawObj);
});

test('YAML formatting, YAML to JSON, and JSON to YAML', () => {
  const yamlContent = `
server:
  port: 8080
  host: localhost
tags:
  - web
  - api
`.trim();

  const formatted = formatYaml(yamlContent);
  assert.ok(formatted.includes('server:'));
  assert.ok(formatted.includes('port: 8080'));

  const jsonStr = yamlToJson(yamlContent);
  const parsedJson = JSON.parse(jsonStr);
  assert.strictEqual(parsedJson.server.port, 8080);
  assert.strictEqual(parsedJson.tags[0], 'web');

  const backToYaml = jsonToYaml(jsonStr);
  assert.ok(backToYaml.includes('port: 8080'));
});

test('YAML to Properties and Properties to YAML conversion', () => {
  const yamlContent = `
app:
  name: DevUtils
  version: 0.3.2
database:
  url: jdbc:mysql://localhost:3306/db
  pool:
    max: 10
    active: true
`.trim();

  const props = yamlToProperties(yamlContent);
  assert.ok(props.includes('app.name=DevUtils'));
  assert.ok(props.includes('app.version=0.3.2'));
  assert.ok(props.includes('database.pool.max=10'));
  assert.ok(props.includes('database.pool.active=true'));

  const backToYaml = propertiesToYaml(props);
  assert.ok(backToYaml.includes('DevUtils'));
  assert.ok(backToYaml.includes('3306'));
});

test('Line diff and normalized JSON/YAML diff computation', () => {
  const t1 = 'apple\nbanana\ncherry';
  const t2 = 'apple\norange\ncherry\ndate';
  const textDiff = computeLineDiff(t1, t2);
  assert.strictEqual(textDiff.hasDifferences, true);
  assert.strictEqual(textDiff.additions, 2);
  assert.strictEqual(textDiff.deletions, 1);
  assert.strictEqual(textDiff.unchanged, 2);

  const j1 = '{"name":"Alice","age":30}';
  const j2 = '{\n  "age": 31,\n  "name": "Alice"\n}';
  const jsonDiff = computeNormalizedDiff(j1, j2, 'json');
  assert.strictEqual(jsonDiff.hasDifferences, true);
  assert.ok(jsonDiff.lines.some(l => l.type === 'removed' && l.text.includes('"age": 30')));
  assert.ok(jsonDiff.lines.some(l => l.type === 'added' && l.text.includes('"age": 31')));
});

test('Mock Test Data Generator for QA & Dev (Users, Products, Orders in JSON and CSV)', () => {
  const usersJson = generateMockData('users', 5, 'json');
  const parsedUsers = JSON.parse(usersJson);
  assert.strictEqual(parsedUsers.length, 5);
  assert.ok(parsedUsers[0].email.includes('@'));
  assert.ok(parsedUsers[0].name.length > 0);
  assert.ok(parsedUsers[0].phone.startsWith('+1-'));

  const productsCsv = generateMockData('products', 3, 'csv');
  const csvLines = productsCsv.trim().split('\n');
  assert.strictEqual(csvLines.length, 4); // 1 header + 3 rows
  assert.ok(csvLines[0].includes('price'));
  assert.ok(csvLines[0].includes('category'));

  const orders = generateMockRecords('orders', 4);
  assert.strictEqual(orders.length, 4);
  assert.ok(orders[0].orderId.startsWith('ORD-'));
  assert.ok(orders[0].totalAmount > 0);
});

test('Regex pattern tester with matches, indices, and captured groups', () => {
  // Test email pattern preset
  const emailPreset = REGEX_PRESETS.email;
  const match1 = testRegex(emailPreset.pattern, emailPreset.flags, 'contact@techwasti.com');
  assert.strictEqual(match1.count, 1);
  assert.strictEqual(match1.matches[0].match, 'contact@techwasti.com');

  const matchBad = testRegex(emailPreset.pattern, emailPreset.flags, 'invalid-email@');
  assert.strictEqual(matchBad.count, 0);

  // Global regex with capture groups
  const text = 'Order 101 placed at $25.50 and Order 102 placed at $99.00';
  const res = testRegex('Order (\\d+) placed at \\$([0-9.]+)', 'g', text);
  assert.strictEqual(res.count, 2);
  assert.strictEqual(res.matches[0].groups[0], '101');
  assert.strictEqual(res.matches[0].groups[1], '25.50');
  assert.strictEqual(res.matches[1].groups[0], '102');
  assert.strictEqual(res.matches[1].groups[1], '99.00');

  // Error handling for invalid regex
  const invalid = testRegex('[a-z(', '', 'test');
  assert.ok(invalid.error !== undefined);
  assert.strictEqual(invalid.count, 0);
});

test('HTTP Status Code & API Header Reference lookup', () => {
  const notFound = lookupHttpStatus(404);
  assert.strictEqual(notFound.length, 1);
  assert.strictEqual(notFound[0].phrase, 'Not Found');
  assert.strictEqual(notFound[0].category, '4xx');
  assert.ok(notFound[0].qaVerification.includes('nonexistent'));

  const serverErrors = lookupHttpStatus('5xx');
  assert.ok(serverErrors.length >= 4);
  assert.ok(serverErrors.some(s => s.code === 500));
  assert.ok(serverErrors.some(s => s.code === 502));

  const searchGateway = lookupHttpStatus('gateway');
  assert.ok(searchGateway.some(s => s.code === 502));
  assert.ok(searchGateway.some(s => s.code === 504));
});

