import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';
import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';
import * as actions from '../../store/actions/index';

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
               minLength: 6,
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

      let authRedirect = null;
      if (this.props.isAuthenticated) {
         authRedirect = <Redirect to={this.props.authRedirectPath} />;
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
                  <Button btnType="Success">SUBMIT</Button>
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
   };
};

const mapDispatchToProps = dispatch => {
   return {
      onAuth: (email, password) => dispatch(actions.auth(email, password)),
   };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);