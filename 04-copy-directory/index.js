const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

const dirPath = path.join(__dirname, 'files');
const dirCopy = path.join(__dirname, 'files-copy');

fs.access(dirCopy, fs.F_OK, (err) => {
    if (err) {
        fsp.mkdir(dirCopy, {recursive: true})
        .then(result => copyFiles());
      return
    }
    fsp.rm(dirCopy, {force: true, recursive: true})
    .then(result => fsp.mkdir(dirCopy, {recursive: true})
        .then(result => copyFiles())
    )
});

function copyFiles() {
    fs.readdir(dirPath, {withFileTypes: true}, (err, files) => {
        if (err)
          return
        else {
          files.forEach(file => {
              fsp.copyFile(path.join(dirPath, file.name) , path.join(dirCopy, file.name));
            })
          };
        });
}
