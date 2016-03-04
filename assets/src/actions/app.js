import request from 'reqwest-without-xhr2'

export function push_id(id) {
  return {
    type: 'PUSH_ID',
    id
  }
}

export function set_data(data, id) {
  return  {
    type: 'SET_DATA',
    data,
    id
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
      dispatch(set_data(JSON.parse(data), id))
    })

  }
}
