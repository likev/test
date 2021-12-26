const fs = require('fs');
const iconv = require('iconv-lite');

let mkdirIfNotExists = (path) => {
        try {
          if (!fs.existsSync(path)) fs.mkdirSync(path);
          fs.accessSync(path, fs.constants.R_OK | fs.constants.W_OK);
          //console.log('can read/write');
        } catch (err) {
          console.error(`no access to ${path}!`);
        }
      }

let convDirSync = (pathA,pathB)=>{
    mkdirIfNotExists(pathB);
    
    let items = fs.readdirSync(pathA, {withFileTypes:true});

    for(let item of items){
        let pathLeft = pathA + '/' + item.name;
        let pathRight = pathB + '/' + item.name;
        if(item.isFile()){
            let contentBuf = fs.readFileSync(pathLeft);
            let content = iconv.decode( contentBuf, 'GB2312');
            
            var re = /font-family:楷体_GB2312/g;
            content = content.replace(re,'');
            
            re = /GB2312/gi;
            content = content.replace(re,'utf-8');
            
            let convBuf = iconv.encode(content, 'utf8');
            
            fs.writeFileSync(pathRight, content);
        } 
        else if(item.isDirectory()) convDirSync(pathLeft, pathRight);
    }
}

convDirSync('testA', 'testB')