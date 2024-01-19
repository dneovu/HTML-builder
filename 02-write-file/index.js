const fs = require('fs');
const readline = require('readline');
const path = require('path');

const fileName = 'output.txt';
const fullPath = path.join(__dirname, fileName);
const stream = fs.createWriteStream(fullPath);
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeLineToFile = (data) => {
  if (data === 'exit') {
    rl.close();
    stream.end();
  } else stream.write(data, 'utf-8');
};

rl.question('Hello! Please input something :> \n', writeLineToFile);
rl.on('line', writeLineToFile);
rl.on('close', () => {
  console.log('\nThe program is finished.');
});
