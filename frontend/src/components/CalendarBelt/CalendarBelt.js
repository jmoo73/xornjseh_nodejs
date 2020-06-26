import React from 'react';
import classes from './CalendarBelt.module.css';
import Record from './Record/Record';

const PersonalRecord = props => {

   let calendar = props.data.map(member => {
      return <Record key={member[0]} name={member[0]} data={member[1]} />;
   });

   const sevenWeeks = () => {
      let weekStr = 'SMTWTFS'.repeat(6);
      let header = ['계', 'BB', 'SP'];
      let tbs = header.map(item => {
         return (
            <div key={item} className={classes.stat}>
               {item}
            </div>
         );
      });

      let week = weekStr.split('').map((day, index) => {
         let classStr = [classes.day];
         if (index % 7 === 0) classStr.push(classes.sunday);
         return (
            <div key={index} className={classStr.join(' ')}>
               {day}
            </div>
         );
      });

      return [...tbs, ...week];
   };

   let dummyTitle = (
      <div className={classes.dummyTitle}>
         <div className={classes.name}>이름</div>
         <div className={classes.monthText}>달</div>
         {sevenWeeks()}
      </div>
   );

   return (
      <React.Fragment>
         <div className={classes.wrapper}>
            {dummyTitle}
            <div className={classes.calendarWrapper}>{calendar}</div>
         </div>
      </React.Fragment>
   );
};

export default PersonalRecord;