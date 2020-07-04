import React, { Component } from 'react';
import classes from './Updatemember.module.css';
import AddMembers from '../../components/Updatemember/AddMembers/AddMembers';
import UpdateMembership from '../../components/Updatemember/UpdateMembership/UpdateMembership';
import UpdateBelts from '../../components/Updatemember/UpdateBelts/UpdateBelts';
import BackDrop from '../../components/UI/BackDrop/BackDrop';
import Spinner from '../../components/UI/Spinner/Spinner';

let menu = ['onAddingMembers', 'onUpdatingMembership', 'onUpdatingBelts'];
let menuName = ['Add members', 'Update membership', 'Update belts'];

class Updatemember extends Component {
   state = {
      clickedBtn: null,
      savingInChild: false,
   };

   savingInChild = () => {
      this.setState({ savingInChild: true });
   };

   chooseBtn = btn => {
      this.setState({ clickedBtn: btn });
   };

   resetBtn = () => {
      this.setState({ clickedBtn: null, savingInChild: false });
   };

   render() {
      let choice = null;
      if (this.state.clickedBtn === menu[0])
         choice = (
            <AddMembers
               resetBtn={this.resetBtn}
               savingInChild={this.savingInChild}
            />
         );
      if (this.state.clickedBtn === menu[1])
         choice = (
            <UpdateMembership
               resetBtn={this.resetBtn}
               saving={this.state.savingInChild}
            />
         );
      if (this.state.clickedBtn === menu[2])
         choice = (
            <UpdateBelts
               resetBtn={this.resetBtn}
               saving={this.state.savingInChild}
            />
         );

      let spinner = null;
      if (this.state.savingInChild) spinner = <Spinner />;

      return (
         <React.Fragment>
            <div className={classes.wrapper}>
               <div className={classes.buttonBox}>
                  {menu.map((el, index) => {
                     let btnClassStr = [classes.baseBtn];
                     if (el === this.state.clickedBtn)
                        btnClassStr.push(classes.clicked);
                     return (
                        <button
                           key={el}
                           className={btnClassStr.join(' ')}
                           onClick={() => this.chooseBtn(el)}
                        >
                           {menuName[index]}
                        </button>
                     );
                  })}
               </div>

               <BackDrop
                  show={this.state.clickedBtn && !this.state.savingInChild}
                  clicked={this.resetBtn}
               />

               {choice}
               {spinner}
            </div>
         </React.Fragment>
      );
   }
}

export default Updatemember;
