const initialState = {
  ids: [],
  edit: false,
  graphs: {}
}

export function app(state = initialState, action) {
  switch (action.type) {
    case 'PUSH_ID':
      return {
        ...state,
        ids: [...state.ids, action.id]
      }
    case 'SET_DATA':
      return {
        ...state,
        data:  {
          ...state.data,
          edit: false,
          [action.id]: action.data
        }
      };
    case 'TOGGLE_EDIT':
      return {
        ...state,
        edit: !state.edit
      }
    default:
      return state;
  }
}
