const fs = require('fs');
const { readdir } = require('fs/promises');
const path = require('path');
const folderPath = path.join(__dirname, 'styles');

async function createBundle() {
  try {
    const allFiles = await readdir(folderPath, { withFileTypes: true });
    let filesStyle = [];
    
    allFiles.forEach(file => {
      if(file.isFile()) {
        let fileName = file.name.split('.');
        if(fileName[1] == 'css') {
          let readStream = fs.createReadStream(path.resolve(folderPath, file.name));
          let writeStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist/bundle.css'));
          readStream.on('readable', function(err, data) {
            if(err) console.error(err);
            while((data = this.read())){
              filesStyle.push(data.toString());
              writeStream.write(filesStyle.join('\n'));
            }
          })
        }
      }  
    })
  } catch (err) { console.error(err)}
}
createBundle();
