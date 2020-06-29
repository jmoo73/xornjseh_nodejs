import React, { Component } from 'react';
import classes from './MemberAtt.module.css';
import Calendar from '../CheckIn/PersonalData/Calendar/Calendar';
import { days } from '../../shared/refData';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import Spinner from '../UI/Spinner/Spinner';
import RoundButton from '../UI/Button/RoundButton';

const now = new Date();
const day = now.getDay(); // day=0 on Sunday.
const today = days[day];
// date used for column title.
const date = now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear();

class MemberAtt extends Component {
   async componentDidMount() {
      await this.props.fetchAttData(
         this.props.fullName,
         this.props.ggleID,
         this.props.lastYearGglID
      );
   }

   render() {
      if (this.props.memberAttendance === null) {
         return <Spinner />;
      } else {
         // props.memberAttendance = [[fullName, allList, belt, startedOn, testedOn]]
         // single person data is requested.
         const [
            name,
            memberAttendance,
            belt,
            startedOn,
            testedOn,
         ] = this.props.memberAttendance[0];

         let todayStartTest = (
            <React.Fragment>
               <div className={classes.start}>
                  Started on : {startedOn ? startedOn : '(unavailable)'}
               </div>
               <div className={classes.test}>
                  Last tested on : {testedOn ? testedOn : '(unavailable)'}
               </div>
               <div className={classes.today}>
                  {date} {today} (Today)
               </div>
            </React.Fragment>
         );

         let calendar = memberAttendance.map(month => {
            return <Calendar key={month[0]} month={month[0]} data={month[1]} />;
         });

         return (
            <React.Fragment>
               <div className={classes.wrapper}>
                  <div className={classes.name}>
                     <RoundButton type="beltWithName" beltColor={belt}>
                        {name}
                     </RoundButton>
                  </div>
                  <div className={classes.todayStartTest}>{todayStartTest}</div>
                  <div className={classes.threeCalendars}>{calendar}</div>
               </div>
            </React.Fragment>
         );
      }
   }
}

const mapStateToProps = state => {
   return {
      fullName: state.auth.fullName,
      ggleID: state.auth.ggleID,
      lastYearGglID: state.auth.lastYearGglID,
      memberAttendance: state.mem.memberAttendance,
   };
};

const mapDispatchToProps = dispatch => {
   return {
      fetchAttData: (fullName, ggleID, lastYearGglID) =>
         dispatch(actions.fetchAttData(fullName, ggleID, lastYearGglID)),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberAtt);
