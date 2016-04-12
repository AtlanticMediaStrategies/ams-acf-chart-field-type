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

// if(process.env.NODE_ENV !== 'production') {
//   a11y(React);
// }
require('es6-shim')

// handle underscore conflicts
window._.noConflict()

const apps = document.querySelectorAll('.acf-chart-name');

Array.from(apps).forEach(app => {
  const input = app.parentNode.querySelector('input')
  const name = app.getAttribute('data-name')
  let id, data, created;
  if(!input) {
    const location = qs.parse(window.location.search.replace('?', ''))
    id = location.post
    created = true
    data = {}
  } else {
    id = input.getAttribute('data-id')
    data = JSON.parse(input.value)
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
    app.parentNode
  )
})
