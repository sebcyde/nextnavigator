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

	let allowed = ["jsx", "tsx", "css", "scss", "js"];

	let filtered = allFiles.filter(C => {
		let splitVersion = C.path.split("/");
		let last = splitVersion.length - 1;

		return (
			allowed.includes(splitVersion[last].split(".")[1]) ||
			allowed.includes(splitVersion[last].split(".")[2])
		);
	});

	return filtered.map(file => {
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
