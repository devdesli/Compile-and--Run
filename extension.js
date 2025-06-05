
const vscode = require('vscode');
/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    // runned once when the extension is activated
	console.log('Congratulations, your extension "c-and-r" is now active!');

	// The command has been defined in the package.json file
	let disposable = vscode.commands.registerCommand
	('c-and-r.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World from c_and_r!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
