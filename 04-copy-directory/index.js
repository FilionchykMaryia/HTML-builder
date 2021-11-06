const fs = require('fs');
const { readdir, mkdir, copyFile } = require('fs/promises');
const path = require('path');
const folderName = path.resolve(__dirname, 'files');
const folderNameCopy = path.resolve(__dirname, 'files-copy');

const copyDir = async (folderName, folderNameCopy) => {
  fs.access(folderNameCopy, err => {
    if(err){
      mkdir(folderNameCopy, { recursive: true })
      .catch(err => console.log(err)) 
    } 
  })
  await readdir(folderName)
    .then(files => files.map((file, i) => copyFile(`${folderName}/${file}`, `${folderNameCopy}/${file}`)))
    .catch(err => console.log(err));
}
copyDir(folderName, folderNameCopy);