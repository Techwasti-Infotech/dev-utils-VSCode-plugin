import * as vscode from 'vscode';
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
  generateLoremIpsum
} from '../utils/coreUtils';

export function getWebviewContent(cspSource: string, nonce: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline' ${cspSource}; script-src 'nonce-${nonce}';">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevUtils Dashboard</title>
  <style>
    :root {
      --bg: var(--vscode-editor-background, #1e1e1e);
      --fg: var(--vscode-editor-foreground, #cccccc);
      --input-bg: var(--vscode-input-background, #252526);
      --input-fg: var(--vscode-input-foreground, #cccccc);
      --border: var(--vscode-input-border, #3c3c3c);
      --btn-bg: var(--vscode-button-background, #0e639c);
      --btn-fg: var(--vscode-button-foreground, #ffffff);
      --btn-hover: var(--vscode-button-hoverBackground, #1177bb);
      --accent: var(--vscode-focusBorder, #007acc);
      --card-bg: var(--vscode-editorWidget-background, #252526);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: var(--vscode-font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif); }
    body { background: var(--bg); color: var(--fg); padding: 24px; font-size: 13px; line-height: 1.5; }
    
    header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid var(--border); }
    .brand h1 { font-size: 20px; font-weight: 600; display: flex; align-items: center; gap: 8px; }
    .brand p { font-size: 12px; opacity: 0.8; margin-top: 4px; }
    .badge { background: var(--btn-bg); color: var(--btn-fg); font-size: 11px; padding: 2px 8px; border-radius: 12px; font-weight: 500; }
    
    .nav-tabs { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
    .tab-btn { background: transparent; border: 1px solid var(--border); color: var(--fg); padding: 8px 14px; border-radius: 4px; cursor: pointer; font-size: 12px; transition: all 0.2s; }
    .tab-btn.active, .tab-btn:hover { background: var(--btn-bg); color: var(--btn-fg); border-color: var(--btn-bg); }
    
    .tool-panel { display: none; background: var(--card-bg); border: 1px solid var(--border); border-radius: 6px; padding: 20px; }
    .tool-panel.active { display: block; }
    
    .form-group { margin-bottom: 16px; }
    label { display: block; margin-bottom: 6px; font-weight: 500; font-size: 12px; }
    textarea, input[type="text"] { width: 100%; background: var(--input-bg); color: var(--input-fg); border: 1px solid var(--border); border-radius: 4px; padding: 10px; font-family: var(--vscode-editor-font-family, monospace); font-size: 12px; resize: vertical; }
    textarea:focus, input[type="text"]:focus { outline: 1px solid var(--accent); border-color: var(--accent); }
    
    .actions { display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap; }
    button.action-btn { background: var(--btn-bg); color: var(--btn-fg); border: none; padding: 8px 14px; border-radius: 4px; cursor: pointer; font-size: 12px; font-weight: 500; transition: background 0.2s; }
    button.action-btn:hover { background: var(--btn-hover); }
    button.sec-btn { background: transparent; border: 1px solid var(--border); color: var(--fg); padding: 8px 14px; border-radius: 4px; cursor: pointer; font-size: 12px; }
    button.sec-btn:hover { background: var(--border); }
    
    .output-box { margin-top: 16px; }
    .status-msg { font-size: 12px; margin-top: 6px; }
    .status-msg.error { color: #f48771; }
    .status-msg.success { color: #89d185; }
    
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    @media (max-width: 768px) { .grid-2 { grid-template-columns: 1fr; } }
  </style>
</head>
<body>

  <header>
    <div class="brand">
      <h1>🛠️ DevUtils Toolbox <span class="badge">Offline First</span></h1>
      <p>Secure in-memory developer utilities by Techwasti Infotech</p>
    </div>
  </header>

  <div class="nav-tabs">
    <button class="tab-btn active" data-tab="base64" onclick="switchTab('base64')">Base64</button>
    <button class="tab-btn" data-tab="json" onclick="switchTab('json')">JSON Formatter</button>
    <button class="tab-btn" data-tab="xml" onclick="switchTab('xml')">XML Formatter</button>
    <button class="tab-btn" data-tab="sql" onclick="switchTab('sql')">SQL Formatter</button>
    <button class="tab-btn" data-tab="csv" onclick="switchTab('csv')">CSV ⇄ JSON</button>
    <button class="tab-btn" data-tab="jwt" onclick="switchTab('jwt')">JWT Inspector</button>
    <button class="tab-btn" data-tab="uuid" onclick="switchTab('uuid')">UUID / Nanoid</button>
    <button class="tab-btn" data-tab="hash" onclick="switchTab('hash')">Hash Checksum</button>
    <button class="tab-btn" data-tab="timestamp" onclick="switchTab('timestamp')">Epoch Timestamp</button>
    <button class="tab-btn" data-tab="case" onclick="switchTab('case')">Case Converter</button>
    <button class="tab-btn" data-tab="lines" onclick="switchTab('lines')">Line Tools</button>
    <button class="tab-btn" data-tab="color" onclick="switchTab('color')">Color Picker</button>
    <button class="tab-btn" data-tab="lorem" onclick="switchTab('lorem')">Lorem Ipsum</button>
    <button class="tab-btn" data-tab="stats" onclick="switchTab('stats')">Text Statistics</button>
    <button class="tab-btn" data-tab="curl" onclick="switchTab('curl')">cURL Converter</button>
    <button class="tab-btn" data-tab="ts" onclick="switchTab('ts')">JSON ➔ TS</button>
    <button class="tab-btn" data-tab="cron" onclick="switchTab('cron')">Cron Explainer</button>
  </div>

  <!-- Base64 Panel -->
  <div id="panel-base64" class="tool-panel active">
    <h3>Base64 & URL & Hex Encode / Decode</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>Input Text</label>
      <textarea id="b64-input" rows="5" placeholder="Enter text to process..."></textarea>
    </div>
    <div class="actions">
      <button class="action-btn" id="btn-b64-encode" onclick="processBase64(true)">Base64 Encode</button>
      <button class="action-btn" id="btn-b64-decode" onclick="processBase64(false)">Base64 Decode</button>
      <button class="action-btn" id="btn-url-encode" onclick="processUrl(true)">URL Encode</button>
      <button class="action-btn" id="btn-url-decode" onclick="processUrl(false)">URL Decode</button>
      <button class="action-btn" id="btn-hex-encode" onclick="processHex(true)">Hex Encode</button>
      <button class="action-btn" id="btn-hex-decode" onclick="processHex(false)">Hex Decode</button>
      <button class="sec-btn" id="btn-b64-sample" onclick="loadSample('b64')">Load Sample</button>
      <button class="sec-btn" data-copy="b64-output" onclick="copyOutput('b64-output')">Copy Output</button>
    </div>
    <div class="form-group output-box">
      <label>Output</label>
      <textarea id="b64-output" rows="5" readonly></textarea>
      <div id="b64-status" class="status-msg"></div>
    </div>
  </div>

  <!-- JSON Panel -->
  <div id="panel-json" class="tool-panel">
    <h3>JSON Formatter & Minifier</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>JSON String</label>
      <textarea id="json-input" rows="6" placeholder='{"name":"Techwasti","active":true}'></textarea>
    </div>
    <div class="actions">
      <button class="action-btn" id="btn-json-format" onclick="processJson(true)">Prettify / Format (2 spaces)</button>
      <button class="action-btn" id="btn-json-minify" onclick="processJson(false)">Minify / Compact</button>
      <button class="sec-btn" id="btn-json-sample" onclick="loadSample('json')">Load Sample</button>
      <button class="sec-btn" data-copy="json-output" onclick="copyOutput('json-output')">Copy Output</button>
    </div>
    <div class="form-group output-box">
      <label>Formatted Output</label>
      <textarea id="json-output" rows="6" readonly></textarea>
      <div id="json-status" class="status-msg"></div>
    </div>
  </div>

  <!-- XML Panel -->
  <div id="panel-xml" class="tool-panel">
    <h3>XML Formatter & Minifier</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>XML String</label>
      <textarea id="xml-input" rows="6" placeholder="<root><item>DevUtils</item></root>"></textarea>
    </div>
    <div class="actions">
      <button class="action-btn" id="btn-xml-format" onclick="processXml(true)">Format XML</button>
      <button class="action-btn" id="btn-xml-minify" onclick="processXml(false)">Minify XML</button>
      <button class="sec-btn" id="btn-xml-sample" onclick="loadSample('xml')">Load Sample</button>
      <button class="sec-btn" data-copy="xml-output" onclick="copyOutput('xml-output')">Copy Output</button>
    </div>
    <div class="form-group output-box">
      <label>Output</label>
      <textarea id="xml-output" rows="6" readonly></textarea>
    </div>
  </div>

  <!-- SQL Panel -->
  <div id="panel-sql" class="tool-panel">
    <h3>SQL Query Formatter</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>SQL Query</label>
      <textarea id="sql-input" rows="6" placeholder="SELECT u.id, u.name FROM users u WHERE u.active = 1 ORDER BY u.name ASC"></textarea>
    </div>
    <div class="actions">
      <button class="action-btn" id="btn-sql-format" onclick="processSql()">Format SQL</button>
      <button class="sec-btn" id="btn-sql-sample" onclick="loadSample('sql')">Load Sample</button>
      <button class="sec-btn" data-copy="sql-output" onclick="copyOutput('sql-output')">Copy Output</button>
    </div>
    <div class="form-group output-box">
      <label>Formatted SQL</label>
      <textarea id="sql-output" rows="6" readonly></textarea>
      <div id="sql-status" class="status-msg"></div>
    </div>
  </div>

  <!-- CSV Panel -->
  <div id="panel-csv" class="tool-panel">
    <h3>CSV ⇄ JSON Converter</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>Input (CSV or JSON string)</label>
      <textarea id="csv-input" rows="6" placeholder="id,name,role&#10;1,Techwasti,Admin"></textarea>
    </div>
    <div class="actions">
      <button class="action-btn" id="btn-csv-to-json" onclick="processCsvToJson()">CSV to JSON</button>
      <button class="action-btn" id="btn-json-to-csv" onclick="processJsonToCsv()">JSON to CSV</button>
      <button class="sec-btn" id="btn-csv-sample" onclick="loadSample('csv')">Load Sample</button>
      <button class="sec-btn" data-copy="csv-output" onclick="copyOutput('csv-output')">Copy Output</button>
    </div>
    <div class="form-group output-box">
      <label>Converted Output</label>
      <textarea id="csv-output" rows="6" readonly></textarea>
      <div id="csv-status" class="status-msg"></div>
    </div>
  </div>

  <!-- JWT Panel -->
  <div id="panel-jwt" class="tool-panel">
    <h3>JWT Inspector & Decoder</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>JWT Token</label>
      <textarea id="jwt-input" rows="4" placeholder="Paste your Bearer / JWT token here..."></textarea>
    </div>
    <div class="actions">
      <button class="action-btn" id="btn-jwt-decode" onclick="processJwt()">Inspect & Decode Token</button>
      <button class="sec-btn" id="btn-jwt-sample" onclick="loadSample('jwt')">Load Sample Token</button>
    </div>
    <div class="grid-2 output-box">
      <div>
        <label>Header</label>
        <textarea id="jwt-header" rows="6" readonly></textarea>
      </div>
      <div>
        <label>Payload (Claims)</label>
        <textarea id="jwt-payload" rows="6" readonly></textarea>
      </div>
    </div>
    <div id="jwt-status" class="status-msg" style="margin-top: 8px;"></div>
  </div>

  <!-- UUID / Generator Panel -->
  <div id="panel-uuid" class="tool-panel">
    <h3>UUID & Identifier Generators</h3>
    <div class="actions" style="margin-top: 12px;">
      <button class="action-btn" id="btn-uuid-1" onclick="generateUuidBatch(1)">Generate 1 UUID</button>
      <button class="action-btn" id="btn-uuid-5" onclick="generateUuidBatch(5)">Generate 5 UUIDs</button>
      <button class="action-btn" id="btn-nanoid-5" onclick="generateNanoIdBatch(5)">Generate 5 Nanoids</button>
      <button class="sec-btn" data-copy="uuid-output" onclick="copyOutput('uuid-output')">Copy to Clipboard</button>
    </div>
    <div class="form-group output-box">
      <label>Generated IDs</label>
      <textarea id="uuid-output" rows="6" readonly></textarea>
    </div>
  </div>

  <!-- Hash Panel -->
  <div id="panel-hash" class="tool-panel">
    <h3>Cryptographic Hash & Checksum</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>Input Text</label>
      <textarea id="hash-input" rows="4" placeholder="Enter string to hash..."></textarea>
    </div>
    <div class="output-box">
      <div class="form-group">
        <label>SHA-256</label>
        <input type="text" id="hash-sha256" readonly />
      </div>
      <div class="form-group">
        <label>MD5</label>
        <input type="text" id="hash-md5" readonly />
      </div>
      <div class="form-group">
        <label>SHA-1</label>
        <input type="text" id="hash-sha1" readonly />
      </div>
    </div>
  </div>

  <!-- Timestamp Panel -->
  <div id="panel-timestamp" class="tool-panel">
    <h3>Unix Epoch Timestamp Converter</h3>
    <div class="actions" style="margin-top: 12px;">
      <button class="action-btn" id="btn-ts-current" onclick="loadCurrentTime()">Get Current Epoch</button>
    </div>
    <div class="form-group" style="margin-top: 12px;">
      <label>Timestamp (Seconds or Milliseconds)</label>
      <input type="text" id="ts-input" placeholder="e.g. 1700000000 or 1700000000000" />
    </div>
    <div class="actions">
      <button class="action-btn" id="btn-ts-convert" onclick="processTimestamp()">Convert to Date</button>
    </div>
    <div class="form-group output-box">
      <label>ISO 8601 / UTC / Local Time</label>
      <textarea id="ts-output" rows="4" readonly></textarea>
    </div>
  </div>

  <!-- Case Converter Panel -->
  <div id="panel-case" class="tool-panel">
    <h3>String Case Converter</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>Input Text</label>
      <input type="text" id="case-input" placeholder="hello world developer utilities" />
    </div>
    <div class="grid-2 output-box">
      <div class="form-group">
        <label>camelCase</label>
        <input type="text" id="case-camel" readonly />
      </div>
      <div class="form-group">
        <label>PascalCase</label>
        <input type="text" id="case-pascal" readonly />
      </div>
      <div class="form-group">
        <label>snake_case</label>
        <input type="text" id="case-snake" readonly />
      </div>
      <div class="form-group">
        <label>kebab-case</label>
        <input type="text" id="case-kebab" readonly />
      </div>
      <div class="form-group" style="grid-column: 1 / -1;">
        <label>CONSTANT_CASE</label>
        <input type="text" id="case-constant" readonly />
      </div>
    </div>
  </div>

  <!-- Line Tools Panel -->
  <div id="panel-lines" class="tool-panel">
    <h3>Line Sort & Deduplicate</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>Input Lines</label>
      <textarea id="lines-input" rows="6" placeholder="zebra&#10;apple&#10;orange&#10;apple"></textarea>
    </div>
    <div class="actions">
      <button class="action-btn" id="btn-lines-sort-asc" onclick="processSortLines(false)">Sort A-Z</button>
      <button class="action-btn" id="btn-lines-sort-desc" onclick="processSortLines(true)">Sort Z-A</button>
      <button class="action-btn" id="btn-lines-dedup" onclick="processDeduplicateLines()">Deduplicate Lines</button>
      <button class="sec-btn" data-copy="lines-output" onclick="copyOutput('lines-output')">Copy Output</button>
    </div>
    <div class="form-group output-box">
      <label>Processed Lines</label>
      <textarea id="lines-output" rows="6" readonly></textarea>
    </div>
  </div>

  <!-- Color Panel -->
  <div id="panel-color" class="tool-panel">
    <h3>Color Converter (HEX & RGB)</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>HEX Color</label>
      <input type="text" id="color-hex" value="#2563eb" oninput="convertColorFromHex()" />
    </div>
    <div class="form-group output-box">
      <label>RGB Value</label>
      <input type="text" id="color-rgb" readonly />
    </div>
    <div id="color-preview" style="height: 60px; border-radius: 4px; border: 1px solid var(--border); margin-top: 10px; background-color: #2563eb;"></div>
  </div>

  <!-- Lorem Ipsum Panel -->
  <div id="panel-lorem" class="tool-panel">
    <h3>Lorem Ipsum Text Generator</h3>
    <div class="actions" style="margin-top: 12px;">
      <button class="action-btn" id="btn-lorem-1" onclick="generateLorem(1)">1 Paragraph</button>
      <button class="action-btn" id="btn-lorem-3" onclick="generateLorem(3)">3 Paragraphs</button>
      <button class="action-btn" id="btn-lorem-5" onclick="generateLorem(5)">5 Paragraphs</button>
      <button class="sec-btn" data-copy="lorem-output" onclick="copyOutput('lorem-output')">Copy Output</button>
    </div>
    <div class="form-group output-box">
      <label>Generated Placeholder Text</label>
      <textarea id="lorem-output" rows="8" readonly></textarea>
    </div>
  </div>

  <!-- Text Statistics Panel -->
  <div id="panel-stats" class="tool-panel">
    <h3>Text Statistics Analyzer</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>Input Text</label>
      <textarea id="stats-input" rows="6" placeholder="Paste or type text to inspect characters, words, lines, and byte size..."></textarea>
    </div>
    <div class="grid-2 output-box">
      <div class="form-group">
        <label>Characters</label>
        <input type="text" id="stats-chars" readonly value="0" />
      </div>
      <div class="form-group">
        <label>Words</label>
        <input type="text" id="stats-words" readonly value="0" />
      </div>
      <div class="form-group">
        <label>Lines</label>
        <input type="text" id="stats-lines" readonly value="0" />
      </div>
      <div class="form-group">
        <label>Bytes (UTF-8)</label>
        <input type="text" id="stats-bytes" readonly value="0" />
      </div>
    </div>
  </div>

  <!-- cURL Panel -->
  <div id="panel-curl" class="tool-panel">
    <h3>cURL to Code Converter</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>cURL Command</label>
      <textarea id="curl-input" rows="5" placeholder='curl -X POST "https://api.example.com/items" -H "Content-Type: application/json" -d "{\"name\":\"Widget\"}"'></textarea>
    </div>
    <div class="actions">
      <button class="action-btn" id="btn-curl-fetch" onclick="processCurl('fetch')">Convert to Fetch (JS)</button>
      <button class="action-btn" id="btn-curl-python" onclick="processCurl('python')">Convert to Python (requests)</button>
      <button class="sec-btn" id="btn-curl-sample" onclick="loadSample('curl')">Load Sample</button>
      <button class="sec-btn" data-copy="curl-output" onclick="copyOutput('curl-output')">Copy Output</button>
    </div>
    <div class="form-group output-box">
      <label>Generated Code</label>
      <textarea id="curl-output" rows="8" readonly></textarea>
      <div id="curl-status" class="status-msg"></div>
    </div>
  </div>

  <!-- JSON to TypeScript Panel -->
  <div id="panel-ts" class="tool-panel">
    <h3>JSON to TypeScript Interface Generator</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>JSON Object or Array</label>
      <textarea id="ts-input" rows="6" placeholder='{"id": 1, "username": "alice", "roles": ["admin"], "profile": {"age": 30}}'></textarea>
    </div>
    <div class="actions">
      <button class="action-btn" id="btn-ts-generate" onclick="processJsonToTs()">Generate Interfaces</button>
      <button class="sec-btn" id="btn-ts-sample" onclick="loadSample('ts')">Load Sample</button>
      <button class="sec-btn" data-copy="ts-output" onclick="copyOutput('ts-output')">Copy Interfaces</button>
    </div>
    <div class="form-group output-box">
      <label>TypeScript Interfaces</label>
      <textarea id="ts-output" rows="8" readonly></textarea>
      <div id="ts-status" class="status-msg"></div>
    </div>
  </div>

  <!-- Cron Explainer Panel -->
  <div id="panel-cron" class="tool-panel">
    <h3>Cron Expression Explainer & Humanizer</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>Cron Expression (5 fields: min hour dom mon dow)</label>
      <input type="text" id="cron-input" placeholder="*/15 9-17 * * 1-5" />
    </div>
    <div class="actions">
      <button class="action-btn" id="btn-cron-explain" onclick="processCron()">Explain Expression</button>
      <button class="sec-btn" id="btn-cron-sample" onclick="loadSample('cron')">Load Sample</button>
    </div>
    <div class="form-group output-box">
      <label>Human Readable Meaning</label>
      <textarea id="cron-output" rows="3" readonly></textarea>
      <div id="cron-status" class="status-msg"></div>
    </div>
  </div>

  <script nonce="${nonce}">
    (function() {
      // Tab switching
      function switchTab(name, targetBtn) {
        document.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.tool-panel').forEach(function(p) { p.classList.remove('active'); });
        if (targetBtn) {
          targetBtn.classList.add('active');
        }
        var targetPanel = document.getElementById('panel-' + name);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      }

      window.switchTab = switchTab;

      document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var tabName = btn.getAttribute('data-tab');
          if (tabName) {
            switchTab(tabName, btn);
          }
        });
      });

      // Copy output helper
      function copyOutput(id) {
        var el = document.getElementById(id);
        if (el && el.value) {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(el.value);
          } else {
            el.select();
            document.execCommand('copy');
          }
        }
      }
      window.copyOutput = copyOutput;

      document.querySelectorAll('[data-copy]').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var targetId = btn.getAttribute('data-copy');
          if (targetId) {
            copyOutput(targetId);
          }
        });
      });

      // Sample Data Loader
      var sampleData = {
        b64: 'Hello, DevUtils! 🛠️ All-in-one developer toolbox.',
        json: '{"app":"DevUtils","version":"0.2.1","offline":true,"features":["Base64","JSON","SQL","CSV","JWT"]}',
        xml: '<project name="DevUtils"><version>0.2.1</version><author><name>Techwasti</name></author></project>',
        sql: 'select u.id, u.name, u.email from users u inner join orders o on u.id = o.user_id where u.active = 1 and o.status = "completed" order by o.created_at desc limit 20',
        csv: 'id,product,category,price,in_stock\n101,VS Code Extension,Developer Tools,0.00,true\n102,Offline Dashboard,Utilities,0.00,true\n103,Code Formatter,Productivity,0.00,true',
        jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlRlY2h3YXN0aSBEZXZlbG9wZXIiLCJhZG1pbiI6dHJ1ZSwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5OTk5OTk5OTl9.4S88qTfV2E1W2u0Jd6o2aB3r3k0v_6x7Y8z9A1b2C3D',
        curl: 'curl -X POST "https://api.techwasti.com/v1/auth" -H "Content-Type: application/json" -H "Authorization: Bearer mySecretToken" -d \'{"username":"developer","remember":true}\'',
        ts: '{"id":1001,"title":"DevUtils","public":true,"meta":{"views":1540,"rating":4.9},"tags":["vscode","utilities","offline"]}',
        cron: '*/15 9-17 * * 1-5'
      };

      function loadSample(tool) {
        if (tool === 'b64') {
          var el = document.getElementById('b64-input');
          if (el) { el.value = sampleData.b64; processBase64(true); }
        } else if (tool === 'json') {
          var el = document.getElementById('json-input');
          if (el) { el.value = sampleData.json; processJson(true); }
        } else if (tool === 'xml') {
          var el = document.getElementById('xml-input');
          if (el) { el.value = sampleData.xml; processXml(true); }
        } else if (tool === 'sql') {
          var el = document.getElementById('sql-input');
          if (el) { el.value = sampleData.sql; processSql(); }
        } else if (tool === 'csv') {
          var el = document.getElementById('csv-input');
          if (el) { el.value = sampleData.csv; processCsvToJson(); }
        } else if (tool === 'jwt') {
          var el = document.getElementById('jwt-input');
          if (el) { el.value = sampleData.jwt; processJwt(); }
        } else if (tool === 'curl') {
          var el = document.getElementById('curl-input');
          if (el) { el.value = sampleData.curl; processCurl('fetch'); }
        } else if (tool === 'ts') {
          var el = document.getElementById('ts-input');
          if (el) { el.value = sampleData.ts; processJsonToTs(); }
        } else if (tool === 'cron') {
          var el = document.getElementById('cron-input');
          if (el) { el.value = sampleData.cron; processCron(); }
        }
      }
      window.loadSample = loadSample;

      var btnB64Sample = document.getElementById('btn-b64-sample');
      if (btnB64Sample) btnB64Sample.addEventListener('click', function() { loadSample('b64'); });

      var btnJsonSample = document.getElementById('btn-json-sample');
      if (btnJsonSample) btnJsonSample.addEventListener('click', function() { loadSample('json'); });

      var btnXmlSample = document.getElementById('btn-xml-sample');
      if (btnXmlSample) btnXmlSample.addEventListener('click', function() { loadSample('xml'); });

      var btnSqlSample = document.getElementById('btn-sql-sample');
      if (btnSqlSample) btnSqlSample.addEventListener('click', function() { loadSample('sql'); });

      var btnCsvSample = document.getElementById('btn-csv-sample');
      if (btnCsvSample) btnCsvSample.addEventListener('click', function() { loadSample('csv'); });

      var btnJwtSample = document.getElementById('btn-jwt-sample');
      if (btnJwtSample) btnJwtSample.addEventListener('click', function() { loadSample('jwt'); });

      var btnCurlSample = document.getElementById('btn-curl-sample');
      if (btnCurlSample) btnCurlSample.addEventListener('click', function() { loadSample('curl'); });

      var btnTsSample = document.getElementById('btn-ts-sample');
      if (btnTsSample) btnTsSample.addEventListener('click', function() { loadSample('ts'); });

      var btnCronSample = document.getElementById('btn-cron-sample');
      if (btnCronSample) btnCronSample.addEventListener('click', function() { loadSample('cron'); });

      // Base64 & URL
      function processBase64(isEncode) {
        var inputEl = document.getElementById('b64-input');
        var outputEl = document.getElementById('b64-output');
        var status = document.getElementById('b64-status');
        var val = inputEl ? inputEl.value : '';
        try {
          if (isEncode) {
            outputEl.value = btoa(unescape(encodeURIComponent(val)));
          } else {
            outputEl.value = decodeURIComponent(escape(atob(val.trim())));
          }
          status.textContent = 'Success!';
          status.className = 'status-msg success';
        } catch (e) {
          status.textContent = 'Error: ' + e.message;
          status.className = 'status-msg error';
        }
      }
      window.processBase64 = processBase64;

      function processUrl(isEncode) {
        var inputEl = document.getElementById('b64-input');
        var outputEl = document.getElementById('b64-output');
        var val = inputEl ? inputEl.value : '';
        outputEl.value = isEncode ? encodeURIComponent(val) : decodeURIComponent(val);
      }
      window.processUrl = processUrl;

      var btnB64Enc = document.getElementById('btn-b64-encode');
      if (btnB64Enc) btnB64Enc.addEventListener('click', function() { processBase64(true); });

      var btnB64Dec = document.getElementById('btn-b64-decode');
      if (btnB64Dec) btnB64Dec.addEventListener('click', function() { processBase64(false); });

      var btnUrlEnc = document.getElementById('btn-url-encode');
      if (btnUrlEnc) btnUrlEnc.addEventListener('click', function() { processUrl(true); });

      var btnUrlDec = document.getElementById('btn-url-decode');
      if (btnUrlDec) btnUrlDec.addEventListener('click', function() { processUrl(false); });

      function processHex(isEncode) {
        var inputEl = document.getElementById('b64-input');
        var outputEl = document.getElementById('b64-output');
        var status = document.getElementById('b64-status');
        var val = inputEl ? inputEl.value : '';
        try {
          if (isEncode) {
            var enc = new TextEncoder();
            var bytes = enc.encode(val);
            var hex = '';
            for (var i = 0; i < bytes.length; i++) {
              hex += bytes[i].toString(16).padStart(2, '0');
            }
            outputEl.value = hex;
          } else {
            var cleanHex = val.trim().replace(/\s+/g, '');
            if (cleanHex.length % 2 !== 0) throw new Error('Hex string must have an even number of characters');
            var bytesArr = [];
            for (var h = 0; h < cleanHex.length; h += 2) {
              bytesArr.push(parseInt(cleanHex.substring(h, h + 2), 16));
            }
            var dec = new TextDecoder();
            outputEl.value = dec.decode(new Uint8Array(bytesArr));
          }
          status.textContent = 'Success!';
          status.className = 'status-msg success';
        } catch (e) {
          status.textContent = 'Error: ' + e.message;
          status.className = 'status-msg error';
        }
      }
      window.processHex = processHex;

      var btnHexEnc = document.getElementById('btn-hex-encode');
      if (btnHexEnc) btnHexEnc.addEventListener('click', function() { processHex(true); });

      var btnHexDec = document.getElementById('btn-hex-decode');
      if (btnHexDec) btnHexDec.addEventListener('click', function() { processHex(false); });

      // JSON Formatter & Minifier
      function processJson(prettify) {
        var inputEl = document.getElementById('json-input');
        var outputEl = document.getElementById('json-output');
        var status = document.getElementById('json-status');
        var val = inputEl ? inputEl.value : '';
        try {
          var obj = JSON.parse(val);
          outputEl.value = prettify ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
          status.textContent = 'Valid JSON!';
          status.className = 'status-msg success';
        } catch (e) {
          status.textContent = 'Invalid JSON: ' + e.message;
          status.className = 'status-msg error';
        }
      }
      window.processJson = processJson;

      var btnJsonFmt = document.getElementById('btn-json-format');
      if (btnJsonFmt) btnJsonFmt.addEventListener('click', function() { processJson(true); });

      var btnJsonMin = document.getElementById('btn-json-minify');
      if (btnJsonMin) btnJsonMin.addEventListener('click', function() { processJson(false); });

      // XML Formatter & Minifier
      function processXml(format) {
        var inputEl = document.getElementById('xml-input');
        var outputEl = document.getElementById('xml-output');
        var val = inputEl ? inputEl.value : '';
        if (!format) {
          outputEl.value = val.replace(/>\s+/g, '><').trim();
          return;
        }
        var formatted = '';
        var indent = 0;
        var tab = '  ';
        var xml = val.replace(/(>)(<)(\/*)/g, '$1\r\n$2$3');
        var lines = xml.split('\r\n');
        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (!line) continue;
          if (line.match(/^<\/\w/)) {
            if (indent > 0) indent--;
          }
          formatted += tab.repeat(indent) + line + '\n';
          if (line.match(/^<\w[^>]*[^\/]>/) && !line.match(/^<\w[^>]*\/>/)) {
            if (!line.match(/<\/[^>]+>$/)) {
              indent++;
            }
          }
        }
        outputEl.value = formatted.trim();
      }
      window.processXml = processXml;

      var btnXmlFmt = document.getElementById('btn-xml-format');
      if (btnXmlFmt) btnXmlFmt.addEventListener('click', function() { processXml(true); });

      var btnXmlMin = document.getElementById('btn-xml-minify');
      if (btnXmlMin) btnXmlMin.addEventListener('click', function() { processXml(false); });

      // SQL Formatter
      function processSql() {
        var inputEl = document.getElementById('sql-input');
        var outputEl = document.getElementById('sql-output');
        var status = document.getElementById('sql-status');
        var sql = inputEl ? inputEl.value : '';
        if (!sql.trim()) {
          outputEl.value = '';
          return;
        }
        try {
          var keywords = [
            'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'ORDER BY', 'GROUP BY', 'HAVING',
            'LIMIT', 'OFFSET', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'OUTER JOIN',
            'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM', 'CREATE TABLE', 'DROP TABLE',
            'ALTER TABLE', 'UNION', 'UNION ALL'
          ];
          var cleaned = sql.replace(/\s+/g, ' ').trim();
          for (var k = 0; k < keywords.length; k++) {
            var kw = keywords[k];
            var regex = new RegExp('\\\\b' + kw + '\\\\b', 'gi');
            cleaned = cleaned.replace(regex, '\\n' + kw);
          }
          var lines = cleaned.split('\\n').map(function(l) { return l.trim(); }).filter(Boolean);
          var indent = 0;
          var formatted = [];
          for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.match(/^(SELECT|INSERT|UPDATE|DELETE|CREATE|FROM|WHERE|ORDER BY|GROUP BY|HAVING|SET|VALUES)/i)) {
              indent = 0;
            } else if (line.match(/^(AND|OR|JOIN|LEFT JOIN|RIGHT JOIN|INNER JOIN)/i)) {
              indent = 1;
            }
            formatted.push('  '.repeat(indent) + line);
          }
          outputEl.value = formatted.join('\\n').trim();
          status.textContent = 'Formatted SQL successfully!';
          status.className = 'status-msg success';
        } catch (e) {
          status.textContent = 'Error: ' + e.message;
          status.className = 'status-msg error';
        }
      }
      window.processSql = processSql;

      var btnSqlFmt = document.getElementById('btn-sql-format');
      if (btnSqlFmt) btnSqlFmt.addEventListener('click', processSql);

      // CSV <-> JSON Converter
      function processCsvToJson() {
        var inputEl = document.getElementById('csv-input');
        var outputEl = document.getElementById('csv-output');
        var status = document.getElementById('csv-status');
        var val = inputEl ? inputEl.value.trim() : '';
        try {
          var lines = val.split(/\r?\n/).filter(Boolean);
          if (lines.length === 0) {
            outputEl.value = '[]';
            return;
          }
          var headers = lines[0].split(',').map(function(h) { return h.trim().replace(/^["']|["']$/g, ''); });
          var list = [];
          for (var i = 1; i < lines.length; i++) {
            var parts = lines[i].split(',').map(function(item) { return item.trim().replace(/^["']|["']$/g, ''); });
            var obj = {};
            for (var j = 0; j < headers.length; j++) {
              var v = parts[j] !== undefined ? parts[j] : '';
              if (!isNaN(Number(v)) && v !== '') {
                v = Number(v);
              } else if (v.toLowerCase() === 'true') {
                v = true;
              } else if (v.toLowerCase() === 'false') {
                v = false;
              }
              obj[headers[j]] = v;
            }
            list.push(obj);
          }
          outputEl.value = JSON.stringify(list, null, 2);
          status.textContent = 'Converted CSV to JSON successfully!';
          status.className = 'status-msg success';
        } catch (e) {
          status.textContent = 'Error converting CSV: ' + e.message;
          status.className = 'status-msg error';
        }
      }
      window.processCsvToJson = processCsvToJson;

      function processJsonToCsv() {
        var inputEl = document.getElementById('csv-input');
        var outputEl = document.getElementById('csv-output');
        var status = document.getElementById('csv-status');
        var val = inputEl ? inputEl.value.trim() : '';
        try {
          var data = JSON.parse(val);
          var arr = Array.isArray(data) ? data : [data];
          if (arr.length === 0) {
            outputEl.value = '';
            return;
          }
          var headers = Object.keys(arr[0]);
          var rows = [headers.join(',')];
          for (var i = 0; i < arr.length; i++) {
            var item = arr[i];
            var row = headers.map(function(h) {
              var v = item[h] !== undefined ? item[h] : '';
              if (typeof v === 'object' && v !== null) v = JSON.stringify(v);
              v = String(v);
              if (v.indexOf(',') !== -1 || v.indexOf('"') !== -1 || v.indexOf('\n') !== -1) {
                v = '"' + v.replace(/"/g, '""') + '"';
              }
              return v;
            });
            rows.push(row.join(','));
          }
          outputEl.value = rows.join('\n');
          status.textContent = 'Converted JSON to CSV successfully!';
          status.className = 'status-msg success';
        } catch (e) {
          status.textContent = 'Error converting JSON to CSV: ' + e.message;
          status.className = 'status-msg error';
        }
      }
      window.processJsonToCsv = processJsonToCsv;

      var btnCsv2Json = document.getElementById('btn-csv-to-json');
      if (btnCsv2Json) btnCsv2Json.addEventListener('click', processCsvToJson);

      var btnJson2Csv = document.getElementById('btn-json-to-csv');
      if (btnJson2Csv) btnJson2Csv.addEventListener('click', processJsonToCsv);

      // JWT Inspector
      function processJwt() {
        var inputEl = document.getElementById('jwt-input');
        var status = document.getElementById('jwt-status');
        var token = inputEl ? inputEl.value.trim() : '';
        try {
          var parts = token.split('.');
          if (parts.length < 2) throw new Error('JWT must have at least header and payload segments');
          var decodeSeg = function(seg) {
            var b64 = seg.replace(/-/g, '+').replace(/_/g, '/');
            while (b64.length % 4 !== 0) b64 += '=';
            return JSON.parse(decodeURIComponent(escape(atob(b64))));
          };
          var header = decodeSeg(parts[0]);
          var payload = decodeSeg(parts[1]);
          document.getElementById('jwt-header').value = JSON.stringify(header, null, 2);
          document.getElementById('jwt-payload').value = JSON.stringify(payload, null, 2);
          
          var msg = 'Valid JWT structure.';
          if (payload.exp) {
            var exp = new Date(payload.exp * 1000);
            msg += (Date.now() > exp.getTime()) ? ' Expired at ' + exp.toISOString() : ' Valid until ' + exp.toISOString();
          }
          status.textContent = msg;
          status.className = 'status-msg success';
        } catch (e) {
          status.textContent = 'Error: ' + e.message;
          status.className = 'status-msg error';
        }
      }
      window.processJwt = processJwt;

      var btnJwtDec = document.getElementById('btn-jwt-decode');
      if (btnJwtDec) btnJwtDec.addEventListener('click', processJwt);

      // UUID & Nanoid Generators
      function generateUuidBatch(count) {
        var arr = [];
        for (var i = 0; i < count; i++) {
          if (window.crypto && window.crypto.randomUUID) {
            arr.push(window.crypto.randomUUID());
          } else {
            arr.push('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
            }));
          }
        }
        document.getElementById('uuid-output').value = arr.join('\n');
      }
      window.generateUuidBatch = generateUuidBatch;

      function generateNanoIdBatch(count) {
        var alphabet = 'useandom-26T1983_40STAkjlqyfZwhbgpvRIFnocx';
        var arr = [];
        for (var i = 0; i < count; i++) {
          var id = '';
          var bytes = new Uint8Array(21);
          if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(bytes);
          } else {
            for (var b = 0; b < 21; b++) bytes[b] = Math.floor(Math.random() * 256);
          }
          for (var j = 0; j < 21; j++) {
            id += alphabet[bytes[j] % alphabet.length];
          }
          arr.push(id);
        }
        document.getElementById('uuid-output').value = arr.join('\n');
      }
      window.generateNanoIdBatch = generateNanoIdBatch;

      var btnUuid1 = document.getElementById('btn-uuid-1');
      if (btnUuid1) btnUuid1.addEventListener('click', function() { generateUuidBatch(1); });

      var btnUuid5 = document.getElementById('btn-uuid-5');
      if (btnUuid5) btnUuid5.addEventListener('click', function() { generateUuidBatch(5); });

      var btnNanoid5 = document.getElementById('btn-nanoid-5');
      if (btnNanoid5) btnNanoid5.addEventListener('click', function() { generateNanoIdBatch(5); });

      // Timestamp
      function processTimestamp() {
        var inputEl = document.getElementById('ts-input');
        var raw = inputEl ? inputEl.value.trim() : '';
        var num = Number(raw);
        if (isNaN(num) || !raw) return;
        if (num < 10000000000) num *= 1000;
        var d = new Date(num);
        document.getElementById('ts-output').value = 
          'ISO 8601: ' + d.toISOString() + '\n' +
          'UTC:      ' + d.toUTCString() + '\n' +
          'Local:    ' + d.toString();
      }
      window.processTimestamp = processTimestamp;

      function loadCurrentTime() {
        var now = Math.floor(Date.now() / 1000);
        document.getElementById('ts-input').value = now;
        processTimestamp();
      }
      window.loadCurrentTime = loadCurrentTime;

      var btnTsCurrent = document.getElementById('btn-ts-current');
      if (btnTsCurrent) btnTsCurrent.addEventListener('click', loadCurrentTime);

      var btnTsConvert = document.getElementById('btn-ts-convert');
      if (btnTsConvert) btnTsConvert.addEventListener('click', processTimestamp);

      // Line tools
      function processSortLines(reverse) {
        var input = document.getElementById('lines-input').value;
        var lines = input.split(/\r?\n/).sort(function(a, b) { return a.localeCompare(b); });
        if (reverse) lines.reverse();
        document.getElementById('lines-output').value = lines.join('\n');
      }
      window.processSortLines = processSortLines;

      function processDeduplicateLines() {
        var input = document.getElementById('lines-input').value;
        var lines = input.split(/\r?\n/);
        var seen = {};
        var unique = [];
        for (var i = 0; i < lines.length; i++) {
          if (!seen[lines[i]]) {
            seen[lines[i]] = true;
            unique.push(lines[i]);
          }
        }
        document.getElementById('lines-output').value = unique.join('\n');
      }
      window.processDeduplicateLines = processDeduplicateLines;

      var btnSortAsc = document.getElementById('btn-lines-sort-asc');
      if (btnSortAsc) btnSortAsc.addEventListener('click', function() { processSortLines(false); });

      var btnSortDesc = document.getElementById('btn-lines-sort-desc');
      if (btnSortDesc) btnSortDesc.addEventListener('click', function() { processSortLines(true); });

      var btnDedup = document.getElementById('btn-lines-dedup');
      if (btnDedup) btnDedup.addEventListener('click', processDeduplicateLines);

      // Color Converter
      function convertColorFromHex() {
        var hexInput = document.getElementById('color-hex');
        if (!hexInput) return;
        var hex = hexInput.value.replace('#', '').trim();
        if (hex.length === 3) hex = hex.split('').map(function(x) { return x + x; }).join('');
        if (hex.length === 6) {
          var r = parseInt(hex.substring(0, 2), 16);
          var g = parseInt(hex.substring(2, 4), 16);
          var b = parseInt(hex.substring(4, 6), 16);
          var rgb = 'rgb(' + r + ', ' + g + ', ' + b + ')';
          document.getElementById('color-rgb').value = rgb;
          document.getElementById('color-preview').style.backgroundColor = rgb;
        }
      }

      var colorHexInput = document.getElementById('color-hex');
      if (colorHexInput) {
        colorHexInput.addEventListener('input', convertColorFromHex);
      }
      convertColorFromHex();

      // Live case converter
      var caseInput = document.getElementById('case-input');
      if (caseInput) {
        caseInput.addEventListener('input', function(e) {
          var text = e.target.value;
          var words = text.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[-_.\s]+/g, ' ').trim().split(' ').filter(Boolean);
          if (words.length === 0) {
            document.getElementById('case-camel').value = '';
            document.getElementById('case-pascal').value = '';
            document.getElementById('case-snake').value = '';
            document.getElementById('case-kebab').value = '';
            document.getElementById('case-constant').value = '';
            return;
          }
          document.getElementById('case-camel').value = words[0].toLowerCase() + words.slice(1).map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }).join('');
          document.getElementById('case-pascal').value = words.map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }).join('');
          document.getElementById('case-snake').value = words.map(function(w) { return w.toLowerCase(); }).join('_');
          document.getElementById('case-kebab').value = words.map(function(w) { return w.toLowerCase(); }).join('-');
          document.getElementById('case-constant').value = words.map(function(w) { return w.toUpperCase(); }).join('_');
        });
      }

      // Hash live calculation using Web Crypto API
      var hashInput = document.getElementById('hash-input');
      if (hashInput) {
        hashInput.addEventListener('input', async function(e) {
          var val = e.target.value;
          if (!val) {
            document.getElementById('hash-sha256').value = '';
            document.getElementById('hash-sha1').value = '';
            return;
          }
          try {
            var enc = new TextEncoder();
            var buf = enc.encode(val);
            var sha256Buf = await window.crypto.subtle.digest('SHA-256', buf);
            var sha1Buf = await window.crypto.subtle.digest('SHA-1', buf);
            
            var toHex = function(b) {
              return Array.from(new Uint8Array(b)).map(function(x) { return x.toString(16).padStart(2, '0'); }).join('');
            };
            document.getElementById('hash-sha256').value = toHex(sha256Buf);
            document.getElementById('hash-sha1').value = toHex(sha1Buf);
            document.getElementById('hash-md5').value = '(Available via Command Palette MD5 command)';
          } catch (err) {
          }
        });
      }

      // Lorem Ipsum Generator
      var loremPhrases = [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'Curabitur pretium tincidunt lacus nulla gravida orci a odio tempus dictum.',
        'Maecenas tristique orci ac sem duis ultricies pharetra magna donec accumsan malesuada.'
      ];

      function generateLorem(paragraphs) {
        var result = [];
        for (var p = 0; p < paragraphs; p++) {
          var count = 3 + (p % 3);
          var sent = [];
          for (var i = 0; i < count; i++) {
            sent.push(loremPhrases[(p * 2 + i) % loremPhrases.length]);
          }
          result.push(sent.join(' '));
        }
        document.getElementById('lorem-output').value = result.join('\n\n');
      }
      window.generateLorem = generateLorem;

      var btnLorem1 = document.getElementById('btn-lorem-1');
      if (btnLorem1) btnLorem1.addEventListener('click', function() { generateLorem(1); });

      var btnLorem3 = document.getElementById('btn-lorem-3');
      if (btnLorem3) btnLorem3.addEventListener('click', function() { generateLorem(3); });

      var btnLorem5 = document.getElementById('btn-lorem-5');
      if (btnLorem5) btnLorem5.addEventListener('click', function() { generateLorem(5); });

      // Text Statistics Analyzer
      var statsInput = document.getElementById('stats-input');
      if (statsInput) {
        statsInput.addEventListener('input', function(e) {
          var val = e.target.value;
          var chars = val.length;
          var words = val.trim() ? val.trim().split(/\s+/).length : 0;
          var lines = val ? val.split(/\r?\n/).length : 0;
          var bytes = new TextEncoder().encode(val).length;
          document.getElementById('stats-chars').value = chars;
          document.getElementById('stats-words').value = words;
          document.getElementById('stats-lines').value = lines;
          document.getElementById('stats-bytes').value = bytes;
        });
      }

      // cURL to Code Processor
      function processCurl(targetLang) {
        var inputEl = document.getElementById('curl-input');
        var outputEl = document.getElementById('curl-output');
        var status = document.getElementById('curl-status');
        var cmd = inputEl ? inputEl.value.trim() : '';
        if (!cmd) return;
        try {
          var clean = cmd.replace(/\\\r?\n/g, ' ').trim();
          var method = 'GET';
          var url = '';
          var headers = {};
          var data = undefined;

          var argRegex = /(-[A-Za-z]|--[A-Za-z-]+)(?:\s+(?:'([^']*)'|"([^"]*)"|([^\s]+)))?/g;
          var match;
          var urlMatch = clean.match(/(?:curl\s+)?(?:'([^']*)'|"([^"]*)"|(https?:\/\/[^\s'"]+))/i);
          if (urlMatch) url = urlMatch[1] || urlMatch[2] || urlMatch[3] || '';

          while ((match = argRegex.exec(clean)) !== null) {
            var flag = match[1];
            var val = match[2] !== undefined ? match[2] : (match[3] !== undefined ? match[3] : (match[4] || ''));
            if (flag === '-X' || flag === '--request') method = val.toUpperCase();
            else if (flag === '-H' || flag === '--header') {
              var cIdx = val.indexOf(':');
              if (cIdx > -1) headers[val.substring(0, cIdx).trim()] = val.substring(cIdx + 1).trim();
            } else if (flag === '-d' || flag === '--data' || flag === '--data-raw') {
              data = val;
              if (method === 'GET') method = 'POST';
            }
          }
          if (!url) {
            var parts = clean.split(/\s+/);
            for (var p = 0; p < parts.length; p++) {
              if (parts[p].startsWith('http://') || parts[p].startsWith('https://')) {
                url = parts[p].replace(/['"]/g, '');
                break;
              }
            }
          }
          url = url || 'https://api.example.com/data';

          if (targetLang === 'fetch') {
            var opts = { method: method };
            if (Object.keys(headers).length > 0) opts.headers = headers;
            var bodyCode = '';
            if (data) {
              try { bodyCode = ',\n  body: JSON.stringify(' + JSON.stringify(JSON.parse(data), null, 2) + ')'; }
              catch(e) { bodyCode = ',\n  body: ' + JSON.stringify(data); }
            }
            var hStr = Object.keys(headers).length > 0 ? ',\n  headers: ' + JSON.stringify(headers, null, 2) : '';
            outputEl.value = '// JavaScript Fetch\nfetch("' + url + '", {\n  method: "' + method + '"' + hStr + bodyCode + '\n})\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));';
          } else {
            var pyLines = ['import requests', ''];
            var pyArgs = ['"' + url + '"'];
            if (Object.keys(headers).length > 0) {
              pyLines.push('headers = ' + JSON.stringify(headers, null, 4));
              pyArgs.push('headers=headers');
            }
            if (data) {
              try {
                pyLines.push('data = ' + JSON.stringify(JSON.parse(data), null, 4));
                pyArgs.push('json=data');
              } catch(e) {
                pyLines.push('data = ' + JSON.stringify(data));
                pyArgs.push('data=data');
              }
            }
            pyLines.push('');
            pyLines.push('response = requests.' + method.toLowerCase() + '(' + pyArgs.join(', ') + ')');
            pyLines.push('print(response.status_code)');
            pyLines.push('print(response.json())');
            outputEl.value = pyLines.join('\n');
          }
          status.textContent = 'Generated code successfully!';
          status.className = 'status-msg success';
        } catch(err) {
          status.textContent = 'Error parsing cURL: ' + err.message;
          status.className = 'status-msg error';
        }
      }
      window.processCurl = processCurl;

      var btnCurlFetch = document.getElementById('btn-curl-fetch');
      if (btnCurlFetch) btnCurlFetch.addEventListener('click', function() { processCurl('fetch'); });

      var btnCurlPy = document.getElementById('btn-curl-python');
      if (btnCurlPy) btnCurlPy.addEventListener('click', function() { processCurl('python'); });

      // JSON to TypeScript Interfaces
      function processJsonToTs() {
        var inputEl = document.getElementById('ts-input');
        var outputEl = document.getElementById('ts-output');
        var status = document.getElementById('ts-status');
        var val = inputEl ? inputEl.value.trim() : '';
        if (!val) return;
        try {
          var data = JSON.parse(val);
          var ifaces = {};
          function capitalize(str) { return str.charAt(0).toUpperCase() + str.slice(1); }
          function getType(v, prop) {
            if (v === null || v === undefined) return 'any';
            if (typeof v === 'string') return 'string';
            if (typeof v === 'number') return 'number';
            if (typeof v === 'boolean') return 'boolean';
            if (Array.isArray(v)) {
              if (v.length === 0) return 'any[]';
              var sub = getType(v[0], prop.endsWith('s') ? prop.slice(0, -1) : prop + 'Item');
              return sub + '[]';
            }
            if (typeof v === 'object') {
              var cName = capitalize(prop);
              buildIface(v, cName);
              return cName;
            }
            return 'any';
          }
          function buildIface(obj, name) {
            if (ifaces[name]) return;
            var props = {};
            for (var k in obj) { props[k] = getType(obj[k], k); }
            ifaces[name] = props;
          }
          if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
            buildIface(data[0], 'RootObject');
          } else if (typeof data === 'object' && data !== null) {
            buildIface(data, 'RootObject');
          }
          var out = [];
          for (var iName in ifaces) {
            out.push('export interface ' + iName + ' {');
            for (var p in ifaces[iName]) {
              out.push('  ' + p + ': ' + ifaces[iName][p] + ';');
            }
            out.push('}\n');
          }
          outputEl.value = out.join('\n').trim();
          status.textContent = 'TypeScript interfaces generated!';
          status.className = 'status-msg success';
        } catch(err) {
          status.textContent = 'Error parsing JSON: ' + err.message;
          status.className = 'status-msg error';
        }
      }
      window.processJsonToTs = processJsonToTs;

      var btnTsGen = document.getElementById('btn-ts-generate');
      if (btnTsGen) btnTsGen.addEventListener('click', processJsonToTs);

      // Cron Explainer
      function processCron() {
        var inputEl = document.getElementById('cron-input');
        var outputEl = document.getElementById('cron-output');
        var status = document.getElementById('cron-status');
        var val = inputEl ? inputEl.value.trim() : '';
        if (!val) return;
        try {
          var parts = val.split(/\s+/);
          if (parts.length < 5) throw new Error('Requires 5 fields (min hour dom mon dow)');
          var min = parts[0], hour = parts[1], dom = parts[2], mon = parts[3], dow = parts[4];
          var monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
          var desc = [];
          if (min === '*') desc.push('every minute');
          else if (min.startsWith('*/')) desc.push('every ' + min.substring(2) + ' minutes');
          else desc.push('at minute ' + min);

          if (hour.startsWith('*/')) desc.push('every ' + hour.substring(2) + ' hours');
          else if (hour.includes('-')) desc.push('between hours ' + hour);
          else if (hour !== '*') desc.push('past hour ' + hour + ':00');

          if (dom !== '*') desc.push('on day-of-month ' + dom);
          if (mon !== '*') desc.push('in ' + (monthNames[parseInt(mon, 10)] || mon));
          if (dow !== '*') {
            if (dow === '1-5') desc.push('Monday through Friday');
            else desc.push('on ' + (dayNames[parseInt(dow, 10)] || dow));
          }
          var text = desc.join(', ');
          outputEl.value = text.charAt(0).toUpperCase() + text.slice(1);
          status.textContent = 'Cron explained!';
          status.className = 'status-msg success';
        } catch(err) {
          status.textContent = 'Error: ' + err.message;
          status.className = 'status-msg error';
        }
      }
      window.processCron = processCron;

      var btnCronExp = document.getElementById('btn-cron-explain');
      if (btnCronExp) btnCronExp.addEventListener('click', processCron);
    })();
  </script>
</body>
</html>`;
}

let currentPanel: vscode.WebviewPanel | undefined = undefined;

export function createOrShowDashboard(extensionUri: vscode.Uri) {
  if (currentPanel) {
    currentPanel.reveal(vscode.ViewColumn.One);
    return;
  }

  currentPanel = vscode.window.createWebviewPanel(
    'devutilsDashboard',
    'DevUtils Dashboard',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  const nonce = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2);
  currentPanel.webview.html = getWebviewContent(currentPanel.webview.cspSource, nonce);

  currentPanel.onDidDispose(() => {
    currentPanel = undefined;
  });
}
