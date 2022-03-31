const fs = require('fs');
const {
   resolve
} = require('path');
const path = require('path');
const date = require('./date');
const directory = {
   upload: '/upload',
   image: '/images/',
   audio: '/audio/',
   video: '/video/',
   application: '/docs/'
}

const mkDirFile = (path) => {
   let pathList = path.split('/');
   let fileDir = '';
   pathList.forEach(item => {
      if (item) {
         fileDir += ('/' + item);
         if (!fs.existsSync(fileDir)) {
            fs.mkdirSync(fileDir, err => {
               logFile.info('Creat failure', err);
               return;
            });
         }
      }
   });
}

module.exports.uploadFile = async (ctx) => {
   const file = ctx.request.files.file;
   if (Array.isArray(file)) {
      file.forEach(item => {
         const dateStr = date.dateName(new Date().toISOString());
         console.log(dateStr);
         const filetype = item.type;
         let dirType = '';
         for (i in directory) {
            if (filetype.includes(i)) {
               dirType = directory[i];
            }
         }

         const fileName = directory.upload + dirType;
         const tail = item.name == 'blob' ? filetype.split('/').pop() : item.name.split('.').pop();
         const filePath = path.join(fileName, dateStr + '.' + tail);
         console.log(filePath);
      });
   }
}