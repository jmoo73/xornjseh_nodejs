import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import * as actions from '../../../store/actions/index';

class MemberLogout extends Component {
   componentDidMount() {
      this.props.onMemberLogout();
      this.props.onAuthLogout();
   }

   render() {
      return <Redirect to="/" />;
   }
}

const mapDispatchToProps = dispatch => {
   return {
      onMemberLogout: () => dispatch(actions.memLogout()),
      onAuthLogout: () => dispatch(actions.authLogout())
   };
};

export default connect(null, mapDispatchToProps)(MemberLogout);
