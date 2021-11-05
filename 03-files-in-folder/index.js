const { readdir, stat } = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'secret-folder');

async function getFiles() {
  try {
    const allFiles = await readdir(folderPath, { withFileTypes: true });
    for (const file of allFiles) {
      if(file.isFile()){
        const fileName = file.name.split('.');
        const filePath = path.join(__dirname, 'secret-folder/', file.name);
        const fileStat = await stat(filePath);
        const fileSize = fileStat.size;
        console.log(`${fileName[0]} - ${fileName[1]} - ${(fileSize / 1024).toFixed(2)} Kb`);
      }
    } 
  } catch (err) {
    console.error(err);
  }
}
getFiles();