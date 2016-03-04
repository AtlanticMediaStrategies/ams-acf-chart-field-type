import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { app } from './app';

const rootReducer = combineReducers({
  form: formReducer,
  routing: routerReducer,
  app
});

export default rootReducer;
