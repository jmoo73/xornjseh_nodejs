import React, { Component } from 'react';
import { connect } from 'react-redux';
import RoundButton from '../../components/UI/Button/RoundButton';
import { colors } from '../../shared/refData';
import classes from './Stats.module.css';
import * as actions from '../../store/actions/index';
import CalendarBelt from '../../components/CalendarBelt/CalendarBelt';
import Spinner from '../../components/UI/Spinner/Spinner';

class Stats extends Component {
   state = {
      currBelt: null,
      loading: false,
      loaded: false,
   };

   async beltClicked(belt) {
      this.setState({ currBelt: belt, loading: true, loaded: false });
      let names = this.props.persons
         .filter(person => person.belt === belt)
         .map(person => person.name);

      await this.props.fetchPersonalAttendance(
         this.props.ggleID,
         this.props.lastYearGglID,
         names
      );

      this.setState({ loading: false, loaded: true });
   }

   render() {
      let beltTotal = [];
      for (let i = 0; i < colors.length; i++) {
         beltTotal.push(0);
      }

      this.props.persons.forEach(person => {
         beltTotal[colors.indexOf(person.belt)]++;
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

      let personalData = null;

      if (this.state.loaded) {
         personalData = <CalendarBelt data={this.props.personalAttendance} />;
      }

      let spinner = null;
      if (this.state.loading) {
         spinner = (
            <React.Fragment>
               <Spinner />
               <h3>Fetching attendance data...</h3>
            </React.Fragment>
         );
      }

      return (
         <React.Fragment>
            <div className={classes.wrapper}>
               {beltList}
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
