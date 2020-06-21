const { authURL, fetchGglIDURL } = require('../URL.json');
const axios = require('axios');

const login = async (req, res, next) => {
   const { authData } = req.body;
   let response1;
   let response2;

   try {
      response1 = await axios.post(authURL, authData);
   } catch (err) {
      res.json({ error: err.response.data.error });
      return next();
   }

   const { idToken, userId, email } = response1.data;
   const authSuccess = { idToken, userId, email };

   try {
      response2 = await axios.get(fetchGglIDURL);
   } catch (err) {
      res.json({ message: 'Somthing wrong happened while accessing firebase.' });
      return next();
   }

   const locName = response1.data.email.split('@')[0];
   const locData = response2.data[locName];

   const fetchSuccess = {
      ggleID: locData.thisYear.ggleSheetID,
      statsGglID: locData.stats.ggleSheetID,
      location: locData.location,
      locationID: locData.locationID,
      lastYearGglID: locData.lastYear.ggleSheetID,
   };

   res.json({ authSuccess, fetchSuccess });
};

exports.login = login;
