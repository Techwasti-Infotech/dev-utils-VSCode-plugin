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
    <button class="tab-btn" data-tab="jwt" onclick="switchTab('jwt')">JWT Inspector</button>
    <button class="tab-btn" data-tab="uuid" onclick="switchTab('uuid')">UUID / Nanoid</button>
    <button class="tab-btn" data-tab="hash" onclick="switchTab('hash')">Hash Checksum</button>
    <button class="tab-btn" data-tab="timestamp" onclick="switchTab('timestamp')">Epoch Timestamp</button>
    <button class="tab-btn" data-tab="case" onclick="switchTab('case')">Case Converter</button>
    <button class="tab-btn" data-tab="lines" onclick="switchTab('lines')">Line Tools</button>
    <button class="tab-btn" data-tab="color" onclick="switchTab('color')">Color Picker</button>
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
      <button class="sec-btn" data-copy="xml-output" onclick="copyOutput('xml-output')">Copy Output</button>
    </div>
    <div class="form-group output-box">
      <label>Output</label>
      <textarea id="xml-output" rows="6" readonly></textarea>
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
