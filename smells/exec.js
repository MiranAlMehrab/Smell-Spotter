const vscode = require('vscode');

var smell = {

    detect : (token) => {
        
        if(token.hasOwnProperty("line")) var lineno = token.line;
        if(token.hasOwnProperty("type")) var tokenType = token.type;
        
        if(tokenType == "variable")
        {
            if(token.hasOwnProperty("args")) var args = token.args;
            if(token.hasOwnProperty("valueSrc")) var valueSrc = token.valueSrc;
            
            if(valueSrc == 'exec' && args.length > 0) 
            {
                const warning = 'possible command injection at line '+ lineno;
                vscode.window.showWarningMessage(warning);
                // vscode.commands.executeCommand('revealLine',{'lineNumber':lineno, 'at':'top'});
            }
        }
        else if(tokenType == "function_call")
        {
            if(token.hasOwnProperty("name")) var name = token.name;
            if(token.hasOwnProperty("args")) var args = token.args;
            
            if(name == 'exec' && args.length > 0)
            {
                const warning = 'possible command injection at line '+ lineno;
                vscode.window.showWarningMessage(warning);
                // vscode.commands.executeCommand('revealLine',{'lineNumber':lineno, 'at':'top'});
            }
        }
        else if(tokenType == "function_def")
        {
            if(token.hasOwnProperty("return")) var funcReturn = token.return;
            if(token.hasOwnProperty("returnArgs")) var returnArgs = token.returnArgs;
            
            if(funcReturn == 'exec' && returnArgs.length > 0) 
            {
                const warning = 'possible command injection at line '+ lineno;
                vscode.window.showWarningMessage(warning);
                // vscode.commands.executeCommand('revealLine',{'lineNumber':lineno, 'at':'top'});
            }
        }
    }
}

module.exports = smell;