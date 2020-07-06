import React, { Component } from 'react';
import { connect } from 'react-redux';
import MemberData from './MemberData/MemberData';
import classes from './UpdateMembership.module.css';
import Spinner from '../../UI/Spinner/Spinner';
import * as actions from '../../../store/actions/index';

class UpdateMembership extends Component {
   state = {
      member: {
         id: '',
         Beltcolor: 'White',
         Name: '',
         Membership: '',
         Status: '',
      },
      touched: false,
      saving: false,
      memberList: [],
   };

   removeFromList = index => {
      let memberList = [...this.state.memberList];
      memberList.splice(index, 1);
      this.setState({ memberList });
   };

   addToList = () => {
      // Remove any member with same id who was added to the List.
      let memberList = [...this.state.memberList];
      for (let index = 0; index < memberList.length; index++) {
         if (memberList[index].id === this.state.member.id) {
            memberList.splice(index, 1);
            break;
         }
      }
      this.setState({
         memberList: [...memberList, { ...this.state.member }],
         touched: false,
         member: {
            ...this.state.member,
            id: '',
            Name: '',
            Membership: '',
            Status: '',
         },
      });
   };

   saveChanges = async () => {
      this.setState({ saving: true });
      // Writing to sheets.
      await this.props.updateMembership(
         this.props.ggleID,
         this.state.memberList
      );
      await this.props.onGgl(this.props.ggleID);

      this.setState({
         touched: false,
         saving: false,
         memberList: [],
         member: {
            ...this.state.member,
            id: '',
            Name: '',
            Membership: '',
            Status: '',
         },
      });
   };

   updateMemberState = (id, value) => {
      if (id === 'Beltcolor') {
         this.setState({
            member: {
               ...this.state.member,
               Beltcolor: value,
               id: '',
               Name: '',
               Status: '',
               Membership: '',
            },
            touched: false,
         });
      } else if (id === 'id') {
         this.setState({
            member: {
               ...this.state.member,
               id: value,
               Membership: this.props.persons[value].membership,
               Status: this.props.persons[value].status,
               Name: this.props.persons[value].name,
            },
            touched: false,
         });
      } else if (this.state.member[id] !== value) {
         this.setState({
            member: { ...this.state.member, [id]: value },
            touched: true,
         });
      }
   };

   render() {
      let memberList = (
         <div className={classes.emptyList}>
            Update membership and status here...
         </div>
      );
      if (this.state.memberList.length !== 0) {
         memberList = this.state.memberList.map((member, index) => {
            return (
               <div key={member.Name + index} className={classes.lineWrapper}>
                  <div
                     className={classes.checkBox}
                     onClick={() => this.removeFromList(index)}
                  >
                     remove
                  </div>
                  <div className={classes.Beltcolor}>{member.Beltcolor}</div>
                  <div className={classes.Name}>{member.Name}</div>
                  <div className={classes.Membership}>{member.Membership}</div>
                  <div className={classes.Status}>{member.Status}</div>
               </div>
            );
         });
      }

      let registerBtn = null;
      if (this.state.memberList.length !== 0) {
         registerBtn = (
            <div className={classes.submitBtnWrapper}>
               <button className={classes.submitBtn} onClick={this.saveChanges}>
                  Save changes
               </button>
            </div>
         );
      }

      let inputMemberData = (
         <div className={classes.memberDataWrapper}>
            <MemberData
               onChangeHandler={(id, value) =>
                  this.updateMemberState(id, value)
               }
               member={this.state.member}
               persons={this.props.persons}
            />
         </div>
      );

      let addBtn = null;
      if (this.state.member.id && this.state.touched) {
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
      persons: state.ggl.persons,
   };
};

const mapDispatchToProps = dispatch => {
   return {
      onGgl: ggleID => dispatch(actions.fetchGglDocs(ggleID)),
      updateMembership: (ggleID, memberList) =>
         dispatch(actions.updateMembership(ggleID, memberList)),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(UpdateMembership);
