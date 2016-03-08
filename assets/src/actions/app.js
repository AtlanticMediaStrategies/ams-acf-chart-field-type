import request from 'reqwest-without-xhr2'

export function push_id(id) {
  return {
    type: 'PUSH_ID',
    id
  }
}

export function set_data(data, id, name) {
  return  {
    type: 'SET_DATA',
    data,
    id,
    name
  }
}

export function toggle_edit(fields) {
  return {
    type: 'TOGGLE_EDIT',
    fields
  }
}

export function set_type(chart_type, id, name) {
  return {
    type: 'SET_TYPE',
    chart_type,
    id,
    name
  }
}

export function save_type(chart_type, id, name, {graphs}) {
  const data = graphs[id][name].data;
  return function (dispatch) {
    const json = JSON.stringify({
      data,
      type: chart_type
    })
    request({
      url: `/acf-chart/update/${id}/${name}/`,
      method: 'POST',
      data: {
        json
      }
    }).then(() => dispatch(set_type(chart_type, id, name)))
  }.bind(this)
}

export function init_data(id, name) {
  return function (dispatch) {
    request({
      url: `/acf-chart/${id}/${name}`,
      type: 'json'
    })
    .then(data => {
      const parsed =  JSON.parse(data);
      dispatch(set_data(parsed, id, name))
    })
  }
}
