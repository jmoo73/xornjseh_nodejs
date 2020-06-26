import * as actionTypes from './actionTypes';
import { days } from '../../shared/refData';
import axInstance from '../../shared/axios-orders';
import { updateObject } from '../../shared/utility';

const now = new Date();
const day = now.getDay(); // day=0 on Sunday.
const today = days[day];

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

export const whenAttenderSubmitClicked = (
   ggleID,
   statsGglID,
   locationID,
   currClass,
   currClassID,
   persons,
   classAttender
) => {
   return async dispatch => {
      dispatch(gglSaveStart());

      const currAttenderIdList = classAttender[currClass].map(el => el[1]);
      // Update 'persons'.
      const members = persons.map(person => {
         let member = person;
         let needGglUpdate = false;
         let newAttClass = person.attClass;
         let inList = currAttenderIdList.includes(person.id);
         let inPerson = person.attClass.includes(currClass);
         if (inList !== inPerson) {
            if (inPerson) {
               newAttClass = person.attClass.filter(el => el !== currClass);
               needGglUpdate = true;
            } else {
               person.attClass.push(currClass);
               needGglUpdate = true;
            }
         }
         member = updateObject(person, {
            attClass: newAttClass,
            needGglUpdate,
         });
         return member;
      });

      // Writing to sheets.
      await axInstance.post('/gglThisYear/update-persons', {
         ggleID,
         members,
      });
      await axInstance.post('/gglStats/submit', {
         statsGglID,
         locationID,
         name: currClassID,
         number: currAttenderIdList.length,
      });

      dispatch({
         type: actionTypes.UPDATE_PERSONS_WITH_CLASS_ATTENDER,
         members,
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

export const fetchPersonalAttendance = (ggleID, lastYearGglID, fullNameList) => {
   return async dispatch => {
      dispatch(gglLoadStart);
      const response = await axInstance.post(
         '/gglThisYear/personal-attendance',
         { ggleID, lastYearGglID, fullNameList }
      );
      const personalAttendance = response.data.personalAttendance;
      // Scaffold is made by makeMonthlyDataList() in refData from backend.
      // personalAttendance = [ [ 'Apr', dateList], [ 'May', ... ], [ 'Jun', ... ] ]
      // dateList = 
      // {
      //    id,
      //    date: makeDateStringNoDay(now),
      //    day: days[now.getDay()],
      //    attendance: [],
      //    needDataFetch: true,
      //    test: false,
      //    start: false,
      // }
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
