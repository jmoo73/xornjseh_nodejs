import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
   belt: null,
   currClass: null, // 'Tiger Tots'
   memberAttendance: null, // memberAttendance = [[fullName, allList, belt, startedOn, testedOn]]
   checkedIn: null, // [ 'Tiger Tots', ... ]
   className: null, // [ 'Tiget Tots', ... ]
   classTime: null, // [ 'xxxx-yyyy', ... ]
   classTitle: null, // [ 'Class1', ... ]
   loading: false,
   saving: false,
};

const loadStart = (state, action) => {
   return updateObject(state, { loading: true });
};

const loadSuccess = (state, action) => {
   delete action.type;
   return updateObject(state, { ...action });
};

const checkInSuccess = (state, action) => {
   let checkedIn = [...state.checkedIn];
   checkedIn.push(action.currClass);
   return updateObject(state, {
      checkedIn,
   });
};

const loadFinish = (state, action) => {
   return updateObject(state, { loading: false });
};

const saveStart = (state, action) => {
   return updateObject(state, { saving: true });
};

const saveFinish = (state, action) => {
   return updateObject(state, { saving: false });
};

const memLogout = (state, action) => {
   return updateObject(state, initialState);
};

const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actionTypes.MEM_LOAD_START:
         return loadStart(state, action);
      case actionTypes.MEM_LOAD_SUCCESS:
         return loadSuccess(state, action);
      case actionTypes.MEM_LOAD_FINISH:
         return loadFinish(state, action);
      case actionTypes.MEM_SAVE_START:
         return saveStart(state, action);
      case actionTypes.MEM_SAVE_FINISH:
         return saveFinish(state, action);
      case actionTypes.MEM_LOGOUT:
         return memLogout(state, action);
      case actionTypes.CHECKIN_SUCCESS:
         return checkInSuccess(state, action);
      default:
         return state;
   }
};

export default reducer;
