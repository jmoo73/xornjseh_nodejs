import React, { Component } from 'react';
import { connect } from 'react-redux';
import Spinner from '../../components/UI/Spinner/Spinner';
import * as actions from '../../store/actions/index';
import classes from './AuthHome.module.css';
import SquareButton from '../../components/UI/Button/SquareButton';
import BackDropBlack from '../../components/UI/BackDrop/BackDropBlack';
import CheckIn from '../../components/CheckIn/CheckIn';

const now = new Date();
const day = now.getDay(); // day=0 on Sunday.

class Home extends Component {
   state = {
      checkInScreen: false,
   };

   async componentDidMount() {
      // dataLoaded is needed to avoid unnecessary loading after login-loading.
      if (!this.props.dataLoaded && this.props.isAuthenticated && day) {
         await this.props.onStats(this.props.statsGglID, this.props.locationID);
         await this.props.onGgl(this.props.ggleID);
      }
   }

   goToCheckInScreen = () => {
      this.setState({ checkInScreen: true });
   };

   backToAuthHome = () => {
      this.setState({ checkInScreen: false });
   };

   render() {
      let checkInScreen = (
         <CheckIn
            currClass={this.props.currClass}
            currBelt={this.props.currBelt}
            classAttender={this.props.classAttender}
            classToday={this.props.classToday}
            persons={this.props.persons}
            whenClassClicked={this.props.whenClassClicked}
            nameClicked={this.props.whenNameClicked}
            beltClicked={this.props.whenBeltClicked}
            fetchPersonalAttendance={this.props.fetchPersonalAttendance}
            personalAttendance={this.props.personalAttendance}
            whenSubmitClicked={this.props.whenSubmitClicked}
            saving={this.props.gglSaving}
            backToAuthHome={this.backToAuthHome}
            loading={this.props.gglLoading}
            ggleID={this.props.ggleID}
            statsGglID={this.props.statsGglID}
            locationID={this.props.locationID}
            lastYearGglID={this.props.lastYearGglID}
            currClassID={this.props.currClassID}
         />
      );

      let individualCheckIn = null;
      if (day) {
         individualCheckIn = (
            <SquareButton clicked={this.goToCheckInScreen}>
               Individual check-in
            </SquareButton>
         );
      }

      let gglLoading = null;
      if (this.props.statsLoading || this.props.gglLoading) {
         gglLoading = <Spinner />;
      }
      return (
         <React.Fragment>
            <div className={classes.AuthHomeWrapper}>
               {gglLoading}
               <h1>태권도장 출석관리앱 ver.3</h1>
               <h4>Since Apr 12, 2020</h4>
               {individualCheckIn}
               <BackDropBlack show={this.state.checkInScreen} />
               <div className={classes.checkInWrapper}>
                  {this.state.checkInScreen ? checkInScreen : null}
               </div>
            </div>
         </React.Fragment>
      );
   }
}

const mapStateToProps = state => {
   return {
      dataLoaded: state.ggl.dataLoaded,
      gglLoading: state.ggl.loading,
      statsLoading: state.stats.loading,
      isAuthenticated: state.auth.token !== null,
      personalAttendance: state.ggl.personalAttendance,
      currClass: state.ggl.currClass,
      currClassID: state.ggl.currClassID,
      currBelt: state.ggl.currBelt,
      classToday: state.ggl.classToday,
      persons: state.ggl.persons,
      gglSaving: state.ggl.saving,
      classAttender: state.ggl.classAttender,
      ggleID: state.auth.ggleID,
      statsGglID: state.auth.statsGglID,
      locationID: state.auth.locationID,
      lastYearGglID: state.auth.lastYearGglID,
      authLoading: state.auth.loading, // To avoid firing onStats before gglID's are injected.
   };
};

const mapDispatchToProps = dispatch => {
   return {
      onGgl: ggleID => dispatch(actions.fetchGglDocs(ggleID)),
      onStats: (statsGglID, locationID) =>
         dispatch(actions.fetchStat(statsGglID, locationID)),
      fetchPersonalAttendance: (ggleID, lastYearGglID, fullNameList) =>
         dispatch(
            actions.fetchPersonalAttendance(ggleID, lastYearGglID, fullNameList)
         ),
      whenSubmitClicked: (
         ggleID,
         statsGglID,
         locationID,
         currClass,
         currClassID,
         persons,
         classAttender,
         classToday
      ) =>
         dispatch(
            actions.whenAttenderSubmitClicked(
               ggleID,
               statsGglID,
               locationID,
               currClass,
               currClassID,
               persons,
               classAttender,
               classToday
            )
         ),
      whenNameClicked: id => dispatch(actions.whenMemberNameClicked(id)),
      whenBeltClicked: belt => dispatch(actions.whenBeltClicked(belt)),
      whenClassClicked: cl => dispatch(actions.whenClassClicked(cl)),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
