import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistor, browserHistory} from 'react-router';
import Home from './containers/Home/index.js';
import { syncHistoryWithStore} from 'react-router-redux';
import configureStore from './store/configureStore';
import routes from './routes';
import 'famous-polyfills/classList.js';
const store = configureStore({});
const history = syncHistoryWithStore(browserHistory, store);
import a11y from 'react-a11y';
import qs from 'qs';
require('scrollsnap-polyfill/dist/scrollsnap-polyfill.bundled.js')
require('es6-shim')
require('flexibility')

// handle underscore conflicts
window._.noConflict()

const apps = document.querySelectorAll('.acf-chart');

Array.from(apps).forEach(app => {
  const name = app.parentNode.querySelector('.acf-chart-name').getAttribute('data-name')
  const input = app.querySelector('input')
  let id, data, created;
  if(!input) {
    const location = qs.parse(window.location.search.replace('?', ''))
    id = location.post
    created = true
    data = {}
  } else {
    id = input.getAttribute('data-id')
    try {
      data = JSON.parse(input.value)
    } catch (e) {
      data = {}
    }
    created = false
  }

  ReactDOM.render(
    <Provider store={store}>
      <Home
        id={id}
        name={name}
        created={created}
        data={data}/>
    </Provider>,
    app
  )
})
