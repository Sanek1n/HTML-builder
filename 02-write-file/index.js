const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'message.txt');
const writeStream = fs.createWriteStream(filePath, 'utf-8');
const {stdin, stdout} = process;

stdout.write('Hi, enter any text:\n');

stdin.on('data', (data) => {
    if (data.toString().slice(0,4) == 'exit') {
        process.exit();
    }
   writeStream.write(data);
});

process.on('SIGINT', () => {
    process.exit();
});

process.on('exit', code => {
    stdout.write('\nGood bye!');
});
