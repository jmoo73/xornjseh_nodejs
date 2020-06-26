import React from 'react';
import classes from './MemberHome.module.css';
import Calendar from '../../components/CheckIn/PersonalData/Calendar/Calendar';
import { days } from '../../shared/refData';
import { connect } from 'react-redux';

const now = new Date();
const day = now.getDay(); // day=0 on Sunday.
const today = days[day];
// date used for column title.
const date = now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear();

const MemberHome = props => {
   // props.memberAttendance = [[fullName, allList, belt, startedOn, testedOn]]
   // single person data is requested.
   let name = props.memberAttendance[0];
   let memberAttendance = props.memberAttendance[1];
   // let belt = memberAttendance[2];
   let startedOn = props.memberAttendance[3];
   let testedOn = props.memberAttendance[4];
   
   let todayStartTest = (
      <React.Fragment>
         <div className={classes.start}>
            Started on : {startedOn ? startedOn : '(unavailable)'}
         </div>
         <div className={classes.test}>
            Last tested on : {testedOn ? testedOn : '(unavailable)'}
         </div>
         <div className={classes.today}>
            {date} {today} (Today)
         </div>
      </React.Fragment>
   );

   let calendar = memberAttendance.map(month => {
      return <Calendar key={month[0]} month={month[0]} data={month[1]} />;
   });

   return (
      <React.Fragment>
         <div className={classes.wrapper}>
            <div className={classes.title}>Attendance</div>
            <div className={classes.name}>{name}</div>
            <div className={classes.todayStartTest}>{todayStartTest}</div>
            <div className={classes.threeCalendars}>{calendar}</div>
         </div>
      </React.Fragment>
   );
};

const mapStateToProps = state => {
   return {
      location: state.auth.location,
      memberAttendance: state.auth.memberAttendance[0],
   };
};

export default connect(mapStateToProps)(MemberHome);
