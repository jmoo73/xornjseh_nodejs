import * as actionTypes from './actionTypes';
import { today } from '../../shared/refData';
import axInstance from '../../shared/axios-orders';

export const gglLoadStart = () => {
   return { type: actionTypes.GGL_LOAD_START };
};

export const gglLoadFinish = () => {
   return { type: actionTypes.GGL_LOAD_FINISH };
};

export const gglLoadSuccess = doc => {
   return { type: actionTypes.GGL_LOAD_SUCCESS, ...doc };
};

export const gglSaveStart = () => {
   return { type: actionTypes.GGL_SAVE_START };
};

export const gglSaveFinish = () => {
   return { type: actionTypes.GGL_SAVE_FINISH };
};

export const whenClassClicked = cl => {
   return {
      type: actionTypes.SET_CURRENT_CLASS,
      currClass: cl,
   };
};

export const whenBeltClicked = belt => {
   return {
      type: actionTypes.SET_CURRENT_BELT,
      currBelt: belt,
   };
};

export const whenAttenderNameClicked = id => {
   return {
      type: actionTypes.REMOVE_FROM_CLASS_ATTENDER,
      id: id,
   };
};

export const whenMemberNameClicked = id => {
   return {
      type: actionTypes.ADD_TO_CLASS_ATTENDER,
      id: id,
   };
};

export const whenAttenderSubmitClicked = (ggleID, statsGglID, locationID) => {
   return async dispatch => {
      dispatch(gglSaveStart());
      dispatch({
         type: actionTypes.UPDATE_PERSONS_WITH_CLASS_ATTENDER,
         ggleID,
         statsGglID,
         locationID,
      });
      dispatch(gglSaveFinish());
   };
};

export const saveTestee = (ggleID, testees) => {
   return async dispatch => {
      dispatch(gglSaveStart());
      axInstance.post('/gglThisYear/save-testees', { ggleID, testees });
      dispatch(gglSaveFinish());
   };
};

export const gglLogout = () => {
   return {
      type: actionTypes.GGL_LOGOUT,
   };
};

export const resetCurrClass = () => {
   return {
      type: actionTypes.RESET_CURRCLASS,
   };
};

export const fetchPersonalAttendance = (ggleID, lastYearGglID, fullName) => {
   return async dispatch => {
      dispatch(gglLoadStart);
      const response = await axInstance.post(
         '/gglThisYear/personal-attendance',
         { ggleID, lastYearGglID, fullName }
      );
      const personalAttendance = response.data.personalAttendance;
      dispatch(
         gglLoadSuccess({
            personalAttendance,
         })
      );
      dispatch(gglLoadFinish);
   };
};

export const fetchGglDocs = ggleID => {
   return async dispatch => {
      dispatch(gglLoadStart());

      const responseTable = await axInstance.post('/classTable', { ggleID });
      const { classTable, classNameTable } = responseTable.data;
      const classToday = classTable[today];
      // Build persons.
      const responsePersons = await axInstance.post(
         '/gglThisYear/init-persons',
         {
            ggleID,
            classToday,
         }
      );
      const { persons, classAttender } = responsePersons.data;

      dispatch(
         gglLoadSuccess({
            persons,
            classAttender,
            classToday,
            classTable,
            classNameTable,
         })
      );

      dispatch(gglLoadFinish());
   };
};
