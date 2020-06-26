const axios = require('axios');
const gglIO = require('../utils/GglIO');

const memberAuth = async (req, res, next) => {
   const { fullName, location } = req.body;

   let response;
   try {
      response = await axios.get(process.env.FETCH_GGLID_URL);
   } catch (err) {
      res.json({
         message: 'Somthing wrong happened while accessing firebase.',
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
         message: 'Something wrong happened while looking up data.(name)',
      });
      return next();
   }

   if (!exist) {
      res.json({ message: 'Name not exist.' });
      return next();
   }

   let memberAttendance;
   try {
      memberAttendance = await gglIO.fetchAttendance(
         response.data[location].thisYear.ggleSheetID,
         response.data[location].lastYear.ggleSheetID,
         [fullName]
      );
   } catch (err) {
      res.json({
         message: 'Something wrong happend while looking up data.(data)',
      });
      return next();
   }

   res.json({ memberAttendance, location });
};

exports.memberAuth = memberAuth;
