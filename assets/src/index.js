import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistor, hashHistory } from 'react-router';
import configureStore from './store/configureStore';
import routes from './routes';
const history = hashHistory;

const store = configureStore({}, history);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>,
  document.getElementById('app')
);
