import { postOrder, orderAdressList} from '../../actions/order'
let app = getApp()
let query={}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    check:0, 
    pay:[{
      payType:0,
      name:"到店支付"
    }
    // ,{
    //     payType: 1,
    //     name: "微信支付"
    // }, {
    //     payType: 2,
    //     name: "支付宝支付"
    // }
    ],
    serverImg: app.globalData.serverImg,
    deliveryType:1, //1 自提 2 送货
    ziti:2,
    shopInfo:{},
    songhuo:2,
    windowHeight:"",
    windowWidth:"",
    goods: [ ],
    allmoney:0,
    adress:{},//收货地址
    typeflage:false 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    query = options;
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
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    let shopinfo = wx.getStorageSync('shopinfo');
    if (shopinfo) {
      this.setData({
        shopInfo: shopinfo
      })
    } else {
      wx.redirectTo({
        url: "/pages/index/index"
      })
    }
    let temmoney = 0;
    //获取本地商品
    if (query.id){
      let value = wx.getStorageSync('cart');
      let temData =[];
      if (value) {
        temData = value.cart.filter(item => item.id == query.id);
        temData.map(item => {
          temmoney += item.price * item.number
        })
        this.setData({
          goods: temData,
          allmoney: temmoney
        })
      }
    }else{
      let value = wx.getStorageSync('cart');
      let temData = value.cart.filter(item => item.check == true);
      if (value) {
        temData.map(item => {
          if (item.check == true) {
            temmoney += item.price * item.number
          }
        })
        this.setData({
          goods: temData,
          allmoney: temmoney
        })
      }
    }
    var adressSotre = wx.getStorageSync('address')
    if (adressSotre) {
      this.setData({
        adress: adressSotre,
        typeflage: true
      })
    }else{
      this.getaddresbyweb()
    }

  },
  checkToClick:function(e){
    let { item } = e.currentTarget.dataset;
    this.setData({
      check: item.payType
    })
  },
  //自提
  clickZiTi:function(){
    this.setData({
      deliveryType:1,
      ziti: 2,
      songhuo: 2,
      pay: [{
        payType: 0,
        name: "到店支付"
      }]
    })
  },
  //送货上门
  clickDelivery:function(){
    //获取收货地址
    //this.getaddresbyweb()
    this.setData({
      deliveryType: 2,
      ziti: 1,
      songhuo: 1,
      pay: [{
        payType: 0,
        name: "货到付款"
      }]
    })
  },
  getaddresbyweb(){
      //获取收货地址
    let value = wx.getStorageSync('shopinfo')
    if (value) {
      orderAdressList({
        data: {
          memberId: 1,
          shopId: value.id
        },
        success: (res) => {
          if (res.result.length > 0) {
            let tem = res.result.filter(item => item.available == true);
            if (tem.length > 0) {
              this.setData({
                adress: tem[0],
                typeflage: true
              })
            } else {
              this.setData({
                adress: {},
                typeflage: false
              })
            }
            wx.setStorageSync('address', tem[0])
          } else {
            this.setData({
              adress: {},
              typeflage: false
            })
          }
        }
      })
    }
      
  },
  //立刻送出
  sendOut(){
    this.setData({
      actionSheetHidden:false
    })
  },
  //提交订单
  postClickOrder(e){
    let openId = wx.getStorageSync('openid')
    let  products = []; 
    this.data.goods.map(item=>{
      products.push({
        "productId": item.id,
        "amount": item.number,
        "skuId": item.skuid ? item.skuid:""
      })
    })
    let postData = {
      "addressId": this.data.deliveryType == 2 ? this.data.adress.id:"",
      "shipType": this.data.deliveryType-1, //shipType 0自提 1送货上门
      "remark": "压力测试下单",
      "fromId": e.detail.formId,
      "openId": openId,
      "shopId": this.data.shopInfo.id,
      "payType": this.data.check ,//0 线下 1 微信 2 支付宝
      "products": products
    }
    console.dir(postData)
    postOrder({
      data: postData,
      success:(res)=>{
        wx.showToast({
          title: '订单提交成功',
          icon: 'success',
          duration: 2000
        })
        let value = wx.getStorageSync('cart');
        let temData = value.cart.filter(item => item.check == false);
        let cartall = wx.getStorageSync('cartall');
        if (cartall){
          this.data.goods.map(item=>{
            cartall = cartall.filter(it => it.id != item.id && it.shopId != item.shopId)
          })
          wx.setStorageSync('cartall', cartall)
        }
        wx.setStorageSync('cart', {cart:temData})
        
        wx.redirectTo({
          url: '/pages/order/order'
        })

      }
    })
  },
  //选择地址
  chengeAdress(){
    wx.navigateTo({
      url: '/pages/address/select/index'
    })
  }


})