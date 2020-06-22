import * as actionTypes from './actionTypes';
import axInstance from '../../shared/axios-orders';

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
         dispatch(authFail(response.data.error));
      } else if (response.data.message) {
         dispatch(authFail({ message: response.data.message }));
      } else {
         const { authSuccess, fetchSuccess } = response.data;

         // gglIDFetchSuccess first, because authen finish will fire the next processes right away.
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
