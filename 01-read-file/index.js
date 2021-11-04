const fs = require('fs');
const path = require('path');

const fileStream = fs.createReadStream(path.resolve(__dirname, 'text.txt'));
fileStream.on('readable', function(err, data) {
  if(err){
    console.error(err);
    return
  }
  while((data = this.read())){
    console.log(data.toString());
  }
})


// fs.readFile(path.resolve(__dirname, 'text.txt'), (err, data) => {
//   if (err) {
//     console.error(err)
//     return
//   }
//   console.log(data.toString())
// })

