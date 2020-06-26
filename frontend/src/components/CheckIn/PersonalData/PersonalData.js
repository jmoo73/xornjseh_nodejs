import React from 'react';
import Button from '../../UI/Button/Button';
import classes from './PersonalData.module.css';
import Calendar from './Calendar/Calendar';
import { days } from '../../../shared/refData';

const now = new Date();
const day = now.getDay(); // day=0 on Sunday.
const today = days[day];
// date used for column title.
const date = now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear();

const PersonalData = props => {
   let todayStartTest = (
      <React.Fragment>
         <div className={classes.start}>
            Started on :{' '}
            {props.persons[props.id].startedOn
               ? props.persons[props.id].startedOn
               : '(unavailable)'}
         </div>
         <div className={classes.test}>
            Last tested on :{' '}
            {props.persons[props.id].testedOn
               ? props.persons[props.id].testedOn
               : '(unavailable)'}
         </div>
         <div className={classes.today}>
            {date} {today} (Today)
         </div>
      </React.Fragment>
   );

   let calendar = props.personalAttendance[0][1].map(month => {
            return <Calendar key={month[0]} month={month[0]} data={month[1]} />;
   });

   return (
      <React.Fragment>
         <div className={classes.wrapper}>
            <div className={classes.title}>Attendance</div>
            <div className={classes.name}>{props.persons[props.id].name}</div>
            <div className={classes.todayStartTest}>{todayStartTest}</div>
            <div className={classes.threeCalendars}>{calendar}</div>
            <Button
               btnType="finalSubmit"
               renderClickedState={true}
               clicked={props.whenSubmitClick}
            >
               Confirm
            </Button>
         </div>
      </React.Fragment>
   );
};

export default PersonalData;
