const gglIO = require('../utils/GglIO');
const { weekDates, sixDays } = require('../utils/refData');

const now = new Date();
const date = now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear();

const init = async (req, res, next) => {
   const { statsGglID, locationID } = req.body;
   const gglStats = await gglIO.readSheet(statsGglID, 0, locationID);

   let dailyStat = {};
   let keyList = [];
   for (let row = 0; row < gglStats.length; row++) {
      if (gglStats[row].Date === date) {
         keyList = [...gglStats[row]._sheet.headerValues];
         keyList.splice(0, 1);
         for (let key of keyList) {
            if (!gglStats[row][key]) {
               dailyStat[key] = '0';
               gglStats[row][key] = '0';
            } else {
               dailyStat[key] = gglStats[row][key];
            }
         }
         await gglStats[row].save();
         break;
      }
   }

   res.json({ dailyStat, keyList });
};

const submit = async (req, res, next) => {
   const { statsGglID, locationID, name, number } = req.body;
   const gglStats = await gglIO.readSheet(statsGglID, 0, locationID);

   gglStats.forEach(async (row) => {
      if (row.Date === date) {
         row[name] = number;
         await row.save();
      }
   });

   res.json({ name, number });
};

const weeklyTable = async (req, res, next) => {
   const { statsGglID, locationID, keyList } = req.body;

   const gglStats = await gglIO.readSheet(statsGglID, 0, locationID);

   const now = new Date();
   let dayList = [];
   let indices = [];

   // Build dayList of interest.
   weekDates(now).forEach((day) => dayList.push(day.split(' ')[0]));

   // Build indices list of interest.
   for (let index in gglStats) {
      if (dayList.includes(gglStats[index].Date)) {
         indices.push(index);
      }
   }

   // Data collection from gglStats.
   let statsTable = {};
   sixDays.forEach((day) => (statsTable[day] = [])); // Init.

   sixDays.forEach((day, id) =>
      keyList.forEach((cls) =>
         statsTable[day].push(
            gglStats[indices[id]][cls] ? gglStats[indices[id]][cls] : '0'
         )
      )
   );

   res.json({ statsTable });
};

exports.init = init;
exports.submit = submit;
exports.weeklyTable = weeklyTable;
