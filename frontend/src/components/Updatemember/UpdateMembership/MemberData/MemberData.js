import React, { Component } from 'react';
import { colors, memberships, membershipsTitle, status } from '../../../../shared/refData';
import classes from './MemberData.module.css';

class MemberData extends Component {
   render() {
      let beltForm = (
         <select
            className={classes.selectBelt}
            onChange={e =>
               this.props.onChangeHandler('Beltcolor', e.target.value)
            }
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

      let nameTitle = [<option key="name">Name</option>];
      let names = this.props.persons
         .filter(person => person.belt === this.props.member.Beltcolor)
         .map(person => (
            <option key={person.id} value={person.id}>
               {person.name}
            </option>
         ));

      let nameForm = (
         <select
            className={classes.selectName}
            onChange={e => this.props.onChangeHandler('id', e.target.value)}
            value={this.props.member.id}
         >
            {nameTitle.concat(names)}
         </select>
      );

      let membershipForm = (
         <select
            className={classes.selectMembership}
            onChange={e =>
               this.props.onChangeHandler('Membership', e.target.value)
            }
            value={this.props.member.Membership}
         >
            <option>Membership</option>
            {memberships.map((mem, index) => (
               <option key={mem} value={mem}>
                  {membershipsTitle[index]}
               </option>
            ))}
         </select>
      );

      let statusForm = (
         <select
            className={classes.selectStatus}
            onChange={e => this.props.onChangeHandler('Status', e.target.value)}
            value={this.props.member.Status}
         >
            <option>Status</option>
            {status.map(st => (
               <option key={st} value={st}>
                  {st}
               </option>
            ))}
         </select>
      );

      return (
         <React.Fragment>
            <div className={classes.inputWrapper}>
               {beltForm}
               {nameForm}
               {membershipForm}
               {statusForm}
            </div>
         </React.Fragment>
      );
   }
}

export default MemberData;
