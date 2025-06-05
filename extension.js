const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
  // runned once when the command is activated
  const panel = vscode.window.createWebviewPanel(
    "carWebview", // Identifies the type of the webview. Used internally
    "Welcome to CAR", // Title of the panel displayed to the user
    vscode.ViewColumn.One, // Editor column to show the new webview panel in
    {} // Webview options
  );

  panel.webview.html = `
	<html>
	<style>
	  body {
	    font-family: Arial, sans-serif;
	    margin: 20px;
	    background-color: #f0f0f0;
	  }
		h1 {
		color: #000000;
      }
	  p {
	  color: #000000;
	  }
	</style>
	  <body>
		<h1>Welcome to Car Webview!</h1>
		<p>Define input and output to be set to car in package.json</p>
	  </body>
	</html>`;
	
  // The command has been defined in the package.json file
  // and will run every time its typed
  let disposable = vscode.commands.registerCommand("c-and-r.car", function () {
    vscode.window.showInformationMessage("Car command executed!");
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
