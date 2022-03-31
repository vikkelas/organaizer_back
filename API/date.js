module.exports.dateName = (data) => {
   const splitData = data.split('');
   let arrNum = [];

   splitData.forEach(item => {
      if (!isNaN(item)) {
         arrNum.push(item);
      }
   });
   const arrDateStr = arrNum.join('');
   return arrDateStr;
}