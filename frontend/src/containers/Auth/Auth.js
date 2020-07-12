import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';

const now = new Date();
const day = now.getDay(); // day=0 on Sunday.

class Auth extends Component {
   state = {
      controls: {
         email: {
            elementType: 'input',
            elementConfig: {
               type: 'email',
               placeholder: 'Mail Address',
            },
            value: '',
            validation: {
               required: true,
               isEmail: true,
            },
            valid: false,
            touched: false,
         },
         password: {
            elementType: 'input',
            elementConfig: {
               type: 'password',
               placeholder: 'Password',
            },
            value: '',
            validation: {
               required: true,
               minLength: 1,
            },
            valid: false,
            touched: false,
         },
      },
   };

   onChangeHandler = (event, controlName) => {
      const updatedControls = updateObject(this.state.controls, {
         [controlName]: updateObject(this.state.controls[controlName], {
            value: event.target.value,
            valid: checkValidity(
               event.target.value,
               this.state.controls[controlName].validation
            ),
            touched: true,
         }),
      });
      this.setState({ controls: updatedControls });
   };

   submitHandler = event => {
      event.preventDefault();
      this.props.onAuth(
         this.state.controls.email.value,
         this.state.controls.password.value
      );
   };

   render() {
      const formElementsArray = [];
      for (let key in this.state.controls) {
         formElementsArray.push({
            id: key,
            config: this.state.controls[key],
         });
      }

      let form = formElementsArray.map(formElement => (
         <Input
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={event => this.onChangeHandler(event, formElement.id)}
         />
      ));

      let errorMessage = null;

      if (this.props.error) {
         errorMessage = <p>{this.props.error.message}</p>;
      }

      // Coming two if's are not working...
      // <Redirect ..> in App.js takes effect just after logging in.
      // These parts are not refreshed just after loggin in.
      let authRedirect = null;
      if (this.props.isAuthenticated) {
         authRedirect = <Redirect to={this.props.authRedirectPath} />;
      }

      if (this.props.isMemberAuthenticated) {
         if (day !== 0) {
            authRedirect = <Redirect to={this.props.memberAuthRedirectPath} />;
         } else {
            console.log('in auth');
            authRedirect = (
               <Redirect to={this.props.memberAuthRedirectPathSunday} />
            );
         }
      }

      if (this.props.loading) {
         return <Spinner />;
      } else {
         return (
            <div className={classes.Auth}>
               {authRedirect}
               {errorMessage}
               {form}
               <form onSubmit={this.submitHandler}>
                  {this.state.controls.email.valid &&
                  this.state.controls.password.valid ? (
                     <Button btnType="Success">SUBMIT</Button>
                  ) : (
                     <Button disabled>SUBMIT</Button>
                  )}
               </form>
            </div>
         );
      }
   }
}

const mapStateToProps = state => {
   return {
      loading: state.auth.loading,
      error: state.auth.error,
      isAuthenticated: state.auth.token !== null,
      authRedirectPath: state.auth.authRedirectPath,
      isMemberAuthenticated: state.auth.isMemberAuthenticated,
      memberAuthRedirectPath: state.auth.memberAuthRedirectPath,
      memberAuthRedirectPathSunday: state.auth.memberAuthRedirectPathSunday,
   };
};

const mapDispatchToProps = dispatch => {
   return {
      onAuth: (email, password) => dispatch(actions.auth(email, password)),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);
