import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import configureStore from './store/configureStore';
import { Graph } from './containers/Graph';

const store = configureStore({});
require('es6-shim')
import Frontend from './containers/Frontend';

const inputs = document.querySelectorAll('.acf-chart-input');

Array.from(inputs).forEach(input => {
  const id = input.getAttribute('data-id')
  const name = input.getAttribute('data-name')
  const data = JSON.parse(input.value)
  ReactDOM.render(
    <Provider store={store}>
      <Frontend
        id={id}
        name={name}
        data={data}
      ></Frontend>
    </Provider>,
    input.parentNode
  )
})
