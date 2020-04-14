const vscode = require('vscode');

var lexer = require('./parse/lexer');
var write = require('./parse/savetokens');
var detection = require('./detection/detection');

/**
 * @param {vscode.ExtensionContext} context
 */

function activate(context) 
{
	let parsecode = vscode.commands.registerCommand('extension.parsecode', function () 
	{	
		const pcode = vscode.window.activeTextEditor.document.getText();
		const codeLang = vscode.window.activeTextEditor.document.languageId;
		if(codeLang === 'python') 
		{
			let tokens = [];
			if(pcode!=null) tokens = lexer.run(pcode);
			else vscode.window.showErrorMessage("Empty source code!");
			
			if(tokens) 
			{
			  	write.save(tokens,__dirname+'/output/editor.txt');
			  	detection.read(__dirname+'/output/editor.txt');
			}
		}
		else vscode.window.showErrorMessage("Please select python source code!");
	});

	let greetings = vscode.commands.registerCommand('extension.greetings', function()
	{
		vscode.window.showInformationMessage('Hello python programmers!');
	});

	context.subscriptions.push(parsecode);
	context.subscriptions.push(greetings);
}


exports.activate = activate;

function deactivate() 
{
	// this method is called when your extension is deactivated
	//Extension should clean up the resources that it has consumed during operation.
}

module.exports = {
	activate,
	deactivate
}
