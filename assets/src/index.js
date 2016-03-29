import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistor, browserHistory} from 'react-router';
import { syncHistoryWithStore} from 'react-router-redux';
import configureStore from './store/configureStore';
import routes from './routes';
import 'famous-polyfills/classList.js';
const store = configureStore({});
const history = syncHistoryWithStore(browserHistory, store);
import a11y from 'react-a11y';

// if(process.env.NODE_ENV !== 'production') {
//   a11y(React);
// }
require('es6-shim')

window._.noConflict()

const apps = document.querySelectorAll('.acf-chart');

Array.from(apps).forEach(app => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history} routes={routes} />
    </Provider>,
    app
  )
})
