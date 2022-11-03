const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(filePath, 'utf-8');
let fileContent = '';

stream.on('data', chunk => fileContent += chunk);
stream.on('end', () => console.log(fileContent));