import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { app } from './app';

const rootReducer = combineReducers({
  form,
  routing,
  app
});

export default rootReducer;
