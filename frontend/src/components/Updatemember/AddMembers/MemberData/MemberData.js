import React, { Component } from 'react';
import classes from './MemberData.module.css';
import { colors, memberships } from '../../../../shared/refData';
// import { checkValidity } from '../../../../shared/utility';

class MemberData extends Component {
   state = {
      member: {
         Name: '',
         Beltcolor: '',
         Membership: '',
      },
   };

   onChangeHandler = (e, id) => {
      e.preventDefault();
      if (true) {
         this.props.updateMemberState(id, e.target.value);
      }
   };

   render() {
      let nameForm = (
         <input
            className={classes.inputName}
            type="text"
            placeholder="e.g. Jeongmoo Park (Space-separated)"
            value={this.props.member.Name}
            onChange={event => this.onChangeHandler(event, 'Name')}
         />
      );

      let beltForm = (
         <select
            className={classes.selectBelt}
            onChange={e => this.onChangeHandler(e, 'Beltcolor')}
            value={this.props.member.Beltcolor}
         >
            <option>Belt</option>
            {colors.map(color => (
               <option key={color} value={color}>
                  {color}
               </option>
            ))}
         </select>
      );

      let membershipForm = (
         <select
            className={classes.selectMembership}
            onChange={e => this.onChangeHandler(e, 'Membership')}
            value={this.props.member.Membership}
         >
            <option>Membership</option>
            {memberships.map(mem => (
               <option key={mem} value={mem}>
                  {mem}
               </option>
            ))}
         </select>
      );

      return (
         <React.Fragment>
            <div className={classes.inputWrapper}>
               {nameForm}
               {beltForm}
               {membershipForm}
            </div>
         </React.Fragment>
      );
   }
}

export default MemberData;
