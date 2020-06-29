import React from 'react'
import NavigationItem from "./NavigationItem/NavigationItem"
import classes from "./NavigationItems.module.css"
import { day } from '../../../shared/refData';

function NavigationItems(props) {
  let authItems = (
    <React.Fragment>
      <NavigationItem link="/auth-home" exact>Home</NavigationItem>
      {day? <NavigationItem link="/dailylog" exact>Attendance</NavigationItem>: null}
      {day? <NavigationItem link="/weeklylog" exact>Week</NavigationItem>: null}
      {day? <NavigationItem link="/stats" exact>Stat</NavigationItem>: null}
      {day? <NavigationItem link="/updatemember" exact>Update</NavigationItem> : null}
    </React.Fragment>
  )
  
  let memItems = (
    <React.Fragment>
    {day? <NavigationItem link="/mem-checkin" exact>CheckIn</NavigationItem>: null}
    <NavigationItem link="/mem-attendance" exact>Attendance</NavigationItem>
    </React.Fragment>
  )

  let logOut = null; 
  if (props.isAuth) {
    logOut = (<NavigationItem link="/logout" exact>SignOut</NavigationItem>);
  } 
  if (props.isMemberAuth) {
    logOut = (<NavigationItem link="/mem-logout" exact>SignOut</NavigationItem>);
  }

  return (
    <ul className={classes.NavigationItems}>
      {!props.isAuth && !props.isMemberAuth ? <NavigationItem link="/" exact>Home</NavigationItem> : null}
      {props.isAuth ? authItems : null}
      {props.isMemberAuth ? memItems : null}
      {props.isAuth || props.isMemberAuth ?  logOut : <NavigationItem link="/auth" exact>SignIn
        </NavigationItem> }
    </ul>
  )
}

export default NavigationItems
