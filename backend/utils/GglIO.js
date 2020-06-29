const { sixDays, thisYear, makeMonthlyDataList } = require('./refData');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./client_secret.json');

const now = new Date();
const date = now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear();
const xxxDay = sixDays[now.getDay()];

async function readSheet(docID, index) {
   const doc = new GoogleSpreadsheet(docID);
   await doc.useServiceAccountAuth(creds);
   await doc.loadInfo(); // loads document properties and worksheets
   const sheetLog = doc.sheetsByIndex[index]; // Personal dailylog file
   const rows = await sheetLog.getRows();

   return rows;
}

async function getSheetObj(docID, index) {
   const doc = new GoogleSpreadsheet(docID);
   await doc.useServiceAccountAuth(creds);
   await doc.loadInfo(); // loads document properties and worksheets
   const sheet = doc.sheetsByIndex[index]; // Personal dailylog file

   return sheet;
}

const doesMemberExist = async (fullName, ggleID) => {
   const gglThisYear = await readSheet(ggleID, 0);
   let doesExist = false;

   for (let index = 0; index < gglThisYear.length; index++) {
      if (gglThisYear[index].Name === fullName) {
         doesExist = true;
      }
   }
   return doesExist;
};

const fetchAttendance = async (ggleID, lastYearGglID, fullNameList) => {
   const gglThisYear = await readSheet(ggleID, 0);
   const gglLastYear = await readSheet(lastYearGglID, 0);

   let id = null;
   let gglSheet = gglThisYear;
   let allListList = [];
   const patt = /[/$#][^/$#!]*/g;

   // allList/dateList = [ [ 'Apr', dateList], [ 'May', ... ], [ 'Jun', ... ] ]
   for (let fullName of fullNameList) {
      let allList = makeMonthlyDataList();
      let belt;
      let startedOn;
      let testedOn;
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
                     belt = gglSheet[index].Beltcolor; // belt for memberAuth visualization
                     startedOn = gglSheet[index].StartedOn;
                     testedOn = gglSheet[index].TestedOn;
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
      // eqv. to [ fullName, allList ]
      allListList.push([fullName, allList, belt, startedOn, testedOn]);
   }
   return allListList;
};

const initMem = async (ggleID, fullName) => {
   let className = [];
   let classTime = [];
   let classTitle = [];
   
   const gglThisYear = await readSheet(ggleID, 0);
   const gglClassTable = await readSheet(ggleID, 1);
   const gglTimeTable = await readSheet(ggleID, 2);
   
   for (let i = 0; i < gglClassTable.length; i++) {
      classTime.push(gglTimeTable[i][xxxDay].trim());
      className.push(gglClassTable[i][xxxDay].trim());
      classTitle.push(gglClassTable[i].Classes.trim());
   }
   
   const patt = /[/$#][^/$#!]*/g;
   let checkedIn = [];
   let belt;
   for (let row of gglThisYear) {
      if (row.Name === fullName) {
         belt = row.Beltcolor;
         if (row[date]) {
            if (row[date].match(patt)) {
               checkedIn = row[date].match(patt).map((el) => el.slice(1));
            }
         }
      }
   }

   return { className, classTime, classTitle, checkedIn, belt };
};

exports.readSheet = readSheet;
exports.getSheetObj = getSheetObj;
exports.fetchAttendance = fetchAttendance;
exports.doesMemberExist = doesMemberExist;
exports.initMem = initMem;
