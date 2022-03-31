const CyrillicToTranslit = require('cyrillic-to-translit-js');
const fs = require('fs');
const path = require('path');
const directory = {
   upload: '/upload',
   image: '/images/',
   audio: '/audio/',
   video: '/video/',
   application: '/docs/'
}

const filesArr = [];

const mkDirFile = (path) => {
   let pathList = path.split('/');
   let fileDir = '';
   pathList.forEach(item => {
      if (item) {
         fileDir += ('/' + item);
         if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, err => {
               LogFile.info('Creat failure', err);
               return;
            });
         }
      }
   });
}

const saveFile = (file, path) => {
   return new Promise((resolve, reject) => {
      let render = fs.createReadStream(file);
      // Create a write stream
      console.log(path);
      let upStream = fs.createWriteStream(path);
      render.pipe(upStream);
      upStream.on('finish', () => {
         resolve(path)
      });
      upStream.on('error', (err) => {
         reject(err)
      });
   });
}

module.exports.uploadFile = async ctx => {
   const file = ctx.request.files.file;
   if (Array.isArray(file)) {
      for (const item of file) {
         const fileName = CyrillicToTranslit().transform(item.name).split('.');
         fileName.pop();
         const filetype = item.type;
         let dirType = '';
         for (i in directory) {
            if (filetype.includes(i)) {
               dirType = directory[i];
            }
         }
         const dirName = directory.upload + dirType;
         const tail = item.name == 'blob' ? filetype.split('/').pop() : item.name.split('.').pop();
         const filePath = (dirName + fileName.join() + '.' + tail);
         await mkDirFile(dirName);
         console.log(dirName)
         // console.log(item.path);
         console.log(filePath);
         await saveFile(item.path, filePath).then(su => {
            let uploadFile = su.substring(directory.upload.length, su.length);
            filesArr.push(uploadFile);
            ctx.body = {
               error_code: 10000,
               error_message: 'Successful upload of files',
               realName: uploadFile,
            }
         }).catch(err => {
            ctx.body = {
               error_code: 20008,
               error_message: 'Failed to upload file!',
            }
         });
      }
   }
   return filesArr;
}