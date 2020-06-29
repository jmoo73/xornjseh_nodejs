import React, { Component } from 'react';
import { connect } from 'react-redux';
import classes from './MemberHome.module.css';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import RoundButton from '../../components/UI/Button/RoundButton';

const now = new Date();
const day = now.getDay(); // day=0 on Sunday.

class MemberHome extends Component {
   state = {
      currClass: null,
      saving: false,
   };

   async componentDidMount() {
      if (!this.props.className && this.props.isMemberAuthenticated && day) {
         await this.props.initMember(this.props.ggleID, this.props.fullName);
      }
   }

   setCurrClass(cls) {
      this.setState({ currClass: cls });
   }

   async fireCheckIn() {
      this.setState({ saving: true });
      await this.props.checkIn(
         this.props.fullName,
         this.props.ggleID,
         this.props.statsGglID,
         this.state.currClass,
         this.props.currClassTitle,
         this.props.locationID
      );
      this.setState({ currClass: null, saving: false });
   }

   render() {
      let classList = null;
      let spinner = null;
      let btn = null;

      if (day !== 0) {
         classList = this.props.className.map((cl, index) => {
            let classStr = [classes.btn];
            if (this.props.checkedIn.includes(cl))
               classStr.push(classes.checkedIn);
            return (
               <button
                  key={cl}
                  className={classStr.join(' ')}
                  onClick={() => this.setCurrClass(cl)}
               >
                  {this.props.classTime[index]}: {cl}
               </button>
            );
         });

         if (this.props.memSaving || this.props.memLoading) {
            spinner = <Spinner />;
         }

         if (this.props.currClass) {
            btn = (
               <button className={classes.confirm} onClick={this.fireCheckIn}>
                  Check-in
               </button>
            );
         }
      }

      return (
         <div>
            <div className={classes.name}>
               <RoundButton type="BeltWithName" beltColor={this.props.belt}>
                  {this.props.fullName}
               </RoundButton>
            </div>
            {classList}
            {btn}
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
      checkedIn: state.mem.checkedIn,
      currClassTitle: state.mem.currClassTitle,
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
