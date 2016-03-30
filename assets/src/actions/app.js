import request from 'reqwest-without-xhr2'
import { colors } from '../components/Graphs/config.js';

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
      const parsed =  JSON.parse(data)

      // setup default colors
      if(!parsed.colors) {
        Object.assign(parsed, { colors })
      }

      if(parsed.type === 'pie' && !parsed.currentColumn) {
        Object.assign(parsed, {
          columnsConstrained: true,
          currentColumn: 1
        })
        console.log(parsed)
      }

      dispatch(set_data(parsed, id, name))
    })
  }
}

function update_graph(graph, id, name) {
  return {
    type: 'UPDATE_GRAPH',
    graph,
    id,
    name
  }
}

function reset_active() {
  return {
    type: 'RESET_ACTIVE'
  }
}

export function save_graph(graph, id, name) {
  const json = JSON.stringify(graph)
  return function(dispatch) {
    request({
      url: `/acf-chart/update/${id}/${name}`,
      method: 'POST',
      data: {
        json
      }
    })
    .then(data => {
      dispatch(update_graph(graph, id, name))
      dispatch(reset_active())
    })
  }
}

/**
 *  Sets color for specific element
 *
 *  @param color {string} color to set
 *  @param graph {object} graph to change
 *  @param row {integer} nth-element in graph to change color
 *  @param name {string} the key name for the graph
 *  @param id {integer} post_id
 */
export function set_color(color, graph, row, name, id) {
  return function (dispatch) {
    graph.colors.splice(row, 1, color);
    dispatch(update_graph(graph, id,  name))
  }
}

/**
 *  @param index {integer} row to edit
 *  @param name {string} key for graph to edit
 */
export function toggle_color(index, name) {
  return {
    type: 'TOGGLE_COLOR',
    index,
    name
  }
}

/**
 *  @param index {integer} row to edit
 *  @param name {string} key for graph to edit
 */
export function cancel_color(index, name) {
  return {
    type: 'CANCEL_COLOR',
    index,
    name
  }
}

/**
 *  @param column {integer} nth column to edit
 *  @param name {string} key for graph to edit
 */
export function set_current_column(column, name) {
  return {
    type: 'SET_CURRENT_COLUMN',
    column,
    name
  }
}
