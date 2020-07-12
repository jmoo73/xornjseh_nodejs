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

export const authLogout = () => {
   return {
      type: actionTypes.AUTH_LOGOUT,
   };
};

export const memAuthSuccess = memAuthData => {
   return {
      type: actionTypes.MEM_AUTH_SUCCESS,
      ...memAuthData, // { location, fullName, ggleID, lastYearGglID, statsGglID, locationID }
   };
};

export const gglIdFetchSuccess = fetchSuccess => {
   return {
      type: actionTypes.GGL_ID_FETCH_SUCCESS,
      ...fetchSuccess,
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

         const memberAuthRes = await axInstance.post(
            '/member/auth',
            memberAuthData
         );

         if (memberAuthRes.data.message) {
            dispatch(authFail({ message: memberAuthRes.data.message }));
         } else {
            //{ location, fullName, ggleID, lastYearGglID, statsGglID, locationID }
            dispatch(memAuthSuccess(memberAuthRes.data));
         }
         
      } else if (response.data.message) {
         dispatch(authFail({ message: response.data.message }));
      } else {
         const { authSuccess, fetchSuccess } = response.data;

         dispatch(gglIdFetchSuccess(fetchSuccess));

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
