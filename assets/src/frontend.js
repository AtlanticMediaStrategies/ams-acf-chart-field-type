import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import { Graph } from './containers/Graph';

const store = configureStore({});
require('es6-shim')
import Frontend from './containers/Frontend';

const apps = document.querySelectorAll('.acf-chart');

Array.from(apps).forEach(app => {
  ReactDOM.render(
    <Provider store={store}>
      <Frontend></Frontend>
    </Provider>,
    app
  )
})
