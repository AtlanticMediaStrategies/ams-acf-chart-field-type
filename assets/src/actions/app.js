import request from 'reqwest-without-xhr2'
import notie from 'notie'
import { colors } from '../components/Graphs/config.js'
import { initialGraph } from '../models/graph.js'

export function set_data(data, id, name) {
  return  {
    type: 'SET_DATA',
    data,
    id,
    name
  }
}

export function create_graph(data, id, name) {
  return  {
    type: 'CREATE_GRAPH',
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

/**
 *  @param val {any} value to set
 *  @param key {string} option on graph to set
 *  @param id  {integer} id of the post
 *  @param name {string}  key for the graph
 */
export function set_graph_value(key, val, id, name) {
  return {
    type: 'SET_GRAPH_VALUE',
    key,
    val,
    id,
    name
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

export function init_data(id, name) {
  return function (dispatch) {
    request({
      url: `/acf-chart/${id}/${name}`,
      type: 'json'
    })
    .then(data => {
      const parsed = JSON.parse(data) || {}

      if(!parsed.colors) {
        Object.assign(parsed, { colors })
      }

      if(!parsed.active_rows && parsed.data) {
        const { length } = parsed.data
        Object.assign(parsed, {
          active_rows: Array(length).fill(true)
        })
      }

      if(!parsed.columns_constrained) {
        Object.assign(parsed, {
          columns_constrained: false
        })
      }

      if(!parsed.x_axis) {
        Object.assign(parsed, {x_axis: ''})
      }

      if(!parsed.y_axis) {
        Object.assign(parsed, {y_axis: ''})
      }

      if(parsed.type != 'line' && !parsed.currentColumn) {
        Object.assign(parsed, { currentColumn: 1 })
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
      notie.alert(1, 'Graph Saved')
      dispatch(update_graph(graph, id, name))
      dispatch(reset_active())
    })
    .catch(err  => {
      notie.alert(2, 'An error occurred')
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

/**
 *  Calls reducer with value = false
 */
export function hide_row(index, name) {
  return {
    type: 'SET_ROW_VISIBILITY',
    index,
    name,
    value: false
  }
}


/**
 *  Calls reducer with value = false
 */
export function show_row(index, name) {
  return {
    type: 'SET_ROW_VISIBILITY',
    index,
    name,
    value: true
  }
}

/**
 *   Updates label
 *   @param label {string} the text of the label
 *   @param axis {string} the axis (x or y)
 *   @param name {string}  the key for the graph
 */
export function update_label(label, axis, name) {
  return {
    type: 'UPDATE_LABEL',
    label,
    axis,
    name
  }
}
