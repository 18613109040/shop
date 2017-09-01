import { fetch } from '../utils/util'
//提交订单
export function postOrder(option) {
  fetch({
    url: `api/order/add`,
    method: "POST",
    header: {
      'content-type': 'application/json'
    },
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//下单选择收货地址
export function orderAdressList(option) {
  fetch({
    url: `api/address/available`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//订单列表
export function getOrderList(option) {
  fetch({
    url: `api/order/page`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//订单明细
export function getOrderOetails(option) {
  fetch({
    url: `api/order/get`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//取消订单
export function orderCancel(option) {
  fetch({
    url: `api/order/cancel`,
    method: "POST",
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//确认收货
export function receiptGoods(option) {
  fetch({
    url: "api/order/receipt",
    method: "POST",
    data: option.data,
    success: option.success,
    error: option.error
  })
}