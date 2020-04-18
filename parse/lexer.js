var fs = require('fs');

var lexer = {

    run: (pcode)=>{
        
        let tokens = [];
        let lines = pcode.split("\n"); 
        const lineCount = lines.length;
        
        for(let i=0;i<lineCount;i++)
        {
            const line = lines[i];
             
            if(line.split(' ').includes("="))
            {
                const words = line.split('=');
                
                var type = 'var';
                var name = words[0].trim();
                var value = words[1].trim();
                var valsrc = "initialized";

                const re = /input\(+[\s\S]+\)/g;
                
                if(re.test(value))var valsrc = "user input";
                else 
                {
                    const listre = /\[+[\s\S]+\]/g;
                    const tuplere = /\(+[\s\S]+\)/g;

                    if(listre.test(value)) type = "list";
                    else if(tuplere.test(value)) type = "tuple";
                    else value = lexer.refine(value);
                }
                const token = {line:i+1,type:type,name:name,value:value,source:valsrc};
                tokens.push(token);
            }
            else
            {
                if(line.includes(".")) 
                {
                    const moduleName = line.substring(0,line.indexOf("."));
                    
                    const funcCall = line.substring(line.indexOf(".")+1);
                    const funcName = funcCall.substring(0,funcCall.indexOf("(")); 
                    const params = funcCall.substring(funcCall.indexOf("(")+1,funcCall.length-1);
                    const parameters = params.split(",");
                    
                    const totalFuncName = moduleName+"."+funcName;
                    var token = {line:i+1,type:"obj",name:totalFuncName};
                    parameters.map((val,index)=>{
                        var param = "param"+(index+1);
                        token[param] = val.trim();
                        console.log(val.trim());
                        
                    });
                    
                    tokens.push(token);
                }

            }
            
        }
        return tokens;
    },
    refine: (word) => {

        const charLength = word.length;
        const unwantedChars = ["'",'"'];
        const unwantedCharsCount = unwantedChars.length;

        for(let i=0;i<charLength;i++)
        {
            for(let j=0;j<unwantedCharsCount;j++){
                const unwanted = unwantedChars[j];
                if(word.includes(unwanted)) word = word.replace(unwanted,'');
            }
        }
        return word;
    },
    save: (tokens,filename) => {

        fs.writeFileSync(filename,'');
        tokens.map((token) => {
            fs.appendFileSync(filename, "<obj>"+"\n"+JSON.stringify(token, null, 2)+"\n" , 'utf-8');
        });
    }
}

module.exports = lexer;

