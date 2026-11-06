import * as vscode from 'vscode';
import { createOrShowDashboard } from './ui/dashboardPanel';
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
  propertiesToYaml
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

  // 4. HTML Entities
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.htmlEncode', () => {
      transformSelection(htmlEncode, 'HTML Encode Error');
    }),
    vscode.commands.registerCommand('devutils.htmlDecode', () => {
      transformSelection(htmlDecode, 'HTML Decode Error');
    })
  );

  // 5. Hex
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.hexEncode', () => {
      transformSelection(hexEncode, 'Hex Encode Error');
    }),
    vscode.commands.registerCommand('devutils.hexDecode', () => {
      transformSelection(hexDecode, 'Hex Decode Error');
    })
  );

  // 6. JSON & XML Formatters
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.jsonFormat', () => {
      transformSelection((t) => formatJson(t, 2), 'JSON Format Error');
    }),
    vscode.commands.registerCommand('devutils.jsonMinify', () => {
      transformSelection(minifyJson, 'JSON Minify Error');
    }),
    vscode.commands.registerCommand('devutils.xmlFormat', () => {
      transformSelection(formatXml, 'XML Format Error');
    }),
    vscode.commands.registerCommand('devutils.xmlMinify', () => {
      transformSelection(minifyXml, 'XML Minify Error');
    }),
    vscode.commands.registerCommand('devutils.sqlFormat', () => {
      transformSelection(formatSql, 'SQL Format Error');
    }),
    vscode.commands.registerCommand('devutils.csvToJson', () => {
      transformSelection(csvToJson, 'CSV to JSON Error');
    }),
    vscode.commands.registerCommand('devutils.jsonToCsv', () => {
      transformSelection(jsonToCsv, 'JSON to CSV Error');
    })
  );

  // 7. JWT Inspector
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

  // 8. Generators (UUID, Nanoid, Hashes, Timestamps, Lorem Ipsum)
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.generateUUID', () => {
      insertText(generateUuidV4());
    }),
    vscode.commands.registerCommand('devutils.generateNanoid', () => {
      insertText(generateNanoid(21));
    }),
    vscode.commands.registerCommand('devutils.generateLorem', () => {
      insertText(generateLoremIpsum(1));
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

  // 9. Case Converters
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.caseCamel', () => transformSelection(toCamelCase)),
    vscode.commands.registerCommand('devutils.caseSnake', () => transformSelection(toSnakeCase)),
    vscode.commands.registerCommand('devutils.caseKebab', () => transformSelection(toKebabCase)),
    vscode.commands.registerCommand('devutils.casePascal', () => transformSelection(toPascalCase)),
    vscode.commands.registerCommand('devutils.caseConstant', () => transformSelection(toConstantCase)),
    vscode.commands.registerCommand('devutils.caseTitle', () => transformSelection(toTitleCase))
  );

  // 10. Text & Line Tools
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.sortLines', () => transformSelection((t) => sortLines(t, false))),
    vscode.commands.registerCommand('devutils.deduplicateLines', () => transformSelection(deduplicateLines)),
    vscode.commands.registerCommand('devutils.textStats', () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const text = editor.document.getText(editor.selection.isEmpty ? undefined : editor.selection);
      const stats = countTextStats(text);
      vscode.window.showInformationMessage(
        `DevUtils Text Stats: ${stats.characters} Characters | ${stats.words} Words | ${stats.lines} Lines | ${stats.bytes} Bytes`
      );
    })
  );

  // 11. New Utilities: cURL, JSON to TS, Cron Explainer
  context.subscriptions.push(
    vscode.commands.registerCommand('devutils.curlToFetch', () => {
      transformSelection(curlToFetch, 'cURL to Fetch Error');
    }),
    vscode.commands.registerCommand('devutils.curlToPython', () => {
      transformSelection(curlToPython, 'cURL to Python Error');
    }),
    vscode.commands.registerCommand('devutils.jsonToTs', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return;
      const text = editor.document.getText(editor.selection.isEmpty ? undefined : editor.selection);
      if (!text) {
        vscode.window.showWarningMessage('DevUtils: Please select or open JSON content.');
        return;
      }
      try {
        const tsOutput = jsonToTypeScript(text, 'RootInterface');
        const doc = await vscode.workspace.openTextDocument({
          content: tsOutput,
          language: 'typescript'
        });
        vscode.window.showTextDocument(doc, { preview: true });
      } catch (err: any) {
        vscode.window.showErrorMessage(`JSON to TS Error: ${err.message}`);
      }
    }),
    vscode.commands.registerCommand('devutils.explainCron', async () => {
      const editor = vscode.window.activeTextEditor;
      let cron = editor ? editor.document.getText(editor.selection) : '';
      if (!cron) {
        cron = (await vscode.window.showInputBox({
          prompt: 'Enter standard 5-part cron expression (e.g. */15 9-17 * * 1-5)',
          placeHolder: '*/15 * * * *'
        })) || '';
      }
      if (!cron) return;
      try {
        const explanation = explainCron(cron);
        vscode.window.showInformationMessage(`DevUtils Cron: "${cron}" ➔ ${explanation}`);
      } catch (err: any) {
        vscode.window.showErrorMessage(`Cron Explain Error: ${err.message}`);
      }
    }),
    vscode.commands.registerCommand('devutils.jsonToStringified', () => {
      transformSelection(jsonToStringified, 'JSON Stringify Error');
    }),
    vscode.commands.registerCommand('devutils.stringifiedToJson', () => {
      transformSelection(stringifiedToJson, 'Unescape Stringified JSON Error');
    }),
    vscode.commands.registerCommand('devutils.formatYaml', () => {
      transformSelection(formatYaml, 'YAML Format Error');
    }),
    vscode.commands.registerCommand('devutils.yamlToJson', () => {
      transformSelection(yamlToJson, 'YAML to JSON Error');
    }),
    vscode.commands.registerCommand('devutils.jsonToYaml', () => {
      transformSelection(jsonToYaml, 'JSON to YAML Error');
    }),
    vscode.commands.registerCommand('devutils.yamlToProperties', () => {
      transformSelection(yamlToProperties, 'YAML to Properties Error');
    }),
    vscode.commands.registerCommand('devutils.propertiesToYaml', () => {
      transformSelection(propertiesToYaml, 'Properties to YAML Error');
    }),
    vscode.commands.registerCommand('devutils.openDiffViewer', async () => {
      const editor = vscode.window.activeTextEditor;
      let leftContent = editor ? editor.document.getText(editor.selection.isEmpty ? undefined : editor.selection) : '';
      if (!leftContent) {
        leftContent = (await vscode.window.showInputBox({
          prompt: 'Enter Original Text / JSON / YAML (or leave blank to paste into editor):',
          placeHolder: 'Original content...'
        })) || '';
      }

      const rightContent = (await vscode.window.showInputBox({
        prompt: 'Enter Modified Text / JSON / YAML to compare against:',
        placeHolder: 'Modified content...'
      })) || '';

      const leftDoc = await vscode.workspace.openTextDocument({
        content: leftContent,
        language: editor?.document.languageId || 'plaintext'
      });
      const rightDoc = await vscode.workspace.openTextDocument({
        content: rightContent,
        language: editor?.document.languageId || 'plaintext'
      });

      await vscode.commands.executeCommand(
        'vscode.diff',
        leftDoc.uri,
        rightDoc.uri,
        'Original ⟷ Modified (DevUtils Diff)'
      );
    })
  );
}

export function deactivate() {}
