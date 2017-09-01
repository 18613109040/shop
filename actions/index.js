import { fetch } from '../utils/util'
//根据经纬度获取附近小店
export function getListShopByL(option) {
  fetch({
    url: 'shop/listForPage',
    data: option.data,
    success: option.success,
    error: option.error
  })

}
//获取店铺图片
export function getShopImage(option){
  fetch({
    url: 'shop/listImg',
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//地址搜索
export function searchAdress(option){
  fetch({
    url: 'resource/address/suggestion',
    data: option.data,
    success: option.success,
    error: option.error
  })
}