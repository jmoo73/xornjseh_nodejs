import React, { Component } from 'react';
import { withRouter, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { connect } from 'react-redux';
import Home from './containers/Home/Home';
import AuthHome from './containers/Home/AuthHome';
import Auth from './containers/Auth/Auth';
import Dailylog from './containers/DailyLog/Dailylog';
import Weeklylog from './containers/Weeklylog/Weeklylog';
import Stats from './containers/Stats/Stats';
import Updatemember from './containers/Updatemember/Updatemember';
import Logout from './containers/Auth/Logout/Logout';
import Layout from './hoc/Layout/Layout';
import MemberHome from './containers/Home/MemberHome';
import MemberAtt from './components/MemberAtt/MemberAtt';
import MemberLogout from './containers/Auth/Logout/MemberLogout';

const now = new Date();
const day = now.getDay(); // day=0 on Sunday.

class App extends Component {
   render() {
      let routes = (
         <Switch>
            <Route path="/auth" component={Auth} />
            <Route path="/" exact component={Home} />
            <Redirect to="/" />
         </Switch>
      );

      if (this.props.isAuthenticated) {
         routes = (
            <Switch>
               <Route exact path="/auth-home" component={AuthHome} />
               <Route exact path="/dailylog" component={() => <Dailylog />} />
               <Route exact path="/weeklylog" component={Weeklylog} />
               <Route exact path="/stats" component={Stats} />
               <Route exact path="/updatemember" component={Updatemember} />
               <Route exact path="/logout" component={Logout} />
               <Redirect to="/auth-home" />
            </Switch>
         );
      }

      if (this.props.isMemberAuthenticated) {
         routes = (
            <Switch>
               <Route exact path="/mem-checkin" component={MemberHome} />
               <Route exact path="/mem-attendance" component={MemberAtt} />
               <Route exact path="/mem-logout" component={MemberLogout} />
               {day === 0 ? <Redirect to="/mem-attendance" /> : <Redirect to="/mem-checkin" />}
            </Switch>
         );
      }

      return (
         <React.Fragment>
            <Layout>{routes}</Layout>
         </React.Fragment>
      );
   }
}

const mapStateToProps = state => {
   return {
      isAuthenticated: state.auth.token !== null,
      isMemberAuthenticated: state.auth.isMemberAuthenticated,
   };
};

export default withRouter(connect(mapStateToProps)(App));
