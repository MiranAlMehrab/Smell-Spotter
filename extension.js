const fs = require('fs');
const vscode = require('vscode'); 
const { spawn } = require('child_process');
var detection = require('./detection/detection');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) {
	// const color = new vscode.ThemeColor('pssd.warning');
	// vscode.window.showQuickPick.arguments(2);

	let parsecode = vscode.commands.registerCommand('extension.parsecode', function () {
		
		const pcode = vscode.window.activeTextEditor.document.getText();
		const codeLang = vscode.window.activeTextEditor.document.languageId;

		if (codeLang === 'python') {
			if (pcode != null) {
				
				const script = spawn('python3.8', [__dirname + '/py/main.py', pcode]);

				script.stdout.on('data', data => data? startDetection(data.toString()) : console.log('No data from script!'));
				script.on('close', exitCode => exitCode ? console.log(`main script close all stdio with code ${exitCode}`) : 'main script exit code not found');
				script.on('error', err => {
					console.log('error found!')
					console.log(err)
					
				});
			}
			else vscode.window.showErrorMessage("Empty source code!");
		}
		else vscode.window.showErrorMessage("Please select python source code!");
	});

	context.subscriptions.push(parsecode);
}

const startDetection = tokens => {
	fs.writeFileSync(__dirname+'/logs/tokens.txt', tokens);
	
	const data = fs.readFileSync(__dirname+'/logs/tokens.txt', {encoding:'utf8', flag:'r'}); 
	var actualTokens = data.split('\n');

	console.log(actualTokens)
	
	var imports = [];
	actualTokens.pop()
	actualTokens.map(token => {
		try{
			var obj = JSON.parse(token)
			if(obj.type == "import") imports.push(obj.og)
		}
		catch(error) {
			vscode.window.showErrorMessage(error.toString())
		}
	})

	detection.detect(actualTokens, imports)
} 

exports.activate = activate;

function deactivate() {
	// this method is called when your extension is deactivated
	//Extension should clean up the resources that it has consumed during operation.
}

module.exports = { activate, deactivate}
