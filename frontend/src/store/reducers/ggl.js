import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../shared/utility';

const initialState = {
   classTable: {}, // { Monday: [[ 'Class1', 'White and Yellow'], ... ], ... }
   classNameTable: {}, // { Monday: [ 'Tiger Tot', 'White and Yellow', ... }
   classToday: [], // [ [ 'Class1', 'Tiger Tot'], ... ]
   classAttender: {}, // { y: [ ["Black", 109],... ], ... }
   currClass: null, // 'Tiger Tot'
   currClassID: null, // 'Class1'
   currBelt: 'White',
   persons: [], // [ { ... }, ... ]
   loading: false,
   saving: false,
   dataLoaded: false,
   error: null,
   attenderTouched: false,
   personalAttendance: [],
};

const gglLoadStart = (state, action) => {
   return updateObject(state, { loading: true });
};

const gglLoadFinish = (state, action) => {
   return updateObject(state, { loading: false, dataLoaded: true });
};

const gglSaveStart = (state, action) => {
   return updateObject(state, { saving: true });
};

const gglSaveFinish = (state, action) => {
   return updateObject(state, { saving: false });
};

const gglLoadSuccess = (state, action) => {
   delete action.type;
   return updateObject(state, { ...action });
};

const gglLogout = (state, action) => {
   return updateObject(state, initialState);
};

const resetCurrClass = (state, action) => {
   return updateObject(state, { currClass: null, currClassID: null });
};

const whenClassClicked = (state, action) => {
   let currClassID = null;
   state.classToday.forEach(cls => {
      if (cls[1] === action.currClass) {
         currClassID = cls[0];
      }
   });
   return updateObject(state, {
      currClass: action.currClass,
      currClassID,
   });
};

const whenBeltClicked = (state, action) => {
   return updateObject(state, { currBelt: action.currBelt });
};

const whenMemberNameClicked = (state, action) => {
   let attenderList = state.classAttender[state.currClass];
   attenderList.push([state.persons[action.id].belt, action.id]);
   return updateObject(state, {
      classAttender: updateObject(state.classAttender, {
         [state.currClass]: attenderList,
      }),
      attenderTouched: true,
   });
};

const whenAttenderNameClicked = (state, action) => {
   let attenderList = state.classAttender[state.currClass];
   for (let i in attenderList) {
      if (attenderList[i][1] === action.id) {
         attenderList.splice(i, 1);
         break;
      }
   }
   return updateObject(state, {
      classAttender: updateObject(state.classAttender, {
         [state.currClass]: attenderList,
      }),
      attenderTouched: true,
   });
};

const whenAttenderSubmitClicked = (state, action) => {

   return updateObject(state, {
      persons: action.members,
      currClass: null,
      currClassID: null,
      attenderTouched: false,
      personalAttendance: [], // When triggered from personal check-in.
   });
};


const reducer = (state = initialState, action) => {
   switch (action.type) {
      case actionTypes.GGL_LOAD_START:
         return gglLoadStart(state, action);
      case actionTypes.GGL_LOAD_SUCCESS:
         return gglLoadSuccess(state, action);
      case actionTypes.GGL_LOAD_FINISH:
         return gglLoadFinish(state, action);
      case actionTypes.GGL_SAVE_START:
         return gglSaveStart(state, action);
      case actionTypes.GGL_SAVE_FINISH:
         return gglSaveFinish(state, action);
      case actionTypes.SET_CURRENT_CLASS:
         return whenClassClicked(state, action);
      case actionTypes.SET_CURRENT_BELT:
         return whenBeltClicked(state, action);
      case actionTypes.UPDATE_PERSONS_WITH_CLASS_ATTENDER:
         return whenAttenderSubmitClicked(state, action);
      case actionTypes.REMOVE_FROM_CLASS_ATTENDER:
         return whenAttenderNameClicked(state, action);
      case actionTypes.ADD_TO_CLASS_ATTENDER:
         return whenMemberNameClicked(state, action);
      case actionTypes.GGL_LOGOUT:
         return gglLogout(state, action);
      case actionTypes.RESET_CURRCLASS:
         return resetCurrClass(state, action);
      default:
         return state;
   }
};

export default reducer;
