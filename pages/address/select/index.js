import {orderAdressList } from '../../../actions/order'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adressList:[],
    serverImg: app.globalData.serverImg,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getaddresbyweb()
  },
  //选中地址
  changeAdress(e){
    let { id } = e.currentTarget.dataset;
    wx.setStorageSync('address', this.data.adressList.filter(item => item.id == id)[0])
    wx.navigateBack();
  },
  getaddresbyweb() {
    let value = wx.getStorageSync('shopinfo')
    if (value) {
      //获取收货地址
      orderAdressList({
        data: {
          memberId: 1,
          shopId: value.id
        },
        success: (res) => {
          this.setData({
            adressList: res.result
          })
        }
      })

    } else {

    }
  },
})