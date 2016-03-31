import { colors } from '../components/Graphs/config.js';
import qs from 'qs';
const initialState  = {
  edit: false,
  stashedColor: '',
  activeName: '',
  activeRow: -1,
  graphs: {}
}

import { initialGraph } from '../models/graph.js'

const post_id = qs.parse(window.location.search.replace('?', '')).post

export function app(state = initialState, action) {
  let graph;
  let graphs;

  switch (action.type) {
    /**
     * Sets graph data (on create or update)
     *
     *  @param action.id {integer}  id for the post
     *  @param action.name {string} name for the field
     *  @param action.data{string} stringified jso
     */
    case 'SET_DATA':
      graphs = state.graphs[action.id] || {}
      graph = graphs[action.name] || {}

      Object.assign(graph, action.data)

      Object.assign(graphs, {
        [action.name]: graph
      })

      return {
        ...state,
        graphs:  {
          ...state.graphs,
          [action.id]: graphs
        }
      };

    case 'CREATE_GRAPH':
      graphs = state.graphs[action.id] || {}

      const graph_clone = Object.assign({}, initialGraph)
      graph = Object.assign({}, action.data, graph_clone)

      Object.assign(graph, {
        active: Array(action.data.data.length).fill(true),
        colors
      })

      Object.assign(graphs, {
        [action.name]: graph
      })

      return {
        ...state,
        graphs:  {
          ...state.graphs,
          [action.id]: graphs
        }
      };

    /**
     *  Sets type for the graph
     *  @param action.id {integer}  id for the post
     *  @param action.name {string} name for the field
     */
    case 'SET_TYPE':
      graphs = state.graphs[action.id]
      graph = graphs[action.name]

      Object.assign(graph, {
        type: action.chart_type
      })

      Object.assign(graphs, {
        [action.name]: graph
      })

      return {
        ...state,
        columnsConstrained: action.chart_type === 'pie',
        currentColumn:
          action.chart_type === 'pie' ? graph.data[0].length - 1 : -1,
        graphs: {
          ...state.graphs,
          [action.id]: graphs
        }
      }

    // TODO: Edit only specific graph
    case 'TOGGLE_EDIT':
      return {
        ...state,
        edit: !state.edit
      }

    /**
     * Sets a color for a given element on a graph
     *
     *  @param action.color {string} color to set
     *  @param action.i   {integer} nth element to manipulate
     *  @param action.name   {integer} nth element to manipulate
     */
    case 'SET_COLOR':
      const { color, name, row } = action;

      graphs = state.graphs[post_id]

      // swap in the new color
      graphs[activeName].colors.splice(activeRow, 1, color)

      return {
        ...state,
        graphs: {
          ...state.graphs,
          [post_id]: graphs
        }
      }

    case 'UPDATE_GRAPH':

      graph = action.graph;
      graphs = state.graphs[action.id];

      Object.assign(graphs, { [action.name]: graph })

      return {
        ...state,
        graphs: {
          ...state.graphs,
          [action.id]: graphs
        }
      }


    /**
     *  @param action.index {integer} the row to edit
     */
    case 'TOGGLE_COLOR':
      const stashedColor =
        state.graphs[post_id][action.name].colors[action.index]

      return {
        ...state,
        activeName: action.name,
        activeRow: action.index,
        stashedColor
      }

    /**
     *  @param action.index {integer} row to edit
     *  @param action.name {string} key for the graph
     */
    case 'CANCEL_COLOR':
      graphs = state.graphs[post_id]
      graph = graphs[action.name]
      graph.colors.splice(action.index, 1, state.stashedColor)
      Object.assign(graphs, {[action.name]: graph })

      const { activeName, activeRow } = initialState;

      return {
        ...state,
        // reset
        stashedColor,
        activeName,
        activeRow,

        // update graphs
        graphs: {
          ...state.graphs,
          [post_id]: graphs
        }
      }


    case 'RESET_ACTIVE':
      return {
        ...state,
        activeName: initialState.activeName,
        activeRow: initialState.activeRow,
      }

    /**
     *  Sets current column to column constrained graphs
     *  @param action.column {integer} sets current column
     *  @param action.name {string} key that identifies the graph
     */
    case 'SET_CURRENT_COLUMN':
      graphs = state.graphs[post_id]
      graph = graphs[action.name]

      Object.assign(graph, {
        currentColumn: action.column
      })

      Object.assign(graphs, {
        [action.name]: graph
      })

      return {
        ...state,
        graphs: {
          ...state.graphs,
          [post_id]: graphs
        }
      }

    /**
     *  Sets graph.active[index] to false
     *
     *  @param action.index {integer} the row to hide
     *  @param action.name {string} the key that id's the graph
     *  @param action.value {boolean} whether the row is hidden/shown
     */
    case 'SET_ROW_VISIBILITY':
      graphs = state.graphs[post_id]
      graph = graphs[action.name]
      graph.active.splice(action.index, 1, action.value )
      Object.assign(graphs, {[action.name]: graph})
      return {
        ...state,
        graphs: {
          ...state.graphs,
          [post_id]: graphs
        }
      }

    /**
     *  Updates label
     */
    case 'UPDATE_LABEL':
      graphs = state.graphs[post_id]
      graph = graphs[action.name]
      Object.assign(graph, { [`${action.axis}_axis`]: action.label})
      Object.assign(graphs, {[action.name]: graph})
      return {
        ...state,
        graphs: {
          ...state.graphs,
          [post_id]: graphs
        }
      }

    default:
      return state;
  }
}
