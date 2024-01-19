const fs = require('fs');
const path = require('path');

const fileName = 'text.txt';
const fullPath = path.join(__dirname, fileName);
const stream = fs.createReadStream(fullPath, 'utf-8');

let fileContents = '';

stream.on('data', (chunk) => {
  fileContents += chunk;
});
stream.on('end', () => console.log(fileContents));
stream.on('error', (e) => console.log(e));
