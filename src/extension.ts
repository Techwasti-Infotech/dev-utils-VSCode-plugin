import * as vscode from 'vscode';
import { createOrShowDashboard } from './ui/dashboardPanel';
import {
  base64Encode,
  base64Decode,
  urlEncode,
  urlDecode,
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
} from './utils/coreUtils';

/**
 * Helper to transform selected text in the active editor
 */
function transformSelection(transformFn: (text: string) => string, errorPrefix: string = 'Error') {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('DevUtils: No active editor found.');
    return;
  }

  const selection = editor.selection;
  const text = editor.document.getText(selection.isEmpty ? undefined : selection);

  if (!text) {
    vscode.window.showWarningMessage('DevUtils: No text selected or file is empty.');
    return;
  }

  try {
    const result = transformFn(text);
    editor.edit((editBuilder) => {
      if (selection.isEmpty) {
        // Replace full document if nothing selected
        const fullRange = new vscode.Range(
          editor.document.positionAt(0),
          editor.document.positionAt(editor.document.getText().length)
        );
        editBuilder.replace(fullRange, result);
      } else {
        editBuilder.replace(selection, result);
      }
    });
  } catch (err: any) {
    vscode.window.showErrorMessage(`${errorPrefix}: ${err.message || err}`);
  }
}

/**
 * Helper to insert text at cursor
 */
function insertText(text: string) {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    vscode.window.showWarningMessage('DevUtils: No active editor found.');
    return;
  }
  editor.edit((editBuilder) => {
    editBuilder.insert(editor.selection.active, text);
  });
}

export function activate(context: vscode.ExtensionContext) {
  // 1. Dashboard Webview Command
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.openDashboard', () => {
      createOrShowDashboard(context.extensionUri);
    })
  );

  // 2. Base64
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.base64Encode', () => {
      transformSelection(base64Encode, 'Base64 Encode Error');
    }),
    vscode.commands.registerCommand('devutils.base64Decode', () => {
      transformSelection(base64Decode, 'Base64 Decode Error');
    })
  );

  // 3. URL
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.urlEncode', () => {
      transformSelection(urlEncode, 'URL Encode Error');
    }),
    vscode.commands.registerCommand('devutils.urlDecode', () => {
      transformSelection(urlDecode, 'URL Decode Error');
    })
  );

  // 4. JSON
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.jsonFormat', () => {
      transformSelection((t) => formatJson(t, 2), 'JSON Format Error');
    }),
    vscode.commands.registerCommand('devutils.jsonMinify', () => {
      transformSelection(minifyJson, 'JSON Minify Error');
    })
  );

  // 5. JWT Inspector
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.jwtDecode', async () => {
      const editor = vscode.window.activeTextEditor;
      let token = editor ? editor.document.getText(editor.selection) : '';

      if (!token) {
        token = (await vscode.window.showInputBox({
          prompt: 'Enter JWT token to decode',
          placeHolder: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        })) || '';
      }

      if (!token) return;

      try {
        const decoded = decodeJwt(token);
        const doc = await vscode.workspace.openTextDocument({
          content: JSON.stringify(decoded, null, 2),
          language: 'json'
        });
        vscode.window.showTextDocument(doc, { preview: true });
      } catch (err: any) {
        vscode.window.showErrorMessage(`JWT Decode Error: ${err.message}`);
      }
    })
  );

  // 6. Generators (UUID, Hashes, Timestamps)
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.generateUUID', () => {
      insertText(generateUuidV4());
    }),
    vscode.commands.registerCommand('devutils.hashSha256', () => {
      transformSelection((t) => generateHash(t, 'sha256'), 'SHA-256 Hash Error');
    }),
    vscode.commands.registerCommand('devutils.hashMd5', () => {
      transformSelection((t) => generateHash(t, 'md5'), 'MD5 Hash Error');
    }),
    vscode.commands.registerCommand('devutils.currentTimestamp', () => {
      insertText(getCurrentTimestamp().seconds.toString());
    }),
    vscode.commands.registerCommand('devutils.timestampToDate', () => {
      transformSelection((t) => {
        const res = timestampToDate(t);
        return `${res.iso} (UTC: ${res.utc})`;
      }, 'Timestamp Conversion Error');
    })
  );

  // 7. Case Converters
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.caseCamel', () => transformSelection(toCamelCase)),
    vscode.commands.registerCommand('devutils.caseSnake', () => transformSelection(toSnakeCase)),
    vscode.commands.registerCommand('devutils.caseKebab', () => transformSelection(toKebabCase)),
    vscode.commands.registerCommand('devutils.casePascal', () => transformSelection(toPascalCase)),
    vscode.commands.registerCommand('devutils.caseConstant', () => transformSelection(toConstantCase))
  );
}

export function deactivate() {}
