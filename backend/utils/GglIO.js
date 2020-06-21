const { GoogleSpreadsheet } = require('google-spreadsheet');

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
   await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY,
    });
   await doc.loadInfo(); // loads document properties and worksheets
   const sheet = doc.sheetsByIndex[index]; // Personal dailylog file
 
   return sheet;
 }
 
 exports.readSheet = readSheet;
 exports.getSheetObj = getSheetObj;