const { readSheet } = require('../utils/GglIO');
const { sixDays } = require('../utils/refData');

const classTableMaker = async (req, res, next) => {
   const { ggleID, locationID } = req.body;

   // Build classTable.
   const cl = await readSheet(ggleID, 1, locationID);
   const cl2 = await readSheet(ggleID, 2, locationID);
   // const cl = gglClassTable.map(row => ({ ...row }));
   let classTable = {};
   let classNameTable = {};

   for (let day of sixDays) {
      let classArr = [];
      let classNameArr = [];
      for (let row in cl) {
         classArr.push([
            cl[row].Classes,
            cl[row][day] ? cl[row][day] : '',
            cl2[row][day] ? cl2[row][day] : '',
         ]);
         classNameArr.push(cl[row][day] ? cl[row][day] : '');
      }
      classTable[day] = classArr;
      classNameTable[day] = classNameArr;
   }

   // Add activities to classNameTable.
   let activities = ['Afterschool', 'Trial', 'Birthday', 'Camp'];
   for (let day in classNameTable) {
      classNameTable[day] = [...activities, ...classNameTable[day]];
   }

   res.json({ classTable, classNameTable });
};

exports.classTableMaker = classTableMaker;
