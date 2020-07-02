import React from 'react';
import { days } from '../../shared/refData';
import classes from './DayBar.module.css';

const now = new Date();
const day = now.getDay(); // day=0 on Sunday.
const today = days[day];
const date = now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear();

const DayBar = props => {
   let classStr = [classes.date];

   if (props.fontSize) classStr.push(classes[props.fontSize]);

   return (
      <div className={classStr.join(' ')}>
         {date} {today}
      </div>
   );
};

export default DayBar;
