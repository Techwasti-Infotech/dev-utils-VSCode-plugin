import * as vscode from 'vscode';
import {
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
  htmlEncode,
  htmlDecode,
  formatJson,
  minifyJson,
  decodeJwt,
  generateUuidV4,
  generateHash,
  timestampToDate,
  getCurrentTimestamp,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toConstantCase
} from '../utils/coreUtils';

export function getWebviewContent(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
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
    <button class="tab-btn active" onclick="switchTab('base64')">Base64</button>
    <button class="tab-btn" onclick="switchTab('json')">JSON Formatter</button>
    <button class="tab-btn" onclick="switchTab('jwt')">JWT Inspector</button>
    <button class="tab-btn" onclick="switchTab('uuid')">UUID / Generator</button>
    <button class="tab-btn" onclick="switchTab('hash')">Hash Checksum</button>
    <button class="tab-btn" onclick="switchTab('timestamp')">Epoch Timestamp</button>
    <button class="tab-btn" onclick="switchTab('case')">Case Converter</button>
  </div>

  <!-- Base64 Panel -->
  <div id="panel-base64" class="tool-panel active">
    <h3>Base64 Encode & Decode</h3>
    <div class="form-group" style="margin-top: 12px;">
      <label>Input Text</label>
      <textarea id="b64-input" rows="5" placeholder="Enter text to encode or base64 string to decode..."></textarea>
    </div>
    <div class="actions">
      <button class="action-btn" onclick="processBase64(true)">Encode to Base64</button>
      <button class="action-btn" onclick="processBase64(false)">Decode from Base64</button>
      <button class="sec-btn" onclick="copyOutput('b64-output')">Copy Output</button>
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
      <button class="action-btn" onclick="processJson(true)">Prettify / Format (2 spaces)</button>
      <button class="action-btn" onclick="processJson(false)">Minify / Compact</button>
      <button class="sec-btn" onclick="copyOutput('json-output')">Copy Output</button>
    </div>
    <div class="form-group output-box">
      <label>Formatted Output</label>
      <textarea id="json-output" rows="6" readonly></textarea>
      <div id="json-status" class="status-msg"></div>
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
      <button class="action-btn" onclick="processJwt()">Inspect & Decode Token</button>
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

  <!-- UUID Panel -->
  <div id="panel-uuid" class="tool-panel">
    <h3>UUID Generator</h3>
    <div class="actions" style="margin-top: 12px;">
      <button class="action-btn" onclick="generateUuidBatch(1)">Generate 1 UUID</button>
      <button class="action-btn" onclick="generateUuidBatch(5)">Generate 5 UUIDs</button>
      <button class="action-btn" onclick="generateUuidBatch(10)">Generate 10 UUIDs</button>
      <button class="sec-btn" onclick="copyOutput('uuid-output')">Copy to Clipboard</button>
    </div>
    <div class="form-group output-box">
      <label>Generated UUIDs</label>
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
      <button class="action-btn" onclick="loadCurrentTime()">Get Current Epoch</button>
    </div>
    <div class="form-group" style="margin-top: 12px;">
      <label>Timestamp (Seconds or Milliseconds)</label>
      <input type="text" id="ts-input" placeholder="e.g. 1700000000 or 1700000000000" />
    </div>
    <div class="actions">
      <button class="action-btn" onclick="processTimestamp()">Convert to Date</button>
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

  <script>
    const vscode = acquireVsCodeApi();

    function switchTab(name) {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
      event.target.classList.add('active');
      document.getElementById('panel-' + name).classList.add('active');
    }

    function copyOutput(id) {
      const el = document.getElementById(id);
      if (el && el.value) {
        navigator.clipboard.writeText(el.value);
      }
    }

    function processBase64(isEncode) {
      const val = document.getElementById('b64-input').value;
      const status = document.getElementById('b64-status');
      try {
        if (isEncode) {
          document.getElementById('b64-output').value = btoa(unescape(encodeURIComponent(val)));
        } else {
          document.getElementById('b64-output').value = decodeURIComponent(escape(atob(val)));
        }
        status.textContent = 'Success!';
        status.className = 'status-msg success';
      } catch (e) {
        status.textContent = 'Error: ' + e.message;
        status.className = 'status-msg error';
      }
    }

    function processJson(prettify) {
      const val = document.getElementById('json-input').value;
      const status = document.getElementById('json-status');
      try {
        const obj = JSON.parse(val);
        document.getElementById('json-output').value = prettify ? JSON.stringify(obj, null, 2) : JSON.stringify(obj);
        status.textContent = 'Valid JSON!';
        status.className = 'status-msg success';
      } catch (e) {
        status.textContent = 'Invalid JSON: ' + e.message;
        status.className = 'status-msg error';
      }
    }

    function processJwt() {
      const token = document.getElementById('jwt-input').value.trim();
      const status = document.getElementById('jwt-status');
      try {
        const parts = token.split('.');
        if (parts.length < 2) throw new Error('JWT must have header and payload');
        const decodeSeg = seg => {
          let b64 = seg.replace(/-/g, '+').replace(/_/g, '/');
          while (b64.length % 4 !== 0) b64 += '=';
          return JSON.parse(decodeURIComponent(escape(atob(b64))));
        };
        const header = decodeSeg(parts[0]);
        const payload = decodeSeg(parts[1]);
        document.getElementById('jwt-header').value = JSON.stringify(header, null, 2);
        document.getElementById('jwt-payload').value = JSON.stringify(payload, null, 2);
        
        let msg = 'Valid JWT structure.';
        if (payload.exp) {
          const exp = new Date(payload.exp * 1000);
          msg += (Date.now() > exp.getTime()) ? ' Expired at ' + exp.toISOString() : ' Valid until ' + exp.toISOString();
        }
        status.textContent = msg;
        status.className = 'status-msg success';
      } catch (e) {
        status.textContent = 'Error: ' + e.message;
        status.className = 'status-msg error';
      }
    }

    function generateUuidBatch(count) {
      const arr = [];
      for (let i = 0; i < count; i++) {
        arr.push(crypto.randomUUID());
      }
      document.getElementById('uuid-output').value = arr.join('\\n');
    }

    function loadCurrentTime() {
      const now = Math.floor(Date.now() / 1000);
      document.getElementById('ts-input').value = now;
      processTimestamp();
    }

    function processTimestamp() {
      let raw = document.getElementById('ts-input').value.trim();
      let num = Number(raw);
      if (isNaN(num)) return;
      if (num < 10000000000) num *= 1000;
      const d = new Date(num);
      document.getElementById('ts-output').value = 
        'ISO 8601: ' + d.toISOString() + '\\n' +
        'UTC:      ' + d.toUTCString() + '\\n' +
        'Local:    ' + d.toString();
    }

    // Live case converter
    document.getElementById('case-input').addEventListener('input', (e) => {
      const text = e.target.value;
      const words = text.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[-_.\s]+/g, ' ').trim().split(' ').filter(Boolean);
      if (words.length === 0) {
        document.getElementById('case-camel').value = '';
        document.getElementById('case-pascal').value = '';
        document.getElementById('case-snake').value = '';
        document.getElementById('case-kebab').value = '';
        document.getElementById('case-constant').value = '';
        return;
      }
      document.getElementById('case-camel').value = words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
      document.getElementById('case-pascal').value = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
      document.getElementById('case-snake').value = words.map(w => w.toLowerCase()).join('_');
      document.getElementById('case-kebab').value = words.map(w => w.toLowerCase()).join('-');
      document.getElementById('case-constant').value = words.map(w => w.toUpperCase()).join('_');
    });

    // Hash live calculation using Web Crypto API
    document.getElementById('hash-input').addEventListener('input', async (e) => {
      const val = e.target.value;
      if (!val) {
        document.getElementById('hash-sha256').value = '';
        document.getElementById('hash-sha1').value = '';
        return;
      }
      const enc = new TextEncoder();
      const buf = enc.encode(val);
      const sha256Buf = await crypto.subtle.digest('SHA-256', buf);
      const sha1Buf = await crypto.subtle.digest('SHA-1', buf);
      
      const toHex = b => Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
      document.getElementById('hash-sha256').value = toHex(sha256Buf);
      document.getElementById('hash-sha1').value = toHex(sha1Buf);
      // Fallback simple checksum for MD5 display in webview
      document.getElementById('hash-md5').value = '(Available via Command Palette MD5 command)';
    });
  </script>
</body>
</html>`;
}

export function createOrShowDashboard(extensionUri: vscode.Uri) {
  const panel = vscode.window.createWebviewPanel(
    'devutilsDashboard',
    'DevUtils Dashboard',
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      retainContextWhenHidden: true
    }
  );

  panel.webview.html = getWebviewContent();
}
