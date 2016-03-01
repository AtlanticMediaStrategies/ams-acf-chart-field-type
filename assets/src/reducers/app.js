const appElm = document.getElementById('app')
const initialState = {
  id: appElm.getAttribute('data-id'),
  edit: false
}

export function app(state = initialState, action) {
  switch (action.type) {
    case 'SET_DATA':
      return {
        ...state,
        data: action.fields
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
