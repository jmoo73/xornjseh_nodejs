import React, { Component } from 'react';
import classes from './CheckIn.module.css';
import WelcomeToClass from './WelcomeToClass/WelcomeToClass';
import BeltSelect from './BeltSelect/BeltSelect';
import SmallClassButton from './SmallClassButton/SmallClassButton';
import Spinner from '../UI/Spinner/Spinner';
import PersonalData from './PersonalData/PersonalData';
import DayBar from '../DayBar/DayBar';
import { relativeTimeThreshold } from 'moment';

class CheckIn extends Component {
   state = {
      isNameChosen: false,
      classState: null,
      beltState: null,
      id: null, // [ person.id, person.name ]
      fullName: null,
      doMatch: false,
   };

   nameClicked = async (id, fullName) => {
      this.setState({ isNameChosen: true, id });
      await this.props.whenClassClicked(this.state.classState);
      await this.props.nameClicked(id);
      await this.props.fetchPersonalAttendance(
         this.props.ggleID,
         this.props.lastYearGglID,
         [fullName]
      );
   };

   whenSubmitClick = async () => {
      await this.props.whenSubmitClicked(
         this.props.ggleID,
         this.props.statsGglID,
         this.props.locationID,
         this.props.currClass,
         this.props.currClassID,
         this.props.persons,
         this.props.classAttender,
         this.props.classToday
      ); // Saving the chosen attendants(inc. indivual) until now.
      this.setState({ isNameChosen: false, beltState: null, id: null });
   };

   classStateChange = cls => {
      this.setState({
         classState: cls,
         beltState: null,
         fullName: null,
         doMatch: false,
         id: null,
      });
   };

   beltClicked = belt => {
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
      let logIn = null;
      if (!this.state.isNameChosen) {
         logIn = (
            <div className={classes.checkInWrapper}>
               <div className={classes.dot} onClick={this.props.backToAuthHome}>
                  .
               </div>
               <div className={classes.dayBar}>
                  <DayBar fontSize="fifteen" />
               </div>
               <SmallClassButton
                  whenClassClicked={cls => this.classStateChange(cls)}
                  classToday={this.props.classToday}
                  currClass={this.state.classState}
               />
               {this.state.classState ? (
                  <React.Fragment>
                     <WelcomeToClass cls={this.state.classState} />
                     <BeltSelect
                        currBelt={this.state.beltState}
                        beltClicked={this.beltClicked}
                        nameClicked={this.nameClicked}
                        persons={this.props.persons}
                        beltState={this.state.beltState}
                        fullName={this.state.fullName}
                        firstSelect={this.firstSelect}
                        secondSelect={this.secondSelect}
                        attender={
                           this.props.classAttender[this.state.classState]
                        }
                     />
                  </React.Fragment>
               ) : null}
            </div>
         );
      }

      confirmBtn

      return (
         <React.Fragment>
            {logIn}
            {confirmBtn}
            {this.props.saving ? <Spinner /> : null}
         </React.Fragment>
      );
   }
}

export default CheckIn;
