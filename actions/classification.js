import { fetch } from '../utils/util'
//获取分类
export function getCategoryList(option) {
  fetch({
    url: `category/getShopCategory/${option.shopid}`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//获取商品
export function getCategoryGoods(option) {
  fetch({
    url: `category/getCategoryGoods`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取商品sku
export function getGoodsSkuList(option) {
  fetch({
    url: `goods/getGoodsSkuList/${option.id}`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取商品详情
export function getcommodityDetails(option) {
  fetch({
    url: `goods/getGoodsDetail/${option.id}`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}