const { readSheet } = require('../utils/GglIO');
const { sixDays } = require('../utils/refData');

const classTableMaker = async (req, res, next) => {
   const { ggleID } = req.body;

   // Build classTable.
   const cl = await readSheet(ggleID, 1);
   // const cl = gglClassTable.map(row => ({ ...row }));
   let classTable = {};
   let classNameTable = {};

   for (let day of sixDays) {
      let classArr = [];
      let classNameArr = [];
      for (let row of cl) {
         classArr.push([row.Classes, row[day] ? row[day] : '']);
         classNameArr.push(row[day] ? row[day] : '');
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
