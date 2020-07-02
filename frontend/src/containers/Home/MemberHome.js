import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './MemberHome.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import RoundButton from '../../components/UI/Button/RoundButton';
import DayBar from '../../components/DayBar/DayBar';

const now = new Date();
const day = now.getDay(); // day=0 on Sunday.

class MemberHome extends Component {
   state = {
      currClass: null,
      currClassTitle: null,
      saving: false,
   };

   async componentDidMount() {
      if (
         !this.props.className &&
         this.props.isMemberAuthenticated &&
         day !== 0
      ) {
         await this.props.initMember(this.props.ggleID, this.props.fullName);
      }
   }

   setCurrClass = cls => {
      if (!this.props.checkedIn.includes(cls)) {
         let index = this.props.className.indexOf(cls);
         this.setState({
            currClass: cls,
            currClassTitle: this.props.classTitle[index],
         });
      } else {
         this.setState({
            currClass: null,
            currClassTitle: null,
         });
      }
   };

   fireCheckIn = async () => {
      this.setState({ saving: true });
      await this.props.checkIn(
         this.props.fullName,
         this.props.ggleID,
         this.props.statsGglID,
         this.state.currClass,
         this.state.currClassTitle,
         this.props.locationID
      );
      this.setState({ currClass: null, saving: false });
   };

   render() {
      let classList = null;
      let spinner = null;
      let btn = null;
      let name = null;

      if (this.props.className === null || this.state.saving) {
         spinner = <Spinner />;
      }

      if (day !== 0 && this.props.className !== null) {
         name = (
            <div className={classes.name}>
               <RoundButton type="beltWithName" beltColor={this.props.belt}>
                  {this.props.fullName}
               </RoundButton>
            </div>
         );

         classList = this.props.className.map((cl, index) => {
            let classStr = [classes.btn];
            if (this.props.checkedIn.includes(cl))
               classStr.push(classes.checkedInClass);
            if (this.state.currClass === cl) classStr.push(classes.chosen);
            return (
               <button
                  key={cl}
                  className={classStr.join(' ')}
                  onClick={() => this.setCurrClass(cl)}
               >
                  <div className={classes.timeClass}>
                     <div className={classes.time}>
                        {this.props.classTime[index]}
                     </div>
                     <div className={classes.cls}>{cl} </div>
                  </div>
               </button>
            );
         });

         if (this.state.currClass) {
            btn = (
               <button className={classes.confirm} onClick={this.fireCheckIn}>
                  Check-in
               </button>
            );
         }
      }

      return (
         <div>
            {name}
            <DayBar fontSize='twenty' />
            <div className={classes.btnWrapper}>{classList}</div>
            <div className={classes.confirmWrapper}>{btn}</div>
            {spinner}
         </div>
      );
   }
}

const mapStateToProps = state => {
   return {
      isMemberAuthenticated: state.auth.isMemberAuthenticated,
      ggleID: state.auth.ggleID,
      statsGglID: state.auth.statsGglID,
      fullName: state.auth.fullName,
      locationID: state.auth.locationID,
      belt: state.mem.belt,
      className: state.mem.className,
      classTime: state.mem.classTime,
      classTitle: state.mem.classTitle,
      checkedIn: state.mem.checkedIn,
      currClass: state.mem.currClass,
      memLoading: state.mem.loading,
      memSaving: state.mem.saving,
   };
};

const mapDispatchToProps = dispatch => {
   return {
      initMember: (ggleID, fullName) =>
         dispatch(actions.initMember(ggleID, fullName)),
      checkIn: (
         fullName,
         ggleID,
         statsGglID,
         currClass,
         currClassTitle,
         locationID
      ) =>
         dispatch(
            actions.checkIn(
               fullName,
               ggleID,
               statsGglID,
               currClass,
               currClassTitle,
               locationID
            )
         ),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(MemberHome);
