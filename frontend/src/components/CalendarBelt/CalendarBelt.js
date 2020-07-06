import React from 'react';
import classes from './CalendarBelt.module.css';
import Record from './Record/Record';

const PersonalRecord = props => {
   let calendar = props.data.map(member => {
      return (
         <Record
            key={member[0]}
            name={member[0]}
            belt={member[2]}
            data={member[1]}
            status={member[5]}
            membership={member[6]}
         />
      );
   });

   const sevenWeeks = () => {
      let weekStr = 'SMTWTFS'.repeat(6);
      let header = ['Tt', 'BB', 'SP'];
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
         <div className={classes.name}>Name</div>
         <div className={classes.monthText}>Mth</div>
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
