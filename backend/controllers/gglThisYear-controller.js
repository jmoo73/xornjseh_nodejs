const gglIO = require('../utils/GglIO');
const { colors, makeMonthlyDataList } = require('../utils/refData');

const now = new Date();
const date = now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear();
const thisYear = now.getFullYear();

const initPersons = async (req, res, next) => {
   const { ggleID, classToday } = req.body;
   const gglThisYear = await gglIO.readSheet(ggleID, 0);

   let classAttender = {};
   for (let cls of classToday) {
      classAttender[cls[1]] = [];
   }

   const persons = gglThisYear.map((row, index) => {
      const person = {};
      const patt = /[/$#][^/$#!]*/g;

      person.name = row.Name;
      person.belt = row.Beltcolor;
      person.id = index;
      person.startedOn = row.StartedOn ? row.StartedOn : '';
      person.testedOn = row.TestedOn ? row.TestedOn : '';
      person.needGglUpdate = false;
      person.attClass = [];
      if (row[date]) {
         // Below, remove the case where only test progress and/or new member.
         if (row[date].match(patt)) {
            person.attClass = row[date].match(patt).map((el) => el.slice(1));
         }
      }

      for (let j of person.attClass) {
         classAttender[j].push([row.Beltcolor, index]);
      }
      return person;
   });

   res.json({ persons, classAttender });
};

const updatePersons = async (req, res, next) => {
   const { ggleID, members } = req.body;
   const gglThisYear = await gglIO.readSheet(ggleID, 0);

   const patt = /[/$#][^/$#!]*/g;
   members.forEach(async (member) => {
      if (member.needGglUpdate) {
         let attStr = member.attClass.map((el) => {
            if (el.includes('Spar')) return '$' + el;
            if (el.includes('Board')) return '#' + el;
            return '/' + el;
         });
         let beforeUpdate = gglThisYear[member.id][date];
         gglThisYear[member.id][date] =
            (beforeUpdate ? beforeUpdate.replace(patt, '') : '') +
            attStr.join('');
         await gglThisYear[member.id].save();
      }
   });

   res.json({ message: 'Updated successfully.' });
};

const saveTestees = async (req, res, next) => {
   const { ggleID, testees } = req.body;
   const gglThisYear = await gglIO.readSheet(ggleID, 0);

   testees.forEach(async (testee) => {
      let colorId = colors.indexOf(testee[0]);
      let nextBelt = colors[colorId + 1];
      let row = gglThisYear[testee[1]];
      row.Beltcolor = nextBelt;
      row[date] = (row[date] ? row[date] : '') + '!Test[' + nextBelt + ']';
      row.TestedOn = date;

      await row.save();
   });

   res.json({ message: 'Updated successfully.' });
};

const personalAttendance = async (req, res, next) => {
   const { ggleID, lastYearGglID, fullNameList } = req.body;

   const gglThisYear = await gglIO.readSheet(ggleID, 0);
   const gglLastYear = await gglIO.readSheet(lastYearGglID, 0);

   let id = null;
   let gglSheet = gglThisYear;
   let allListList = [];
   const patt = /[/$#][^/$#!]*/g;
   
   // allList/dateList = [ [ 'Apr', dateList], [ 'May', ... ], [ 'Jun', ... ] ]
   for (let fullName of fullNameList) {
      let allList = makeMonthlyDataList();
      // m = 2, 1, 0
      for (let m = allList.length - 1; m >= 0; m--) {
         // dateList = [ { id: 0, date: 'x/x/x', day: 'Sunday', attendance: ['x', ... ], needDataFetch: true, test: true, start: false }, ... ]
         let dateList = allList[m][1];
         for (let day of dateList) {
            if (day.date.split('/')[2] !== thisYear.toString()) {
               gglSheet = gglLastYear;
               id = null;
            }
            if (id === null) {
               for (let index = 0; index < gglSheet.length; index++) {
                  if (gglSheet[index].Name === fullName) {
                     id = index;
                     break;
                  }
               }
            }
            if (id !== null) {
               if (gglSheet[id][day.date]) {
                  day.attendance = gglSheet[id][day.date].match(patt)
                     ? gglSheet[id][day.date]
                          .match(patt)
                          .map((el) => el.slice(1))
                     : [];
               }
               if (gglSheet[id].StartedOn === day.date) {
                  day.start = true;
               }
               if (gglSheet[id].TestedOn === day.date) {
                  day.test = true;
               }
            } else {
               // For the case when id is absent in the last year sheet.
               day.attendance = [];
            }
         }
         id = null;
      }
      allListList.push([fullName, allList]); // eqv. to [ fullName, allList ]
   }

   res.json({ personalAttendance: allListList });
};

const addNewMember = async (req, res, next) => {
   const { ggleID, newMember } = req.body;

   const sheet = await gglIO.getSheetObj(ggleID, 0);
   await sheet.addRow(newMember);

   res.json({ message: 'Member was added successfully.' });
};

exports.initPersons = initPersons;
exports.updatePersons = updatePersons;
exports.saveTestees = saveTestees;
exports.personalAttendance = personalAttendance;
exports.addNewMember = addNewMember;
