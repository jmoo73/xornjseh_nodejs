import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers, compose } from 'redux';
import statsReducer from './reducers/stats';
import gglReducer from './reducers/ggl';
import authReducer from './reducers/auth';
import memReducer from './reducers/mem';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
    stats: statsReducer,
    ggl: gglReducer,
    auth: authReducer,
    mem: memReducer,
});

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;
