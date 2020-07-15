import React from 'react';
import classes from './SmallClassButton.module.css';

function SmallClassButton(props) {
   let smallClassButton = (
      <div className={classes.wrapper}>
         {props.classToday.map(cls => {
            let classStr = [classes.smallClassButton];
            if (cls[1] === '') return null;
            if (cls[1] === props.currClass) classStr.push(classes.chosenClass);
            return (
               <button
                  key={cls[1]}
                  className={classStr.join(' ')}
                  onClick={() => props.whenClassClicked(cls[1])}
               >
                  <div className={classes.name}>{cls[1]}</div>
                  <div className={classes.time}>{cls[2]}</div>
               </button>
            );
         })}
      </div>
   );
   return <React.Fragment>{smallClassButton}</React.Fragment>;
}

export default SmallClassButton;
