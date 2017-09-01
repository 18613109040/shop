// order.js
/**
 * satus 
 * 1 待支付 2.等待商家接单 3商家已接单 4 商家决绝接单 5配送/自提 6订单完成 7 交易关闭  99 退单
 * 
 */
import { getOrderList, orderCancel, receiptGoods} from '../../actions/order'
import { convertTimeToStr, confirm } from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: "",
    windowWidth: "",
    load: false,
    currentAllPage:1,
    currentEvaluatePage: 1,
    currentRefundPage: 1,
    type:'all',
    is_empty:false,
    orderList:{
      all:[],
      evaluate:[],
      refund:[]
    },
    shopinfo: wx.getStorageSync('shopinfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type:options.type||'all'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  onHide(){
    this.setData({
      load: false,
      currentAllPage: 1,
      currentEvaluatePage: 1,
      currentRefundPage: 1,
      type: 'all',
      orderList: {
        all: [],
        evaluate: [],
        refund: []
      }
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    this.getData('all')
  },
  /**
   * 切换tabs 
   */
  onChangeTabs:function(e){
    let type = e.currentTarget.dataset.tabType
    this.setData({ type });
    if (this.data.orderList[type].length>0){
      return;
    }else{
      this.getData(type)
    }
    
  },
  /**
   * 跳转到订单详情
   */
  onNextPage:function(e){
    let {id} = e.currentTarget.dataset;
    console.dir(id)
    wx.navigateTo({
      url: `/pages/orderDetail/index?orderId=${id}`
    })
  },
  /**
   * 下拉加载数据
   */
  scrollLower() {
    if (this.data.load) {
      return;
    } else {
      this.getData(this.data.type)
    }

  },
  /**
  * 催单
 */
  Reminder: function (e) {
    
    let { item } = e.currentTarget.dataset;
    wx.showActionSheet({
      itemList: ['打电话催催单', '商家电话:${this.data.shopinfo.service_phone}'],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  //确认收货
  receipts(e){
    let { id } = e.currentTarget.dataset;
    confirm({
      content: '确定已收到货？',
      ok: () => {
        receiptGoods({
          data: {
            orderId: id
          },
          success: (res) => {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 2000
            })
            this.setData({
              load: false,
              currentAllPage: 1,
              currentEvaluatePage: 1,
              currentRefundPage: 1,
              type: 'all',
              orderList: {
                all: [],
                evaluate: [],
                refund: []
              }
            })
            this.getData(this.data.type)
          }
        })

      }
    })
    
  },
  /**
   * 取消订单  
   */
  cancelOrder: function (e) {
    let { id } = e.currentTarget.dataset;
    var that = this
    confirm({
      content: '确定取消订单？',
      ok: () => {
        orderCancel({
          data: {
            orderId: id
          },
          success: (res) => {
            wx.showToast({
              title: '订单取消成功',
              icon: 'success',
              duration: 2000
            })
            this.setData({
              load: false,
              currentAllPage: 1,
              currentEvaluatePage: 1,
              currentRefundPage: 1,
              type: 'all',
              orderList: {
                all: [],
                evaluate: [],
                refund: []
              }
            })
            this.getData(this.data.type)
          }
        })
      }
    })
  },
  getData(type) {
    this.setData({
      load: true
    })
    getOrderList({
      data: {
        status: type == 'all' ? "" : type == 'evaluate'?4:2,
        "page.pageSize": 10,
        "page.currentPage": type == 'all' ? this.data.currentAllPage : type == 'evaluate' ? this.data.currentEvaluatePage : this.data.currentRefundPage, 
      },
      success: (res) => {
        //totalnum
        res.result.data.map(item=>{
          let totalnum = 0;
          item.goods.map(i=>{
            totalnum += i.quantity;
          })
          item.totalnum = totalnum;
        })
        switch (type) {
          case 'all':
            if (res.result.totalPage <= this.data.currentAllPage) {
              this.setData({
                load: true,
              })
            } else {
              this.setData({
                load: false,
              })
            }
            if (res.result.totalCount==0){
              this.setData({
                is_empty:true
              })
            }else{
              this.setData({
                is_empty: false
              })
            }
            this.setData({
              orderList: Object.assign(this.data.orderList,{
               all: this.data.orderList.all.concat(res.result.data)
              }),
              currentAllPage: this.data.currentAllPage + 1
            })
            
            return;
          case 'evaluate':
            if (res.result.totalPage <= this.data.currentEvaluatePage) {
              this.setData({
                load: true,
              })
            } else {
              this.setData({
                load: false,
              })
            }
            this.setData({
              orderList: Object.assign(this.data.orderList,{
                evaluate: this.data.orderList.evaluate.concat(res.result.data)
              }),
              currentEvaluatePage: this.data.currentEvaluatePage + 1
            })
            return;
          case 'refund':
            if (res.result.totalPage <= this.data.currentRefundPage) {
              this.setData({
                load: true,
              })
            } else {
              this.setData({
                load: false,
              })
            }
            this.setData({
              orderList: Object.assign(this.data.orderList,{
                refund: this.data.orderList.refund.concat(res.result.data)
              }) ,
              currentRefundPage: this.data.currentRefundPage + 1
            })
            return ;
          default:
           return ;
        } 
      }
    })
  },
})