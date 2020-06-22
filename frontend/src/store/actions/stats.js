import * as actionTypes from './actionTypes';
import axInstance from '../../shared/axios-orders';

export const statSaveStart = () => {
   return { type: actionTypes.STAT_SAVE_START };
};

export const statSaveFinish = () => {
   return { type: actionTypes.STAT_SAVE_FINISH };
};

export const statLoadStart = () => {
   return { type: actionTypes.STAT_LOAD_START };
};

export const statLoadFinish = () => {
   return { type: actionTypes.STAT_LOAD_FINISH };
};

export const statLogout = () => {
   return { type: actionTypes.STAT_LOGOUT };
};

export const whenActivityClicked = activity => {
   return {
      type: actionTypes.SET_CURRENT_ACTIVITY,
      currActivity: activity,
   };
};

export const initActivity = () => {
   return {
      type: actionTypes.INIT_ACTIVITY,
   };
};

export const updateActivity = (currActivity, number) => {
   return {
      type: actionTypes.UPDATE_ACTIVITY,
      currActivity,
      number,
   };
};

export const whenActivitySubmitClicked = (
   statsGglID,
   locationID,
   currActivity,
   number
) => {
   return async dispatch => {
      dispatch(statSaveStart());

      const submitData = {
         statsGglID,
         locationID,
         name: currActivity,
         number,
      };
      await axInstance.post('/gglStats/submit', submitData);

      dispatch(updateActivity(currActivity, number));

      dispatch(statSaveFinish());
   };
};

export const buildStats = (dailyStat, keyList) => {
   return {
      type: actionTypes.STAT_LOAD_SUCCESS,
      dailyStat,
      keyList,
   };
};

export const fetchStat = (statsGglID, locationID) => {
   return async dispatch => {
      dispatch(statLoadStart());
      // Build stats.
      const response = await axInstance.post('/gglStats/init', {
         statsGglID,
         locationID,
      });
      const { dailyStat, keyList } = response.data;

      dispatch(buildStats(dailyStat, keyList));
      dispatch(statLoadFinish());
   };
};
