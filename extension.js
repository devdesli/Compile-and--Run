const vscode = require("vscode");
const path = require("path");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const disposable = vscode.commands.registerCommand("c-and-r.car", async function () {
    const config = vscode.workspace.getConfiguration("c-and-r");

    const cwd = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd();
    const folderSettings = config.get("folders") || [];

    let matched = folderSettings.find(entry => entry.path === cwd);
    let combinedOutput = `Current Working Directory: ${cwd}\n`;

    const terminal = vscode.window.createTerminal("C-and-R Terminal");
    terminal.show();

    if (matched) {
      combinedOutput += `\n✅ Matched folder: ${matched.path}\n\n`;

      for (const cmd of matched.commands) {
        combinedOutput += `$ ${cmd}\n`;
        terminal.sendText(cmd);
      }
    } else {
      combinedOutput += `\n⚠️ No matching folder in settings. No commands run.\n`;
    }

    const panel = vscode.window.createWebviewPanel(
      "carWebview",
      "Welcome to CAR",
      vscode.ViewColumn.One,
      {}
    );

    panel.webview.html = buildWebviewHtml(cwd, combinedOutput, folderSettings);

    vscode.window.showInformationMessage("C-and-R execution complete.");
  });

  context.subscriptions.push(disposable);
}

function buildWebviewHtml(cwd, output, folderSettings) {
  const folderJson = JSON.stringify(folderSettings, null, 2); // pretty-print settings.json folder list

  return `
    <html>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 20px;
        background-color: #f4f4f4;
        color: #000;
        white-space: pre-wrap;
      }
      h1 {
        color: #222;
      }
      code, pre {
        color: black;
        background-color: #e0e0e0;
        padding: 10px;
        border-radius: 5px;
        display: block;
        overflow-x: auto;
      }
    </style>
    <body>
      <h1>Welcome to CAR Webview!</h1>
      <p>This extension automatically runs terminal commands based on the current project folder.</p>
      
      <h2>Setup Instructions</h2>
      <p>To use this extension, add the following to your <code>settings.json</code>:</p>
      <code>
"c-and-r.folders": [
  {
    "path": "C:\\\\Projects\\\\MyProject",
    "commands": ["echo Building MyProject...", "npm run build"]
  },
  {
    "path": "D:\\\\Scripts",
    "commands": ["echo Running script", "node script.js"]
  }
]
      </code>
      <p>Make sure the folder paths match your actual working directories exactly.</p>

      <h2>Current Settings from settings.json</h2>
      <pre>${escapeHtml(folderJson)}</pre>

      <h2>Detected Current Directory:</h2>
      <pre>${escapeHtml(cwd)}</pre>

      <h2>Command Execution Log:</h2>
      <pre>${escapeHtml(output)}</pre>
    </body>
    </html>
  `;
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      case "'": return "&#39;";
      default: return m;
    }
  });
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
