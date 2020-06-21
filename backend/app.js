const express = require('express');
const bodyParser = require('body-parser');
const auth = require('./routers/auth-routes');
const classTable = require('./routers/classTable-routes');
const gglStats = require('./routers/gglStats-routes');
const gglThisYear = require('./routers/gglThisYear-routes');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
   );
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

   next();
});

app.use('/auth', auth);
app.use('/classTable', classTable);
app.use('/gglStats', gglStats);
app.use('/gglThisYear', gglThisYear);

app.listen(process.env.PORT || 5000);
