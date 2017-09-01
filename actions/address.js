import { fetch} from '../utils/util'
export const GET_LIST_ADDRESS = "GET_LIST_ADDRESS";
//获取地址
export function getListAddress(option) {
  fetch({
    url: 'api/address/pager',
    data: option.data,
    success: option.success,
    error: option.error
  })

}
//通过ID 获取地址详情
export function getAddressById(option) {
  fetch({
    url: 'api/address/get',
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//修改地址
export function eidtAddressById(option) {
  fetch({
    url: 'api/address/update',
    method:"POST",
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//新增收货地址
export function addAddressById(option) {
  fetch({
    url: 'api/address/add',
    method: "POST",
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//删除收货地址
export function deleteAddressById(option) {
  fetch({
    url: '/api/address/delete',
    method: "POST",
    data: option.data,
    success: option.success,
    error: option.error
  })
}

