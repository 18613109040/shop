// index.js
import { confirm } from '../../utils/util';
import { getUser, longinOut } from '../../actions/user'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    login:false
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
    //获取用户信息
    if (this.data.login == false){
      let userInfo = wx.getStorageSync('userInfo')
      let openid = wx.getStorageSync('openid')
      if (openid) {
        if (userInfo && userInfo.nickName) {
          this.setData({
            userInfo: userInfo,
            login: true
          })
        } else {
          this.loginSys();
        }

      } else {
        this.setData({
          login: false,
          userInfo: Object.assign(userInfo, { avatarUrl:'../../images/men.png'}) 
        })
      }
    }
    
  },
  //用户登陆
  loginSys(){
    getUser({
      data: {},
      success: (res) => {
        wx.setStorageSync("userInfo", Object.assign({}, this.data.userInfo,res.result ))
        this.setData({
          userInfo: res.result,
          login: true
        })
      }
    })
  },
  //用户退出
  loginOut(){ 
    let that = this;
    confirm({
      content:"确定退出您的账号？",
      ok:()=>{
        wx.setStorageSync('userInfo', Object.assign(that.data.userInfo, { nickName: "", avatarUrl: '../../images/men.png'}));
       
        this.setData({
          userInfo: Object.assign(that.data.userInfo, { nickName: "", avatarUrl: '../../images/men.png' }),
          login:false
        })
        longinOut({
          data:{},
          success:(res)=>{
            wx.removeStorageSync('token')
            wx.removeStorageSync('uid')
            wx.removeStorageSync('openid')
          }
         
        });
      }
    })
    
  },
  
  /**
   * 跳转到全部订单
   */
  nextPage:function(e){
    var type = e.currentTarget.dataset.nextKey
    
    wx.navigateTo({
      url: '/pages/order/order?type='+ type
    })
  }
})