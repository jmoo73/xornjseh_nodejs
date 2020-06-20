import React, { Component } from 'react';
import { colors } from '../../../shared/refData';
import classes from './AddNewMember.module.css';
import { connect } from 'react-redux';
import * as actions from '../../../store/actions/index';
import axInstance from '../../../shared/axios-orders';

const now = new Date();
const date = now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear();

class AddNewMember extends Component {
   state = {
      newMember: { Name: '', Beltcolor: '' },
      nameError: '',
      beltError: '',
   };

   addToSheet = () => {
      let errorName = '';
      let errorBelt = '';

      if (!this.state.newMember.Name) {
         errorName = 'Name is needed!';
      }

      if (!this.state.newMember.Beltcolor) {
         errorBelt = 'Choose the belt color!';
      }

      if (errorName || errorBelt) {
         this.setState({ nameError: errorName });
         this.setState({ beltError: errorBelt });
      } else {
         this.saveToSheet();
         this.setState({ nameError: '' });
         this.setState({ beltError: '' });
      }
   };

   saveToSheet = async () => {
      this.props.resetButtons('startSaving');

      this.state.newMember[date] =
         '!Start[' + this.state.newMember.Beltcolor + ']';
      this.state.newMember.StartedOn = date;

      await axInstance.post('/gglThisYear/add-new-member', {
         ggleID: this.props.ggleID,
         newMember: this.state.newMember,
      });
      // wait here to be sure that ggl sheet is updated.
      await this.props.onGgl(this.props.ggleID);

      this.setState({ newMember: { Name: '', Beltcolor: '' } });
      this.props.resetButtons('finishSaving');
   };

   onChangeName = e => {
      e.preventDefault();
      this.setState({
         newMember: { ...this.state.newMember, Name: e.target.value },
      });
   };

   onChoiceBelt = e => {
      e.preventDefault();
      this.setState({
         newMember: { ...this.state.newMember, Beltcolor: e.target.value },
      });
   };

   render() {
      return (
         <React.Fragment>
            <div className={classes.addMemberBox}>
               <div className={classes.layerOne}>
                  <input
                     className={classes.inputBox}
                     type="text"
                     onChange={this.onChangeName}
                     value={this.state.newMember.Name}
                     placeholder="Input full name!"
                  />
                  <select
                     className={classes.selBox}
                     onChange={this.onChoiceBelt}
                     value={this.state.newMember.Beltcolor}
                  >
                     <option>Select a belt color</option>
                     {colors.map((color, index) => (
                        <option key={index + 1} value={color}>
                           {color}
                        </option>
                     ))}
                  </select>
               </div>

               <div>
                  {this.state.nameError && (
                     <div style={{ color: 'red', fontSize: '18px' }}>
                        * {this.state.nameError}
                     </div>
                  )}
                  {this.state.beltError && (
                     <div style={{ color: 'red', fontSize: '18px' }}>
                        * {this.state.beltError}
                     </div>
                  )}
               </div>

               <div className={classes.layerTwo}>
                  <button
                     className={classes.submitBtn}
                     onClick={this.addToSheet}
                  >
                     Register
                  </button>
               </div>
            </div>
         </React.Fragment>
      );
   }
}

const mapStateToProps = state => {
   return {
      ggleID: state.auth.ggleID,
   };
};

const mapDispatchToProps = dispatch => {
   return {
      onGgl: (ggleID) => dispatch(actions.fetchGglDocs(ggleID)),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddNewMember);
