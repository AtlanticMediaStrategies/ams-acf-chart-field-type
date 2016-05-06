import { chart_colors } from '../components/Graphs/config.js';
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
  const graphs = state.graphs[post_id] || {}

  switch (action.type) {
    /**
     * Sets and existing graph data on initial load
     *
     *  @param action.id {integer}  id for the post
     *  @param action.name {string} name for the field
     *  @param action.data{string} stringified json
     */
    case 'SET_DATA':
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

    /**
     * Initialize a graph when uploading a csv
     *
     * @param action.id {integer}  id for the post
     * @param action.name {string} name for the field
     * @param action.graph {object} stringified json
     */
    case 'CREATE_GRAPH':

      // intialize base colors
      const graph_colors =
        action.graph.data.map((color, i) => chart_colors[i % chart_colors.length])

      Object.assign(action.graph, {
        active_rows: Array(action.graph.data.length).fill(true),
        colors: graph_colors
      })

      Object.assign(graphs, {
        [action.name]: action.graph
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
       *  @param action.values {object} param to assign to existing graph
       */
      case 'SET_GRAPH_VALUE':
        graph = graphs[action.name]

        Object.assign(graph, action.values)
        graphs[action.name] = graph

        return {
          ...state,
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
        graphs[action.name].colors[action.index]

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
      graph = graphs[action.name]
      graph.colors.splice(action.index, 1, state.stashedColor)
      graphs[action.name] =  graph

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
      graph = graphs[action.name]

      Object.assign(graph, {
        currentColumn: action.column
      })

      graphs[action.name] = graph

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
      graph = graphs[action.name]
      graph.active_rows.splice(action.index, 1, action.value )
      graphs[action.name] = graph
      return {
        ...state,
        graphs: {
          ...state.graphs,
          [post_id]: graphs
        }
      }

    /**
     *  Toggles column
     *
     *  @param action.index {integer} index of column
     *  @param action.name {string} key of the graph to edit
     */
    case 'TOGGLE_COLUMN':
      graph =  graphs[action.name]
      const index = graph.active_columns.indexOf(action.index)
      if(index > -1) {
        graph.active_columns.splice(index, 1)
      } else {
        graph.active_columns.push(action.index)
      }

      graphs[action.name] = graph

      return {
        ...state,
        graphs: {
          ...state.graphs,
          [post_id]: graphs
        }
      }

    case 'SHOW_ALL_COLUMNS':
      graph = graphs[action.name]
      graph.active_columns =
        graph.data[0]
          .map((row, index) => index)
          .filter(val => val !== 0)

      graphs[action.name] = graph

      return {
        ...state,
        graphs: {
          ...state.graphs,
          [post_id]: graphs
        }
      }

    case 'HIDE_ALL_COLUMNS':
      graph = graphs[action.name]
      Object.assign(graphs, {
        [action.name]: {
          ...graph,
          active_columns: []
        }
      })

      return {...state, graphs: {
        ...state.graphs,
        [post_id]: graphs
      }}

    default:
      return state;
  }
}
