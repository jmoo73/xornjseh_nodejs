import React from 'react';
import classes from './Record.module.css';

const now = new Date();
const date = now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear();

const LinearCalendar = props => {
   let name = <div className={classes.name}>{props.name.split(' ')[0]}</div>;

   const oneLayer = (month, dateList) => {
      let total = 0;
      let board = 0;
      let spar = 0;
      let dayList = dateList.map(eachDay => {
         let day = eachDay.date.split('/')[1];
         let classStr = [classes.day];
         let attNum;
         let bs = '';
         if (eachDay.attendance && eachDay.needDataFetch) {
            attNum = eachDay.attendance.length;
            total += attNum;
            eachDay.attendance.forEach(el => {
               if (el.includes('Board')) {
                  bs += 'B';
                  board++;
               }
               if (el.includes('Spar')) {
                  bs += 'S';
                  spar++;
               }
            });
         }

         if (attNum === 1) classStr.push(classes.one);
         if (attNum === 2) classStr.push(classes.two);
         if (attNum >= 3) classStr.push(classes.three);
         if (eachDay.test && eachDay.needDataFetch) classStr.push(classes.test);
         if (eachDay.start && eachDay.needDataFetch) classStr.push(classes.start);
         if (eachDay.date === date && eachDay.needDataFetch) classStr.push(classes.today);
         if (eachDay.day === 'Sunday') classStr.push(classes.sunday);
         
         return (
            <div key={eachDay.id} className={classStr.join(' ')}>
               <div className={classes.dayUp}>
                  {eachDay.needDataFetch ? day : null}
               </div>
               <div className={classes.dayDown}>{bs}</div>
            </div>
         );
      });
      let stat = (
         <div className={classes.stat}>
            <div className={classes.total}>{total}</div>
            <div className={classes.board}>{board}</div>
            <div className={classes.spar}>{spar}</div>
         </div>
      )

      return (
         <div className={classes.lineCalendar}>
            <div className={classes.monthText}>{month}</div>
            {stat}
            {dayList}
         </div>
      );
   };

   let threeMonthData = (
      <div className={classes.threeMonths}>
         {props.data.map(month => {
            let layer = oneLayer(month[0], month[1]);
            return (
               <div key={month[0]} className={classes.oneMonthLayer}>
                  {layer}
               </div>
            );
         })}
      </div>
   );

   return (
      <div className={classes.wrapper}>
         {name}
         {threeMonthData}
         {/* {stats} */}
      </div>
   );
};

export default LinearCalendar;
