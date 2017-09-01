//app.js
import {
  getCurrentAddress
} from './utils/util'
import { getOpenid, getUserInfo} from './actions/user'
//const { Provider } = require('./libs/wechat-weapp-redux.js');
//const configureStore = require('./configureStore.js');
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据



  //  let cartAll = wx.getStorageSync('cartall')
  //  if (cartAll && cartAll.length>0){
  //    let cart = wx.getStorageSync('cart')
  //    if(cart){

  //    }
  //  }else{
  //    let cart = wx.getStorageSync('cart')
  //  }
   
   

  },
  //微信授权 手动
  getwxAuthorize(){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              wx.getUserInfo();

            }
          })
        }
      }
    })
  },
  //获取小程序微信code
  getWxCoode(cb){
    if (this.globalData.coode) {
      typeof cb == "function" && cb(this.globalData.coode)
    } else {
      wx.login({
        success: function (res) {
          that.globalData.coode = res.code
          typeof cb == "function" && cb(that.globalData.code)
        }
      })
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (res) {
          wx.getUserInfo({
            success: function (res) {
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  getCurrentAddress(cb) {
    getCurrentAddress(address => {
      cb(address)
    })
  },
  globalData: {
    userInfo: null,
    shopinfo:null,
    coode:null,
    serverImg: "/images",
    serverURL: 'http://rapapi.org/mockjsdata/20680/'
  }
})
