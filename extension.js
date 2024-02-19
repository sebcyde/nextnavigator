const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */

const getFilesInWorkspace = async () => {
	const allFiles = await vscode.workspace.findFiles(
		"**/*",
		"**/node_modules/**"
	);

	return allFiles.map(file => {
		const NextFileObject = {
			label: file.path.split("/").slice(-3)[0],
			description: file.path.split("/").slice(-3)[1],
			fullPath: file.path,
		};

		if (file.path.toLowerCase().includes("page")) {
		} else {
		}

		return NextFileObject;
	});
};

function activate(context) {
	let disposable = vscode.commands.registerCommand(
		"nextnavigator.runNavigator",
		async function () {
			const files = await getFilesInWorkspace();

			if (files.length > 0) {
				const selectedFile = await vscode.window.showQuickPick(files);

				if (selectedFile) {
					await vscode.commands.executeCommand(
						"workbench.action.closeActiveEditor"
					);

					await vscode.workspace
						.openTextDocument(selectedFile.fullPath)
						.then(vscode.window.showTextDocument);
				}
			}
		}
	);

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
