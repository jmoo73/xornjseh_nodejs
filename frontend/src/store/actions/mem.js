import * as actionTypes from './actionTypes';
import axInstance from '../../shared/axios-orders';

export const loadStart = () => {
   return { type: actionTypes.MEM_LOAD_START };
};

export const loadSuccess = doc => {
   return { type: actionTypes.MEM_LOAD_SUCCESS, ...doc };
};

export const loadFinish = () => {
   return { type: actionTypes.MEM_LOAD_FINISH };
};

export const saveStart = () => {
   return { type: actionTypes.MEM_SAVE_START };
};

export const saveFinish = () => {
   return { type: actionTypes.MEM_SAVE_FINISH };
};

export const memLogout = () => {
   return { type: actionTypes.MEM_LOGOUT };
};

export const initMember = (ggleID, fullName) => {
   return async dispatch => {
      dispatch(loadStart());

      const response = await axInstance.post('/member/init-member', {
         fullName,
         ggleID,
      });

      dispatch(loadSuccess({ ...response.data }));
      dispatch(loadFinish());
   };
};

export const checkIn = (
   fullName,
   ggleID,
   statsGglID,
   currClass,
   currClassTitle,
   locationID
) => {
   return async dispatch => {
      dispatch(saveStart());
      await axInstance.post('/member/check-in', {
         fullName,
         ggleID,
         statsGglID,
         currClass,
         currClassTitle,
         locationID,
      });
      dispatch(saveFinish());
   };
};

export const fetchAttData = (fullName, ggleID, lastYearGglID) => {
   return async dispatch => {
      dispatch(loadStart());

      const memAttData = await axInstance.post('/member/fetch-attdata', {
         fullName,
         ggleID,
         lastYearGglID,
      });

      dispatch(loadSuccess(memAttData.data));
      dispatch(loadFinish());
   };
};
