const fs = require('fs');
const fsp = require('fs/promises');
const path = require('path');

let fileSource = [];
const dirDist = path.join(__dirname, 'project-dist');
const dirPath = path.join(__dirname);
const dirCss = path.join(__dirname, 'styles');
const dirComponents = path.join(__dirname, 'components');
const fileHtml = path.join(__dirname, 'template.html');
const fileDist = path.join(dirDist, 'index.html');


(async function() {
  await fs.access(dirDist, fs.F_OK, (err) => {
    if (err) {
        fsp.mkdir(dirDist, {recursive: true})
        .then(result => copyDir(path.join(dirPath,'assets'), path.join(dirDist,'assets')));
      return
    }
    copyDir(path.join(dirPath,'assets'), path.join(dirDist,'assets'));
});

await fsp.rm(path.join(dirDist, 'style.css'), {force: true, recursive: true})
.then(fs.readdir(dirCss, {withFileTypes: true}, (err, files) => {
        if (err)
          console.log(err);
        else {
          files.forEach(file => {
              if (file.isFile() && path.extname(path.join(dirCss, file.name)).slice(1).toLowerCase() === 'css') {
                fsp.readFile(path.join(dirCss, file.name),{encoding: 'utf-8'})
                .then(result => fs.appendFile(path.join(dirDist,'style.css'), result, (err) => {
                    if (err) console.log(err);
                }));
              }
          });
          }
      })
);

await fsp.rm(path.join(dirDist, 'index.html'), {force: true, recursive: true});
let mainFile = await fsp.readFile(fileHtml, 'utf-8');
  fs.readdir(dirComponents, {withFileTypes: true}, (err, files) => {
    files.forEach(file => {
      let stream = fs.createReadStream(path.join(dirComponents, `${file.name}`),'utf-8')
        let fileContent = '';
        stream.on('data', chunk => fileContent += chunk);
        stream.on('end', () => {
          mainFile = mainFile.replace(`{{${path.basename(file.name, '.html')}}}`, fileContent);
          let mainHtml = fs.createWriteStream(fileDist, 'utf-8');
          mainHtml.write(mainFile);
        });
  });
  });
})();

async function copyDir(src, dest) {
   try {
    await fs.readdir(src, {withFileTypes: true}, (err, files) => {
        if (err)
          return
        else {
          files.forEach(file => {
            if (file.isDirectory()) {
              const destPath = path.join(dest, file.name);
              const srcPath = path.join(src, file.name);
              fs.access(destPath, fs.F_OK, (err) => {
                if (err) {
                  fsp.mkdir(destPath, { recursive: true })
                    .then(result => copyDir(srcPath, destPath));
                } else {
                  fsp.rm(destPath, {recursive: true})
                  .then(result => fsp.mkdir(destPath, { recursive: true })
                    .then(result => copyDir(srcPath, destPath))
                  )
                }
              }
              )
            } else {
              fsp.copyFile(path.join(src, file.name), path.join(dest, file.name));
            }
            })
          };
        });
  } catch(err) {
    console.log(err);
  }
}