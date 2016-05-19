require('es6-shim')
require('flexibility')

const inputs = document.querySelectorAll('.acf-chart-input');

Array.from(inputs).forEach(input => {
  require([
    'react',
    'react-dom',
    './containers/Frontend'
  ], (React, ReactDOM, lib) => {
    const Frontend = lib.default
    const id = input.getAttribute('data-id')
    const name = input.getAttribute('data-name')
    const data = JSON.parse(input.value)
    ReactDOM.render(
      <Frontend
        id={id}
        name={name}
        data={data}
      ></Frontend>,
      input.parentNode
    )
  })
})
