import React from 'react';
import classes from './RoundButton.module.css';

function RoundButton(props) {
   let classPile = [];

   switch (props.type) {
      case 'beltWithName':
         classPile = [classes.NameButton, classes[props.beltColor]];
         break;
      case 'belt':
         classPile = [classes.BeltButton, classes[props.beltColor]];
         if (props.chosen) {
            classPile.push(classes.BeltChosen);
            // classPile.push(classes.biggerButton);
         }
         break;
      case 'beltNum':
         classPile = [classes.BeltButton, classes[props.beltColor], classes.BeltNum];
         if (props.chosen) {
            classPile.push(classes.BeltChosen);
            // classPile.push(classes.biggerButton);
         }
         break;
      case 'beltBig':
         classPile = [classes.BeltButtonBig, classes[props.beltColor]];
         if (props.chosen) {
            classPile.push(classes.BeltChosen);
            // classPile.push(classes.biggerButton);
         }
         break;
      case 'name':
         classPile = [classes.BeltButton, classes[props.beltColor]];
         if (props.chosen) {
            classPile.push(classes.NameChosen);
         }
         if (props.makeBiggerButton) {
            classPile.push(classes.biggerButton);
         }
         break;
      case 'nameBig':
         classPile = [classes.nameButtonBig, classes[props.beltColor]];
         if (props.chosen) {
            classPile.push(classes.NameChosen);
         }
         if (props.makeBiggerButton) {
            classPile.push(classes.biggerButton);
         }
         break;
      case 'namePressed':
         classPile = [
            classes.BeltButton,
            classes[props.beltColor],
            classes.BtnPressed,
         ];
         break;
      case 'statName':
         classPile = [
            classes.statName,
            classes[props.beltColor],
         ];
         break;
      default:
         break;
   }

   return (
      <div>
         <button className={classPile.join(' ')} onClick={props.clicked}>
            {props.children}
         </button>
      </div>
   );
}

export default RoundButton;
