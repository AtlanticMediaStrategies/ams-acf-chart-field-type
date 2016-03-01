const appElm = document.getElementById('app')
const initialState = {
  id: appElm.getAttribute('data-id')
}

export function app(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
    }
}
