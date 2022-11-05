const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

let fileSource = [];

const inPath = path.join(__dirname,'styles');
const outPath = path.join(__dirname,'project-dist');

fsp.rm(path.join(outPath, 'bundle.css'), {force: true, recursive: true})
.then(fs.readdir(inPath, {withFileTypes: true}, (err, files) => {
        if (err)
          console.log(err);
        else {
          files.forEach(file => {
              if (file.isFile() && path.extname(path.join(inPath, file.name)).slice(1).toLowerCase() === 'css') {
                fsp.readFile(path.join(inPath, file.name),{encoding: 'utf-8'})
                .then(result => fs.appendFile(path.join(outPath,'bundle.css'), result, (err) => {
                    if (err) console.log(err);
                }));
              }
          });
          }
      })
);