import * as actionTypes from './actionTypes';
import axInstance from '../../shared/axios-orders';

export const loadStart = () => {
   return { type: actionTypes.MEM_LOAD_START };
};

export const loadSuccess = doc => {
   return { type: actionTypes.MEM_LOAD_SUCCESS, ...doc };
};

export const checkInSuccess = currClass => {
   return { type: actionTypes.CHECKIN_SUCCESS, currClass };
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

export const initMember = (ggleID, fullName, locationID) => {
   return async dispatch => {
      dispatch(loadStart());

      const response = await axInstance.post('/member/init-member', {
         fullName,
         ggleID,
         locationID,
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
      dispatch(checkInSuccess(currClass));
      dispatch(saveFinish());
   };
};

export const fetchAttData = (fullName, ggleID, lastYearGglID, locationID) => {
   return async dispatch => {
      dispatch(loadStart());

      const memAttData = await axInstance.post('/member/fetch-attdata', {
         fullName,
         ggleID,
         lastYearGglID,
         locationID,
      });

      dispatch(loadSuccess(memAttData.data));
      dispatch(loadFinish());
   };
};

//=============================
//  Updating memberships
//============================= 

export const addToList = member => {
   return { type: actionTypes.ADD_TO_LIST, member };
};

export const removeFromList = index => {
   return { type: actionTypes.REMOVE_FROM_LIST, index };
};

export const saveAndClearList = (ggleID, newMembersList, locationID) => {
   return async dispatch => {
      dispatch(saveStart());
      await axInstance.post('/gglThisYear/add-new-member', {
         ggleID,
         newMembersList,
         locationID,
      });
      dispatch({ type: actionTypes.CLEAR_LIST });
      dispatch(saveFinish());
   };
};

export const updateMembership = (ggleID, memberList, locationID) => {
   return async dispatch => {
      dispatch(saveStart());
      await axInstance.post('/gglThisYear/update-membership', {
         ggleID,
         memberList,
         locationID,
      });
      dispatch(saveFinish());
   };
};

export const addToUpdatesList = member => {
   return { type: actionTypes.ADD_TO_UPDATES_LIST, member };
};


export const removeFromUpdatesList = index => {
   return { type: actionTypes.REMOVE_FROM_UPDATES_LIST, index}
};

export const emptyUpdatesList = () => {
   return { type: actionTypes.EMPTY_UPDATES_LIST }
}



