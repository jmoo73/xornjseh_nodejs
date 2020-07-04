import React, { Component } from 'react';
import classes from './BeltSelect.module.css';
import { colors } from '../../../shared/refData';
import RoundButton from '../../UI/Button/RoundButton';
import NameSelect from '../NameSelect/NameSelect';

class BeltSelect extends Component {
   render() {
      let beltCollection = (
         <div className={classes.wrapper}>
            {colors.map(clr => (
               <RoundButton
                  key={clr}
                  type="beltBig"
                  beltColor={clr}
                  clicked={() => this.props.beltSelect(clr)}
               />
            ))}
         </div>
      );

      let nameSelect = this.props.beltState ? (
         <NameSelect
            persons={this.props.persons}
            currBelt={this.props.beltState}
            firstSelect={this.props.firstSelect}
            secondSelect={this.props.secondSelect}
            attender={this.props.attender}
            isFullName={this.props.isFullName}
            doMatch={this.props.doMatch}
         />
      ) : (
         <div className={classes.chooseBeltNote}>Choose your belt color...</div>
      );

      return (
         <React.Fragment>
            <div className={classes.outerWrapper}>
               {beltCollection}
               {nameSelect}
            </div>
         </React.Fragment>
      );
   }
}

export default BeltSelect;
