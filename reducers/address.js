import {GET_LIST_ADDRESS} from '../actions/address'
const initialState = {
 
};
export function address(state = initialState, action) {
  let json = action.json;
  console.dir(json)
  switch (action.type) {
    case GET_LIST_ADDRESS:
      return Object.assign({}, state, json);
    default:
      return state
  }
}