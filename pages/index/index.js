//index.js
let city = require('../../utils/city.js');
import { alert, getKeyAdress } from '../../utils/util'
import { getListShopByL } from '../../actions/index'
import { getUserInfo, getOpenid} from '../../actions/user'
//获取应用实例
let app = getApp()
Page({
  data: {
    address:"", //地址
    result: [],//保存补完与提示
    resultPage:0,//0 默认 1 没结果
    selectindex:0, //默认选中店铺
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    tHeight: 0,
    bHeight: 0,
    startPageY: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,
    city: "广州",
    cityselect:false,
    serverImg:app.globalData.serverImg,
    adressData:[]
  },
  onLoad: function (options) {
    
    // 生命周期函数--监听页面加载
    let searchLetter = city.searchLetter;
    let cityList = city.cityList();
    let sysInfo = wx.getSystemInfoSync();
    let winHeight = sysInfo.windowHeight;
    //添加要匹配的字母范围值
    //1、更加屏幕高度设置子元素的高度
    let itemH = winHeight / searchLetter.length;
    let tempObj = [];
    for (let i = 0; i < searchLetter.length; i++) {
      let temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      cityList: cityList
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成


  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    app.getCurrentAddress((res) => {

      wx.setStorageSync("userInfo", res)
      var latitude = res.location.lat;
      var longitude = res.location.lng;
      this.setData({
        city: res.city,
        userinfo: res
      })
      let optins = {
        longitude: longitude, 
        latitude: latitude,//'113.244140',
        "page.pageSize": 30,
        "page.currentPage": 1,
        myLongitude: longitude,//'23.397570',
        myLatitude: latitude//'113.244140'
      }
      getListShopByL({
        data: optins,
        success: (res) => {
          if (res.result.data.length == 0) {
            this.setData({
              resultPage: 1
            })
          } else {
            res.result.data.map(item => {
              if (item.distance > 1000) {
                item.distance = (item.distance / 1000).toFixed(2) + "公里"

              } else {
                item.distance = item.distance + "米"
              }
              item.duration = Math.ceil((item.duration / 60))
            })
            this.setData({
              adressData: res.result.data,
              resultPage: 0
            })
          }
          
        }
      })

    })
    

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  searchStart: function (e) {
    let showLetter = e.currentTarget.dataset.letter;
    let pageY = e.touches[0].pageY;
    this.setScrollTop(this, showLetter);
    this.nowLetter(pageY, this);
    this.setData({
      showLetter: showLetter,
      startPageY: pageY,
      isShowLetter: true,
    })
  },
  searchMove: function (e) {
    let pageY = e.touches[0].pageY;
    let startPageY = this.data.startPageY;
    let tHeight = this.data.tHeight;
    let bHeight = this.data.bHeight;
    let showLetter = 0;
    console.log(pageY);
    if (startPageY - pageY > 0) { //向上移动
      if (pageY < tHeight) {
        // showLetter=this.mateLetter(pageY,this);
        this.nowLetter(pageY, this);
      }
    } else {//向下移动
      if (pageY > bHeight) {
        // showLetter=this.mateLetter(pageY,this);
        this.nowLetter(pageY, this);
      }
    }
  },
  searchEnd: function (e) {
    // console.log(e);
    // var showLetter=e.currentTarget.dataset.letter;
    let that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)

  },
  nowLetter: function (pageY, that) {//当前选中的信息
    let letterData = this.data.searchLetter;
    let bHeight = 0;
    let tHeight = 0;
    let showLetter = "";
    for (let i = 0; i < letterData.length; i++) {
      if (letterData[i].tHeight <= pageY && pageY <= letterData[i].bHeight) {
        bHeight = letterData[i].bHeight;
        tHeight = letterData[i].tHeight;
        showLetter = letterData[i].name;
        break;
      }
    }
    this.setScrollTop(that, showLetter);
    that.setData({
      bHeight: bHeight,
      tHeight: tHeight,
      showLetter: showLetter,
      startPageY: pageY
    })
  },
  bindScroll: function (e) {
    console.log(e.detail)
  },
  setScrollTop: function (that, showLetter) {
    let scrollTop = 0;
    let cityList = that.data.cityList;
    let cityCount = 0;
    let initialCount = 0;
    for (let i = 0; i < cityList.length; i++) {
      if (showLetter == cityList[i].initial) {
        scrollTop = initialCount * 30 + cityCount * 41;
        break;
      } else {
        initialCount++;
        cityCount += cityList[i].cityInfo.length;
      }
    }
    that.setData({
      scrollTop: scrollTop
    })
  },
  //点击城市选中
  bindCity: function (e) {
    let city = e.currentTarget.dataset.city;
    this.setData({ 
      city: city,
      cityselect: false
    })
  },
  //输入
  bindAddressInput:function(e){
    let value = e.detail.value;
    let optins={
      value: value,
      region: this.data.city
    }
   
    getKeyAdress(optins,(res)=>{
      this.setData({
        result:res.data
      })
    })
  },
  cityClick: function(e){
    this.setData({
      cityselect: !this.data.cityselect
    })
  },
  //进入店铺
  redirectToHome:function(e){
    let { name } = e.currentTarget.dataset;
    console.dir(name)
    wx.removeStorageSync('address')
    wx.getStorage({
      key: 'cartall',
      success: function (res) {
        let cart = wx.getStorageSync('cart')
        if (cart && cart.cart.length > 0) {
          let tem = res.data.filter(item => item.shopId !== cart.cart[0].shopId || item.shopId == 0);
          cart.cart.map(item=>{
            tem = tem.filter(it => it.id != item.id && it.shopId==0)
          })
          tem = tem.concat(cart.cart)
          wx.setStorageSync('cartall', tem)
          wx.removeStorage({
            key: 'cart',
            success: function (res) {
              let shopcart = tem.filter(item => item.shopId == name.id || item.shopId == 0);
              if (shopcart.length>0){
                wx.setStorageSync('cart', { cart:shopcart})
              }
            }
          })
        }else{
          
          wx.removeStorageSync('cart')
        }
      },
      fail: (res) => {
        let cart = wx.getStorageSync('cart')
        if (cart&&cart.cart.length>0) {
          wx.setStorageSync('cartall', cart.cart)
          wx.removeStorage({
            key: 'cart',
            success: function (res) {
              let shopcart = cart.cart.filter(item => item.shopId == name.id || item.shopId == 0 );
              if (shopcart.length > 0) {
                wx.setStorageSync('cart', { cart: shopcart })
              }
            }
          })
        }

      }
    })
   
    wx.setStorage({
      key: "shopinfo",
      data: name
    })
    app.globalData.shopinfo = name;
    wx.switchTab({
      url: '/pages/home/index'
    })
  },
  //点击搜索结果
  clickSuchAdress(e){
    let {name} = e.currentTarget.dataset;
    let optins = {
      longitude: name.location.lng,
      latitude: name.location.lat,
      "page.pageSize": 30,
      "page.currentPage": 1,
      myLongitude: this.data.userinfo?this.data.userinfo.location.lng:"" ,
      myLatitude: this.data.userinfo?this.data.userinfo.location.lat:"" 
    }
    getListShopByL({
      data: optins,
      success:(res)=>{
        if (res.result.data.length == 0) {
          this.setData({
            resultPage: 1
          })
        }else{
          res.result.data.map(item => {
            if (item.distance>1000){
              item.distance = (item.distance / 1000).toFixed(2) + "公里"
             
            }else{
              item.distance = item.distance+"米"
            }
            item.duration = Math.ceil((item.duration / 60)) 
          })
          this.setData({
            adressData: res.result.data,
            resultPage: 0
          })
        }
      }
    })
    this.setData({
      result:[],
      address: name.title
    })
  },
  //选择店铺
  selectTab(e){
    let { id } = e.currentTarget.dataset;
    this.setData({
      selectindex:id
    })
  }
})
