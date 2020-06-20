const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('../client_secret.json');

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
 
 exports.readSheet = readSheet;
 exports.getSheetObj = getSheetObj;