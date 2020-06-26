import React from 'react';
import classes from './Home.module.css';

const Home = () => {

   return (
      <React.Fragment>
         <div className={classes.HomeWrapper}>
            <h1>태권도장 출석관리앱 ver.3</h1>
            <h4>Since Apr 12, 2020</h4>
         </div>
      </React.Fragment>
   );
};

export default Home;
