import React, { Component } from 'react';
import classes from './NameSelect.module.css';
import RoundButton from '../../UI/Button/RoundButton';
import * as _ from 'lodash';

class NameSelect extends Component {
   firstNameChosen = (id, firstFullName, beltColor) => {
      this.setState({ id, firstFullName, beltColor, doMatch: false });
   };

   secondNameChosen = secondFullName => {
      if (this.state.firstFullName === secondFullName) {
         this.setState({ doMatch: true });
      } else {
         this.setState({
            id: null,
            firstFullName: null,
            beltColor: null,
            doMatch: false,
         });
      }
   };

   render() {
      let attenderIdList = this.props.attender.map(per => per[1]);
      let firstName = (
         <div className={classes.firstOuterWrapper}>
            <div className={classes.firstNameNote}>
               Choose your first name...
            </div>
            <div className={classes.firstNameWrapper}>
               {_.shuffle(
                  this.props.persons.map(person => {
                     if (person.status === 'ACTIVE') {
                        return (
                           <RoundButton
                              type="nameBig"
                              key={person.id}
                              chosen={
                                 attenderIdList.includes(person.id) ||
                                 this.props.currBelt !== person.belt
                              }
                              beltColor={person.belt}
                              clicked={() =>
                                 this.props.firstSelect(person.name, person.id)
                              }
                           >
                              {person.name.split(' ')[0]}
                           </RoundButton>
                        );
                     } else return null;
                  })
               )}
            </div>
         </div>
      );

      let secondName = (
         <div className={classes.firstOuterWrapper}>
            <div className={classes.secondNameNote}>
               Choose your second name...
            </div>
            <div className={classes.secondNameWrapper}>
               {_.shuffle(
                  this.props.persons.map(person => {
                     if (person.status === 'ACTIVE') {
                        return (
                           <RoundButton
                              type="nameBig"
                              key={person.id}
                              chosen={
                                 attenderIdList.includes(person.id) ||
                                 this.props.currBelt !== person.belt
                              }
                              beltColor={person.belt}
                              clicked={() =>
                                 this.props.secondSelect(person.name)
                              }
                           >
                              {person.name.split(' ')[1]}
                           </RoundButton>
                        );
                     } else return null;
                  })
               )}
            </div>
         </div>
      );

      return (
         <div className={classes.wrapper}>
            {!this.props.isFullName && !this.props.doMatch && firstName}
            {this.props.isFullName && !this.props.doMatch && secondName}
         </div>
      );
   }
}

export default NameSelect;
