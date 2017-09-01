import { fetch } from '../utils/util'
//获取首页Carousel
export function getCarouselList(option) {
  fetch({
    url: `resource/list/1`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取热门商品
export function getHotGoods(option) {
  fetch({
    url: 'goods/listHotForPage',
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取分类
export function getClassification(option) {
  fetch({
    url: `category/getShopTopCategory/${option.id}`,
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//搜索
export function getSearchGoods(option) {
  fetch({
    url: 'goods/searchGoodsForPage',
    data: option.data,
    success: option.success,
    error: option.error
  })
}


