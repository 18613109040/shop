// index.js
import { register, sendCode } from '../../actions/user'
let ov = null ;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone:"",
    verifyCode:"",
    name:"获取验证码",
    loading:false,
    disabled:false
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
  
  },
  changeImput(e){
    this.setData({
      phone: e.detail.value
    })
  },
  //验证吗
  changeverifyCode(e){
    this.setData({
      verifyCode: e.detail.value
    })
  },
  //绑定手机号
  bindCode(){
    let openid = wx.getStorageSync("openid");
    if (openid){
      register({
        data: {
          phone: this.data.phone,
          verifyCode: this.data.verifyCode,
          openId: openid
        },
        success:(res)=>{
          wx.setStorageSync("token", res.result.token);
          wx.setStorageSync("uid", res.result.uid);
          wx.navigateBack();
        }
      })
    }else{

    }
    
  },
  onUnload(){
    if (this.data.ov)
     clearInterval(this.ov);
  },
  //获取手机验证码
  getCode(){
    if (!this.data.phone){
        return ;
    }
    this.setData({
      loading:true,
      disabled:true
    })
    let time = 120;
    ov =  setInterval((res)=>{
      if(time==1){
        this.setData({
          name: "获取验证码",
          loading: false,
          disabled: false
        })
        clearInterval(ov);
        return;
      }
      time--
      this.setData({
        name: `${time}s后重新获取`
      })
    },1000)
    sendCode({
      data:{
        phone: this.data.phone
      },
      success:(res)=>{

        console.dir(res);
      }
    })
  
   // this.data.phone
  },
  nextPage:function(e){
    wx.navigateTo({
      url: '/pages/register/index',
    })
  }
})