const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

let fileName = '';
let fileType = '';

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, {withFileTypes: true}, (err, files) => {
  if (err)
    console.log(err);
  else {
    files.forEach(file => {
        if (file.isFile()) {
            fsp.stat(path.join(dirPath, file.name), (err, stats) => stats).then((value) => {
              fileName = file.name.slice(0,file.name.indexOf('.',0));
              fileType = path.extname(path.join(dirPath, file.name)).slice(1);
              console.log(fileName + ' - ' + fileType + ' - ' + (value.size / 1000) + 'kb')})
        }
      })
    }
  });

