const fs = require('fs');
const { mkdir, readdir, copyFile } = require('fs/promises');
const path = require('path');
const buildFolder = path.resolve(__dirname, 'project-dist');

const buildHtml = async () => {
  try {
    const streamTemplate = fs.createReadStream(path.resolve(__dirname, 'template.html'));
    fs.access(buildFolder, err => {
      if(err){
        mkdir(buildFolder, { recursive: true })
      } 
    });

    let template;
    streamTemplate.on('readable', function(err, data) {
      if(err) console.error(err);
      while((data = this.read())){
      template = data.toString();
      }
      fs.createReadStream(path.resolve(__dirname, 'components/header.html'))
        .on('data', chunk => {
          template = template.replace('{{header}}', chunk.toString())
        });
      fs.createReadStream(path.resolve(__dirname, 'components/articles.html'))
        .on('data', chunk => {
          template = template.replace('{{articles}}', chunk.toString())
        });
      fs.createReadStream(path.resolve(__dirname, 'components/footer.html'))
        .on('data', chunk => {
          template = template.replace('{{footer}}', chunk.toString())
          const writeStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist/index.html'));
          writeStream.write(template)
        });
    });
  } catch (err) { console.error(err)}
}

const buildCss = async () => {
  try {
    const folderPath = path.join(__dirname, 'styles');
    const allFiles = await readdir(folderPath, { withFileTypes: true });
    let filesStyle = [];
    
    allFiles.forEach(file => {
      if(file.isFile()) {
        let fileName = file.name.split('.');
        if(fileName[1] == 'css') {
          let readStream = fs.createReadStream(path.resolve(folderPath, file.name));
          let writeStream = fs.createWriteStream(path.resolve(__dirname, 'project-dist/style.css'));
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

const readFolder = async (folderName, folderNameCopy) => {
  try {
    const allFiles = await readdir(folderName, { withFileTypes: true })
    allFiles.map(file => {
      if(file.isFile()){
        copyFile(`${folderName}/${file.name}`, `${folderNameCopy}/${file.name}`)
      } else {
        mkdir(`${folderNameCopy}/${file.name}`, { recursive: true })
        readFolder(`${folderName}/${file.name}`, `${folderNameCopy}/${file.name}`)
      }
    })
  } catch (err) { console.error(err) }
} 

const copyAssets = async () => {
  try {
    const folderName = path.resolve(__dirname, 'assets');
    const folderNameCopy = path.resolve(__dirname, 'project-dist/assets');
    fs.access(folderNameCopy, err => {
      if(err){
        mkdir(folderNameCopy, { recursive: true })
        .catch(err => console.log(err)) 
      } 
    })
    readFolder(folderName, folderNameCopy);
  } catch (err) { console.error(err) }
}

const buildPage = async () => {
  await buildHtml();
  await buildCss();
  await copyAssets();
}
buildPage();
