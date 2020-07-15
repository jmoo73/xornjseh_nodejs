import React, { Component } from 'react';
import classes from './CheckIn.module.css';
import WelcomeToClass from './WelcomeToClass/WelcomeToClass';
import BeltSelect from './BeltSelect/BeltSelect';
import SmallClassButton from './SmallClassButton/SmallClassButton';
import Spinner from '../UI/Spinner/Spinner';
import DayBar from '../DayBar/DayBar';
import Button from '../UI/Button/Button';

class CheckIn extends Component {
   state = {
      classState: null,
      beltState: null,
      id: null, // [ person.id, person.name ]
      fullName: null,
      doMatch: false,
   };

   whenSubmitClicked = async () => {
      await this.props.whenClassClicked(this.state.classState);
      await this.props.nameClicked(this.state.id);
      await this.props.whenSubmitClicked(
         this.props.ggleID,
         this.props.statsGglID,
         this.props.locationID,
         this.props.currClass, //
         this.props.currClassID,
         this.props.persons,
         this.props.classAttender, //
         this.props.classToday
      ); // Saving the chosen attendants(inc. indivual) until now.
      this.setState({
         beltState: null,
         fullName: null,
         doMatch: false,
         id: null,
      });
   };

   classSelect = cls => {
      this.setState({
         classState: cls,
         beltState: null,
         fullName: null,
         doMatch: false,
         id: null,
      });
   };

   beltSelect = belt => {
      this.setState({
         beltState: belt,
         fullName: null,
         doMatch: false,
         id: null,
      });
   };

   firstSelect = (fullName, id) => {
      this.setState({ fullName, id });
   };

   secondSelect = fullName => {
      if (this.state.fullName === fullName) {
         this.setState({ doMatch: true });
      } else {
         this.setState({ fullName: null, id: null, doMatch: false });
      }
   };

   render() {
      let classesToday = (
         <React.Fragment>
            <div className={classes.dot} onClick={this.props.backToAuthHome}>
               .
            </div>
            <div className={classes.dayBar}>
               <DayBar fontSize="fifteen" timebar />
            </div>
            <SmallClassButton
               whenClassClicked={this.classSelect}
               classToday={this.props.classToday}
               currClass={this.state.classState}
            />
         </React.Fragment>
      );

      let beltSelect = null;
      if (this.state.classState) {
         beltSelect = (
            <React.Fragment>
               <WelcomeToClass cls={this.state.classState} />
               <BeltSelect
                  persons={this.props.persons}
                  beltState={this.state.beltState}
                  isFullName={!!this.state.fullName}
                  doMatch={this.state.doMatch}
                  beltSelect={this.beltSelect}
                  firstSelect={this.firstSelect}
                  secondSelect={this.secondSelect}
                  attender={this.props.classAttender[this.state.classState]}
               />
            </React.Fragment>
         );
      }

      let confirmBtn = '';
      if (this.state.doMatch) {
         confirmBtn = (
            <Button
               btnType="finalSubmit"
               renderClickedState={true}
               clicked={this.whenSubmitClicked}
            >
               {this.state.fullName} in {this.state.beltState}, Correct?
            </Button>
         );
      }

      return (
         <React.Fragment>
            <div className={classes.checkInWrapper}>
               {classesToday}
               {beltSelect}
               {confirmBtn}
               {this.props.saving ? <Spinner /> : null}
            </div>
         </React.Fragment>
      );
   }
}

export default CheckIn;
