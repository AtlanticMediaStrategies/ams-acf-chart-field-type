import { colors } from '../components/Graphs/config.js';
import qs from 'qs';

const initialState = {
  edit: false,
  graphs: {}
}


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
      graphs = state.graphs[action.id] || {};
      graph = graphs[action.name] || {};

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
      const { color, i, name} = action;
      const post_id = qs.parse(window.location.search.replace('?', '')).post

      graphs = state.graphs[post_id]
      graph = graphs[action.id]

      graph.colors.splice(i, 1, color)

      Object.assign(graphs, { [action.id]: graph });

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
