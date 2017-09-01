import { TEST } from '../actions/test'

const initialState = {
  code: -1,
  data: {},
  message: "初始数据"
};
export function test(state = initialState, action) {
  let json = action.json;
  switch (action.type) {
    case TEST:
      return Object.assign({}, state, json);
    default:
      return state
  }
}

