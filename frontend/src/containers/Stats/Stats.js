import React, { Component } from 'react';
import { connect } from 'react-redux';
import RoundButton from '../../components/UI/Button/RoundButton';
import { colors, memberships, membershipsTitle } from '../../shared/refData';
import classes from './Stats.module.css';
import * as actions from '../../store/actions/index';
import CalendarBelt from '../../components/CalendarBelt/CalendarBelt';
import Spinner from '../../components/UI/Spinner/Spinner';

class Stats extends Component {
   state = {
      currBelt: null,
      currMembership: null,
      loading: false,
      loaded: false,
   };

   async beltClicked(belt) {
      this.setState({ currMembership: null });
      if (belt !== this.state.currBelt) {
         this.setState({ currBelt: belt, loading: true, loaded: false });
         let names = this.props.persons
            .filter(
               person =>
                  person.belt === belt &&
                  person.status !== 'DROPOUT' &&
                  person.status !== 'SUSPEND'
            )
            .map(person => person.name);

         await this.props.fetchPersonalAttendance(
            this.props.ggleID,
            this.props.lastYearGglID,
            names
         );

         this.setState({ loading: false, loaded: true });
      }
   }

   async membershipClicked(membership) {
      this.setState({ currBelt: null });
      if (membership !== this.state.currMembership) {
         this.setState({
            currMembership: membership,
            loading: true,
            loaded: false,
         });
         let names = this.props.persons
            .filter(
               person =>
                  person.membership === membership &&
                  person.status !== 'DROPOUT' &&
                  person.status !== 'SUSPEND'
            )
            .map(person => person.name);

         await this.props.fetchPersonalAttendance(
            this.props.ggleID,
            this.props.lastYearGglID,
            names
         );

         this.setState({ loading: false, loaded: true });
      }
   }

   render() {
      let beltTotal = [];
      for (let i = 0; i < colors.length; i++) {
         beltTotal.push(0);
      }
      this.props.persons.forEach(person => {
         if (person.status !== 'DROPOUT' && person.status !== 'SUSPEND')
            beltTotal[colors.indexOf(person.belt)]++;
      });

      let membershipTotal = [];
      for (let i = 0; i < memberships.length; i++) {
         membershipTotal.push(0);
      }
      this.props.persons.forEach(person => {
         if (person.status !== 'DROPOUT' && person.status !== 'SUSPEND')
            membershipTotal[memberships.indexOf(person.membership)]++;
      });

      let beltList = (
         <div className={classes.chooseColor}>
            {colors.map((belt, index) => {
               return (
                  <RoundButton
                     type="beltNum"
                     key={index}
                     beltColor={belt}
                     chosen={this.state.currBelt === belt}
                     clicked={() => this.beltClicked(belt)}
                  >
                     {beltTotal[index]}
                  </RoundButton>
               );
            })}
         </div>
      );

      let membershipList = (
         <div className={classes.chooseMembership}>
            {memberships.map((ms, index) => {
               let classStr = [classes.membershipBtn];
               if (this.state.currMembership === ms)
                  classStr.push(classes.chosen);
               if (ms === 'MP') classStr.push(classes.MP);
               if (ms === 'BBP') classStr.push(classes.BBP);
               if (ms === 'TRIAL') classStr.push(classes.TRIAL);
               if (ms === '1MO') classStr.push(classes.oneMO);
               return (
                  <button
                     key={ms}
                     className={classStr.join(' ')}
                     onClick={() => this.membershipClicked(ms)}
                  >
                     <div className={classes.msTitle}>
                        {membershipsTitle[index]}
                     </div>
                     <div className={classes.msNumber}>
                        {membershipTotal[index]}
                     </div>
                  </button>
               );
            })}
         </div>
      );

      let personalData = null;
      if (this.state.loaded) {
         personalData = <CalendarBelt data={this.props.personalAttendance} />;
      }

      let spinner = null;
      if (this.state.loading) {
         spinner = (
            <React.Fragment>
               <Spinner />
            </React.Fragment>
         );
      }

      return (
         <React.Fragment>
            <div className={classes.wrapper}>
               <div className={classes.chooseWrapper}>
                  {beltList}
                  {membershipList}
               </div>
               {personalData}
            </div>
            {spinner}
         </React.Fragment>
      );
   }
}

const mapStateToProps = state => {
   return {
      persons: state.ggl.persons,
      gglLoading: state.ggl.loading,
      ggleID: state.auth.ggleID,
      lastYearGglID: state.auth.lastYearGglID,
      personalAttendance: state.ggl.personalAttendance,
   };
};

const mapDispatchToProps = dispatch => {
   return {
      fetchPersonalAttendance: (ggleID, lastYearGglID, fullName) =>
         dispatch(
            actions.fetchPersonalAttendance(ggleID, lastYearGglID, fullName)
         ),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
