import React from 'react';
import ToggleButton from '../Dropdown/ToggleButton';
import NavigationItems from '../NavigationItems/NavigationItems';
import classes from './Toolbar.module.css';

function Toolbar(props) {
   let logo = 'TKD-manager';
   if (props.location) logo = logo + ' @ ' + props.location;

   let credit = 'Designed & coded by Jeongmoo Park';

   return (
      <div className={classes.Toolbar}>
         <ToggleButton dropdownToggler={props.dropdownToggler} />
         <div className={classes.logoWrapper}>
            <div className={classes.logo}>{logo}</div>
            <div className={classes.credit}>{credit}</div>
         </div>
         <nav className={classes.DesktopOnly}>
            <NavigationItems
               isAuth={props.isAuth}
               isMemberAuth={props.isMemberAuth}
            />
         </nav>
      </div>
   );
}

export default Toolbar;
