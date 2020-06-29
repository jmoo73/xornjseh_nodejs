const axios = require('axios');
const gglIO = require('../utils/GglIO');

const now = new Date();
const date = now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear();

const auth = async (req, res, next) => {
   const { fullName, location } = req.body; // location = 'chapelhill-nc'

   let response;
   try {
      response = await axios.get(process.env.FETCH_GGLID_URL);
   } catch (err) {
      res.json({
         message: 'Somthing went wrong while accessing db.',
      });
      return next();
   }

   let exist = false;
   try {
      exist = await gglIO.doesMemberExist(
         fullName,
         response.data[location].thisYear.ggleSheetID
      );
   } catch (err) {
      res.json({
         message:
            'Something went wrong while looking up data (Check spell!).',
      });
      return next();
   }

   if (!exist) {
      res.json({ message: 'Name not exists (Check spell!).' });
      return next();
   }

   res.json({
      location,
      fullName,
      ggleID: response.data[location].thisYear.ggleSheetID,
      lastYearGglID: response.data[location].lastYear.ggleSheetID,
      statsGglID: response.data[location].stats.ggleSheetID,
      locationID: response.data[location].locationID,
   });
};

const initMember = async (req, res, next) => {
   const { ggleID, fullName } = req.body; // location = 'chapelhill-nc'

   let classData = null;
   try {
      classData = await gglIO.initMem(ggleID, fullName);
   } catch (err) {}

   res.json({
      ...classData, // classData = {}. { className, classTime, classTitle, checkedIn, belt }
   });
};

const fetchAttData = async (req, res, next) => {
   const { fullName, ggleID, lastYearGglID } = req.body;
   
   let memberAttendance;
   try {
      memberAttendance = await gglIO.fetchAttendance(ggleID, lastYearGglID, [
         fullName,
      ]);
   } catch (err) {
      res.json({
         message: 'Something went wrong while looking up data (Try later!).',
      });
      return next();
   }

   res.json({ memberAttendance }); // this is the array of array!!
};

const checkIn = async (req, res, next) => {
   const {
      fullName,
      ggleID,
      statsGglID,
      currClass,
      currClassTitle,
      locationID,
   } = req.body;

   const gglThisYear = await gglIO.readSheet(ggleID, 0);
   const stats = await gglIO.readSheet(statsGglID, +locationID);

   let attStr = null;
   if (currClass.includes('Spar')) attStr = '$' + currClass;
   if (currClass.includes('Board')) attStr = '#' + currClass;
   attStr = '/' + currClass;

   const patt = /[/$#][^/$#!]*/g;
   let checkedIn;
   for (let i = 0; i < gglThisYear.length; i++) {
      if ((gglThisYear[i].Name = fullName)) {
         gglThisYear[i][date] =
            (gglThisYear[i][date] ? gglThisYear[i][date] : '') + attStr;
         checkedIn = gglThisYear[i][date].match(patt).map((el) => el.slice(1));
         await gglThisYear[i].save();
         break;
      }
   }

   for (let i = 0; i < stats.length; i++) {
      if (stats[i].Date === date) {
         stats[i][currClassTitle] =
            (stats[i][currClassTitle] ? +stats[i][currClassTitle] : 0) + 1;
         await stats[i].save();
         break;
      }
   }

   res.json({ checkedIn });
};

exports.auth = auth;
exports.initMember = initMember;
exports.checkIn = checkIn;
exports.fetchAttData = fetchAttData;
