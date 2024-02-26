const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */

const capitalizeFirstLetter = str => {
	return str.charAt(0).toUpperCase() + str.slice(1);
};

const getFilesInWorkspace = async () => {
	const allFiles = await vscode.workspace.findFiles(
		"**/*",
		"**/node_modules/**"
	);

	return allFiles.map(file => {
		let splitVersion = file.path.split("/");

		return {
			label: splitVersion
				.map(C => capitalizeFirstLetter(C))
				.slice(-2)
				.join(" / "),
			description: splitVersion.slice(-3).join("/"),
			fullPath: file.path,
		};
	});
};

function activate(context) {
	let disposable = vscode.commands.registerCommand(
		"nextnavigator.runNavigator",
		async function () {
			const files = await getFilesInWorkspace();

			if (files.length > 0) {
				console.log(`Got ${files.length} files in activator.`);

				const selectedFile = await vscode.window.showQuickPick(files);

				if (selectedFile) {
					await vscode.workspace
						.openTextDocument(selectedFile.fullPath)
						.then(vscode.window.showTextDocument);
				}
			}
		}
	);

	context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
	activate,
	deactivate,
};
