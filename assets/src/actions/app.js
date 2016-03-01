import request from 'reqwest-without-xhr2'

export function set_data(fields) {
  return  {
    type: 'SET_DATA',
    fields
  }
}

export function toggle_edit(fields) {
  return {
    type: 'TOGGLE_EDIT',
    fields
  }
}

export function init_data(id) {
  return function (dispatch) {
    request({
      url: `/acf-chart/${id}`,
      type: 'json'
    })
    .then(data => {
      dispatch(set_data(JSON.parse(data)))
    })

  }
}
