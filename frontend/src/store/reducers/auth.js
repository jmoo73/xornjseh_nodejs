import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';
import _ from 'lodash';

const initialState = {
   token: null,
   userId: null,
   error: null,
   loading: false,
   authRedirectPath: '/auth-home',
   email: null,

   locationID: null,
   ggleID: null,
   statsGglID: null,
   lastYearGglID: null,
   location: null,
   fullName: null,
   memberAuthRedirectPath: '/mem-checkin',
   memberAuthRedirectPathSunday: '/mem-attendance',
   isMemberAuthenticated: false,
};

const authStart = (state, action) => {
   return updateObject(state, { error: null, loading: true });
};

const authSuccess = (state, action) => {
   return updateObject(state, {
      token: action.idToken,
      userId: action.userId,
      error: null,
      email: action.email,
   });
};

const authFail = (state, action) => {
   return updateObject(state, {
      error: action.error,
      loading: false,
   });
};

const memAuthSuccess = (state, action) => {
   return updateObject(state, {
      isMemberAuthenticated: true,
      ..._.omit(action, 'type'), // { location, fullName, ggleID, lastYearGglID, statsGglID }
   });
};

const gglIdFetchSuccess = (state, action) => {
   return updateObject(state, {
      ggleID: action.ggleID,
      statsGglID: action.statsGglID,
      location: action.location,
      locationID: action.locationID,
      lastYearGglID: action.lastYearGglID,
      error: null,
      loading: false,
   });
};

const logOut = (state, action) => {
   return updateObject(state, initialState);
};

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actionTypes.AUTH_START:
         return authStart(state, action);
      case actionTypes.AUTH_SUCCESS:
         return authSuccess(state, action);
      case actionTypes.AUTH_FAIL:
         return authFail(state, action);
      case actionTypes.AUTH_LOGOUT:
         return logOut(state, action);
      case actionTypes.GGL_ID_FETCH_SUCCESS:
         return gglIdFetchSuccess(state, action);
      case actionTypes.MEM_AUTH_SUCCESS:
         return memAuthSuccess(state, action);
      default:
         return state;
   }
};

export default reducer;
