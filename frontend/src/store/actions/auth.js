import * as actionTypes from './actionTypes';
import axInstance from '../../shared/axios-orders';
import _ from 'lodash';

export const authStart = () => {
   return {
      type: actionTypes.AUTH_START,
   };
};

export const authenSuccess = (idToken, userId, email) => {
   return {
      type: actionTypes.AUTH_SUCCESS,
      idToken,
      userId,
      email,
   };
};

export const authFail = error => {
   return {
      type: actionTypes.AUTH_FAIL,
      error: error,
   };
};

export const logout = () => {
   return {
      type: actionTypes.AUTH_LOGOUT,
   };
};

export const memAuthSuccess = (memberAttendance, location) => {
   return {
      type: actionTypes.MEM_AUTH_SUCCESS,
      memberAttendance,
      location,
   }
}

export const memberAuthLogout = () => {
   return {
      type: actionTypes.MEMBER_AUTH_LOGOUT,
   };
};

export const gglIdFetchSuccess = (
   ggleID,
   statsGglID,
   location,
   locationID,
   lastYearGglID
) => {
   return {
      type: actionTypes.GGL_ID_FETCH_SUCCESS,
      ggleID,
      statsGglID,
      location,
      locationID,
      lastYearGglID,
   };
};

export const auth = (email, password) => {
   return async dispatch => {
      dispatch(authStart());
      const authData = {
         email,
         password,
         returnSecureToken: true,
      };

      const response = await axInstance.post('/auth/login', { authData });

      if (response.data.error) {
         const memberAuthData = {
            fullName:
               _.capitalize(email.split('@')[0]) + ' ' + _.capitalize(password),
            location: email.split('@')[1].replace('.', '-'),
         };
         const memberAuthRes = await axInstance.post('/memberAuth', memberAuthData );

         if (memberAuthRes.data.message) {
            dispatch(authFail({ message: memberAuthRes.data.message }));
         } else {
            const { memberAttendance, location } = memberAuthRes.data;
            // memberAttendance = [fullName, allList, belt, startedOn, testedOn]
            console.log(memberAttendance)
            dispatch(memAuthSuccess(memberAttendance, location))
         }
      } else if (response.data.message) {
         dispatch(authFail({ message: response.data.message }));
      } else {
         const { authSuccess, fetchSuccess } = response.data;

         dispatch(
            gglIdFetchSuccess(
               fetchSuccess.ggleID,
               fetchSuccess.statsGglID,
               fetchSuccess.location,
               fetchSuccess.locationID,
               fetchSuccess.lastYearGglID
            )
         );

         dispatch(
            authenSuccess(
               authSuccess.idToken,
               authSuccess.userId,
               authSuccess.email
            )
         );
      }
   };
};
