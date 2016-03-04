const initialState = {
  ids: [],
  edit: false,
  graphs: {}
}

export function app(state = initialState, action) {
  let graph;

  switch (action.type) {
    case 'PUSH_ID':
      return {
        ...state,
        ids: [...state.ids, action.id]
      }
    case 'SET_DATA':
      graph = state.graphs[action.id] || {};
      Object.assign(graph, action.data)
      return {
        ...state,
        graphs:  {
          ...state.graphs,
          [action.id]: graph
        }
      };
    case 'SET_TYPE':
      graph = state.graphs[action.id]
      Object.assign(graph, {
        type: action.chart_type
      })
      return {
        ...state,
        graphs: {
          ...state.graphs,
          [action.id]: graph
        }
      }
    case 'TOGGLE_EDIT':
      return {
        ...state,
        edit: !state.edit
      }
    default:
      return state;
  }
}
