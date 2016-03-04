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

export function set_type(chart_type, id) {
  return {
    type: 'SET_TYPE',
    chart_type,
    id
  }
}

export function save_type(chart_type, {id, graphs}) {
  const data = graphs[id].data;
  return function (dispatch) {
    const json = JSON.stringify({
      data,
      type: chart_type
    })
    request({
      url: `/acf-chart/update/${id}/`,
      method: 'POST',
      data: {
        json
      }
    }).then(() => dispatch(set_type(chart_type, id)))
  }.bind(this)
}

export function init_data(id) {
  return function (dispatch) {
    request({
      url: `/acf-chart/${id}`,
      type: 'json'
    })
    .then(data => {
      const parsed =  JSON.parse(data);
      dispatch(set_data(parsed, id))
    })
  }
}
