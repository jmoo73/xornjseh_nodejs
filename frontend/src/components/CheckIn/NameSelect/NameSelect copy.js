import React, { Component } from 'react';
import classes from './NameSelect.module.css';
import RoundButton from '../../UI/Button/RoundButton';
import Button from '../../UI/Button/Button';

class NameSelect extends Component {
   state = {
      id: null, // [ person.id, person.name ]
      firstFullName: null,
      beltColor: null,
      doMatch: false,
   };

   firstNameChosen = (id, firstFullName, beltColor) => {
      this.setState({ id, firstFullName, beltColor });
   };

   secondNameChosen = secondFullName => {
      if (this.state.firstFullName === secondFullName) {
         this.setState({ doMatch: true });
      } else {
         this.setState({ id: null, firstFullName: null, beltColor: null });
      }
   };

   render() {
      let attenderIdList = this.props.attender.map(per => per[1]);
      let firstName = (
         <div className={classes.firstNameWrapper}>
            {this.props.persons.map(person => (
               <RoundButton
                  type="nameBig"
                  key={person.id}
                  makeBiggerButton={this.state.id === person.id ? true : false}
                  chosen={
                     attenderIdList.includes(person.id) ||
                     this.props.currBelt !== person.belt
                  }
                  beltColor={person.belt}
                  clicked={() =>
                     this.firstNameChosen(person.id, person.name, person.belt)
                  }
               >
                  {person.name.split(' ')[0]}
               </RoundButton>
            ))}
         </div>
      );

      let secondName = (
         <div className={classes.secondNameWrapper}>
            {this.props.persons.map(person => (
               <RoundButton
                  type="nameBig"
                  key={person.id}
                  makeBiggerButton={this.state.id === person.id ? true : false}
                  chosen={
                     attenderIdList.includes(person.id) ||
                     this.props.currBelt !== person.belt
                  }
                  beltColor={person.belt}
                  clicked={() => this.secondNameChosen(person.name)}
               >
                  {person.name.split(' ')[1]}
               </RoundButton>
            ))}
         </div>
      );

      let submitButton = null;
      if (
         this.state.id !== null &&
         this.props.currBelt === this.state.beltColor &&
         this.state.doMatch
      ) {
         submitButton = (
            <div className={classes.submitBtnWrapper}>
               <Button
                  btnType="confirmName"
                  renderClickedState={true}
                  clicked={() =>
                     this.props.nameClicked(
                        this.state.id,
                        this.state.firstFullName
                     )
                  }
               >
                  {this.state.fullName}, correct?
               </Button>
            </div>
         );
      }

      return (
         <div className={classes.wrapper}>
            {!this.state.firstFullName && firstName}
            {this.state.firstFullName &&
               this.props.currBelt === this.state.beltColor &&
               secondName}
            {this.state.doMatch && this.props.currBelt === this.state.beltColor && submitButton}
         </div>
      );
   }
}

export default NameSelect;