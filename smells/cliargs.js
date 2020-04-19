const vscode = require('vscode');
var operations = require('./operations');

var smell = {

    detect : (token) => {

        const line =  token.line;
        if(token.hasOwnProperty("method")) var methodname = token.method;
        if(token.hasOwnProperty("params")) var params = token.params;
        
        console.log(methodname);
        
        const cliArgsFuncNames = ['sys.argv','ArgumentParser','argparse','exec'];
        if(cliArgsFuncNames.includes(methodname))
        {
            console.log('Use of CLI args!');
            vscode.window.showWarningMessage('Use of CLI args at line '+ line);
        }
    }
}

module.exports = smell;