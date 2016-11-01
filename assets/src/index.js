import 'famous-polyfills/classList.js';
import qs from 'qs';
require('es6-shim')
require('flexibility')


import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, useRouterHistor, browserHistory} from 'react-router';
import Home from './containers/Home';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from './store/configureStore';
import routes from './routes';
const store = configureStore({});
const history = syncHistoryWithStore(browserHistory, store);

const inputs = Array.from(document.querySelectorAll('.acf-chart-input'))
inputs.shift() // shift off the clone-index one

Object.assign(window.acf.unload, { active: false })

import underscore from 'underscore'
window._ = underscore

function init(input, created) {
  let name = input.getAttribute('data-name')
  const id = input.getAttribute('data-id')
  let data;

  if(name.match(/acfcloneindex/)) {
    if(created != true) {
      return
    }
    let parent = input.parentNode;
    while(!parent.classList.contains('layout') && i++ < 100) {
      parent = parent.parentNode
    }
    const real_id = parent.getAttribute('data-id')
    name = name.replace('acfcloneindex', real_id)
  }

  try {
    data = JSON.parse(input.value)
  } catch (e) {
    data = {}
  }

  ReactDOM.render(
    <Provider store={store}>
      <Home
        id={id}
        name={name}
        created={created}
        data={data}/>
    </Provider>,
    input.parentNode
  )
}

// :rocket:
inputs.forEach(init)

window.acf.add_action('append', (elm) => {
  const input = elm[0].querySelector('.acf-chart-input')
  if(!input) {
    return
  }
  init(input, true)
})
