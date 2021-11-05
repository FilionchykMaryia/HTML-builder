const fs = require('fs');
const path = require('path');
const { stdin: input, stdout: output } = require('process');
const readline = require('readline');
const rl = readline.createInterface({ input, output, prompt: 'Hello, write your text, please: ' });

const fileName = path.resolve(__dirname, 'text.txt');
const writeableStream = fs.createWriteStream(fileName);

rl.prompt();

rl.on('line', (input) => {
  if(input.indexOf('exit')>=0){
    rl.close();
  } else {
    writeableStream.write(`${input}\n`);
  } 
});
  
rl.on('close', () => {
  output.write('Goodbye!\n');
  writeableStream.end();
});
