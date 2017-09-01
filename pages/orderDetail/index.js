
import { getOrderOetails, orderCancel,receiptGoods} from '../../actions/order'
import { convertTimeToStr, confirm} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId:"",
    orderList: {},
    shopinfo: wx.getStorageSync('shopinfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    getOrderOetails({
      data:{
        memberId:1 ,
        orderId: this.data.orderId
      },
      success:(res)=>{
        this.setData({
          orderList: Object.assign(res.result, { createDt: convertTimeToStr(res.result.createDt,'yyyy-MM-dd hh:mm:ss')})
        })
      }
    })
    
  
  },
  //拨打电话
  callPhone(){
    console.dir(this.data.shopinfo.service_phone)
    wx.makePhoneCall({
      phoneNumber: this.data.shopinfo.service_phone
    })
  },
  


  nextPage:function(){

  },
  /**
   * 取消订单  
   */
  cancelOrder:function(e){
    var that = this
    confirm({
      content: '确定取消订单？',
      ok:()=>{
        orderCancel({
          data:{
            memberId:1,
            orderId: this.data.orderId
          },
          success:(res)=>{
            wx.showToast({
              title: '订单取消成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack();
          }
        })
      }
    })
  },
  //立即支付
  goPay(){
    // wx.requestPayment({
    //   'timeStamp': '',
    //   'nonceStr': '',
    //   'package': '',
    //   'signType': 'MD5',
    //   'paySign': '',
    //   'success': function (res) {
    //   },
    //   'fail': function (res) {
    //   }
    // })
  },
  /**
   * 确定收货  
   */
  confirmReceipt: function (e) {
    var that = this
    wx.showModal({
      content: '确定商品已送达？',
      showCancel: true,
      confirmColor: '#ff004c',
      success: function (res) {
        receiptGoods({
          data: {
            orderId: this.data.orderId
          },
          success: (res) => {
            wx.showToast({
              title: '操作成功',
              icon: 'success',
              duration: 2000
            })
            wx.navigateBack();
          }
        })
      }
    })
  },

  /**
   * 催单
  */
  Reminder:function(){
    wx.showActionSheet({
      itemList: ['打电话催催单', `商家电话:${this.data.shopinfo.service_phone}`],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})