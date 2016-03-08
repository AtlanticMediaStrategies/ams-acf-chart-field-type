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
    default:
      return state;
  }
}
