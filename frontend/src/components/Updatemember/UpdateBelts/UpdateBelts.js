import React, { Component } from 'react';
import ChooseBeltColor from './ChooseBeltColor/ChooseBeltColor';
import ChooseNames from './ChooseNames/ChooseNames';
import ShowChosenNames from './ShowChosenNames/ShowChosenNames';
import classes from './UpdateBelts.module.css';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import Spinner from '../../UI/Spinner/Spinner';
import BackDrop from '../../UI/BackDrop/BackDrop';

class UpdateBelts extends Component {
   state = {
      currBeltColor: 'White',
      testees: [], //[ ['BeltColor', index], ... ]
   };

   switchBeltColor = color => {
      this.setState({ currBeltColor: color });
   };

   handleTestee = (testee, action) => {
      let testees = this.state.testees;
      if (action === 'add') {
         testees.push(testee);
      }
      if (action === 'remove') {
         testees = testees.filter(each => testee[1] !== each[1]);
      }
      this.setState({ testees });
   };

   triggerSave = async () => {
      await this.props.saveTestee(
         this.props.ggleID,
         this.state.testees,
         this.props.locationID
      );
      await this.props.onGgl(
         this.props.ggleID,
         this.props.membershipGglID,
         this.props.locationID
      );
      this.props.resetBtn();
   };

   render() {
      let whileSaving = null;
      if (this.props.saving || this.props.loading) {
         whileSaving = <Spinner />;
      }

      return (
         <React.Fragment>
            <BackDrop
               show={
                  this.props.show && !this.props.saving && !this.props.loading
               }
               clicked={() => this.props.resetButtons('backHome')}
            />
            <div className={classes.updateWrapper}>
               <ChooseBeltColor
                  currBeltColor={this.state.currBeltColor}
                  clicked={this.switchBeltColor}
               />
               <ChooseNames
                  currBeltColor={this.state.currBeltColor}
                  persons={this.props.persons}
                  testees={this.state.testees}
                  clicked={this.handleTestee}
               />
               <div className={classes.garoLineUpdate}></div>
               <ShowChosenNames
                  triggerSave={this.triggerSave}
                  testees={this.state.testees}
                  clicked={this.handleTestee}
                  persons={this.props.persons}
               />
            </div>
            {whileSaving}
         </React.Fragment>
      );
   }
}

const mapStateToProps = state => {
   return {
      persons: state.ggl.persons,
      saving: state.ggl.saving,
      loading: state.ggl.loading, // for refreshing entire data.
      ggleID: state.auth.ggleID,
      membershipGglID: state.auth.membershipGglID,
      locationID: state.auth.locationID,
   };
};

const mapDispatchToProps = dispatch => {
   return {
      saveTestee: (ggleID, testees, locationID) =>
         dispatch(actions.saveTestee(ggleID, testees, locationID)),
      onGgl: (ggleID, membershipGglID, locationID) =>
         dispatch(actions.fetchGglDocs(ggleID, membershipGglID, locationID)),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateBelts);
