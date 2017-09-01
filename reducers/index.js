const Redux = require('../libs/redux.js')
const combineReducers = Redux.combineReducers
import { test } from './test'
import { address } from './address'
const todoApp = combineReducers({
  test,
  address
})

module.exports = todoApp