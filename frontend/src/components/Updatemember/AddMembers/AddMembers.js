import React, { Component } from 'react';
import classes from './AddMembers.module.css';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import MemberData from './MemberData/MemberData';
import Spinner from '../../../components/UI/Spinner/Spinner';

const now = new Date();
const date = now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear();

class AddMembers extends Component {
   state = {
      member: {
         Name: '',
         Beltcolor: '',
         Membership: '',
      },
      saving: false,
   };

   addToList = () => {
      this.props.addToList({
         ...this.state.member,
         StartedOn: date,
         Status: 'ACTIVE',
      });
      this.setState({
         member: {
            ...this.state.member,
            Name: '',
            Beltcolor: '',
            Membership: '',
         },
      });
   };

   saveToSheet = async () => {
      this.setState({ saving: true });
      await this.props.saveAndClearList(
         this.props.ggleID,
         this.props.newMembersList,
         this.props.locationID
      );
      await this.props.onGgl(
         this.props.ggleID,
         this.props.membershipGglID,
         this.props.locationID
      );
      this.setState({
         saving: false,
      });
   };

   updateMemberState = (id, value) => {
      this.setState({ member: { ...this.state.member, [id]: value } });
   };

   render() {
      let memberList = (
         <div className={classes.emptyList}>Add new memebers here...</div>
      );
      if (this.props.newMembersList.length !== 0) {
         memberList = this.props.newMembersList.map((member, index) => {
            return (
               <div key={member.Name + index} className={classes.lineWrapper}>
                  <div
                     className={classes.checkBox}
                     onClick={() => this.props.removeFromList(index)}
                  >
                     remove
                  </div>
                  <div className={classes.Name}>{member.Name}</div>
                  <div className={classes.Beltcolor}>{member.Beltcolor}</div>
                  <div className={classes.Membership}>{member.Membership}</div>
               </div>
            );
         });
      }

      let registerBtn = null;
      if (this.props.newMembersList.length !== 0) {
         registerBtn = (
            <div className={classes.submitBtnWrapper}>
               <button className={classes.submitBtn} onClick={this.saveToSheet}>
                  Register
               </button>
            </div>
         );
      }

      let inputMemberData = (
         <div className={classes.memberDataWrapper}>
            <MemberData
               updateMemberState={(id, value) =>
                  this.updateMemberState(id, value)
               }
               member={this.state.member}
            />
         </div>
      );

      let addBtn = null;
      if (
         this.state.member.Name !== '' &&
         this.state.member.Beltcolor !== '' &&
         this.state.member.Membership !== ''
      ) {
         addBtn = (
            <div className={classes.addBtnWrapper}>
               <button className={classes.addBtn} onClick={this.addToList}>
                  Add to List
               </button>
            </div>
         );
      }

      let spinner = null;
      if (this.state.saving) spinner = <Spinner />;

      return (
         <React.Fragment>
            <div className={classes.wrapper}>
               {memberList}
               {registerBtn}
               <div className={classes.line}></div>
               {inputMemberData}
               {addBtn}
               {spinner}
            </div>
         </React.Fragment>
      );
   }
}

const mapStateToProps = state => {
   return {
      ggleID: state.auth.ggleID,
      newMembersList: state.mem.newMembersList,
      membershipGglID: state.auth.membershipGglID,
      locationID: state.auth.locationID,
   };
};

const mapDispatchToProps = dispatch => {
   return {
      onGgl: (ggleID, membershipGglID, locationID) =>
         dispatch(actions.fetchGglDocs(ggleID, membershipGglID, locationID)),
      addToList: member => dispatch(actions.addToList(member)),
      removeFromList: index => dispatch(actions.removeFromList(index)),
      saveAndClearList: (ggleID, lst, locationID) =>
         dispatch(actions.saveAndClearList(ggleID, lst, locationID)),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMembers);
