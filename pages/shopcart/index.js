import { confirm ,alert} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allmoney:0,
    windowHeight: "",
    windowWidth:"",
    eidt:false,
    checkAll:true,
    shopInfo:{},
    is_empty:false,
    goods: [
     
    ]
  },
  onLoad(){

    this.setData({
      shopInfo: wx.getStorageSync('shopinfo')
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
    let temmoney = 0;
    //获取本地商品
    let value = wx.getStorageSync('cart');
    let temData = value.cart;
    if (value) {
      temData.map(item=>{
        item.check = item.check ? item.check : true
        if (item.check == true) {
          temmoney += item.price * item.number
        }
      })
      wx.setStorageSync('cart', {
        cart: temData
      })
      this.setData({
        goods: temData,
        is_empty: temData.length>0?false:true,
        checkAll: temData.filter(item => item.check==false).length>0?false:true,
        allmoney: temmoney
      })
    }else{
      this.setData({
        is_empty: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.dir("onReady")
  },
  //减商品
  minusCount:function(e){
    let { id, skuid} = e.currentTarget.dataset;
    let temmoney = 0;
    let tem = this.data.goods
    tem.map(item => {
      if (skuid != "undefined" && item.skuid == skuid && item.id == id) {
        item.number = item.number - 1;

      } else if (item.id == id && skuid == "undefined") {
        item.number = item.number - 1;
      }
      if (item.check == true) {
        temmoney += item.price * item.number
      }
    })
    wx.setStorageSync('cart', {
      cart: tem
    })
    this.setData({
      goods: tem,
      allmoney: temmoney
    })
  },
  //增加商品
  addCount:function(e){
    let { id,skuid } = e.currentTarget.dataset;
    let tem = this.data.goods;
    let temmoney = 0;

    tem.map(item => {
      if (skuid != "undefined" && item.skuid == skuid && item.id == id) {
        item.number = item.number + 1;


      } else if (item.id == id && skuid == "undefined") {
        item.number = item.number + 1;
      }
      if (item.check == true) {
        temmoney += item.price * item.number
      }
    })
    wx.setStorageSync('cart', {
      cart: tem
    })
    this.setData({
      goods: tem,
      allmoney: temmoney
    })
  },
  //选中商品
  checkToClick:function(e){
    let { id, skuid} = e.currentTarget.dataset;
    let tem = this.data.goods;
    let temmoney = 0;
    tem.map(item => {
      if (skuid != "undefined" && item.skuid == skuid && item.id == id) {
        item.check = !item.check;
        
      } else if (item.id == id && skuid == "undefined") {
        item.check = !item.check;
      }
      if (item.check == true) {
        temmoney += item.price * item.number
      }
    })
    wx.setStorageSync('cart', {
      cart: tem
    })
    this.setData({
      goods: tem,
      checkAll: tem.filter(item => item.check == false).length > 0 ? false : true,
      allmoney: temmoney
    })
  },
  //全选
  checkAll:function(e){
    let tem = this.data.goods;
    let temmoney = 0;
    if (this.data.checkAll){
      tem.map(item => item.check=false)
    }else{
      tem.map(item => item.check = true)
    }
    tem.map(item => {
      if (item.check == true) {
        temmoney += item.price * item.number
      }
    })
    wx.setStorageSync('cart', {
      cart: tem
    })
    this.setData({
      goods: tem,
      checkAll: !this.data.checkAll,
      allmoney: temmoney
    })
  },
  //点击编辑
  eidtCart(){
    this.setData({
      eidt:true
    })
  },
  //删除
  deleteCart(){
    confirm({
      content:"确定删除选中商品",
      cancelText:"取消",
      ok:()=>{this.delete()}
    })
  },
  //删除商品
  deleteShop(e){
    confirm({
      content: "确定删除该商品",
      cancelText: "取消",
      ok: () => { 
        let { id, skuid } = e.currentTarget.dataset;
        let tem = this.data.goods;
        if (skuid) {
          let index = tem.findIndex(item => item.id == id && skuid == item.skuid);
          console.dir(index)
          tem.splice(index, 1)
        } else {
          tem = tem.filter(item => item.id != id)
        }
        let temmoney = 0;
        tem.map(item => {
          if (item.check == true) {
            temmoney += item.price * item.number
          }
        })
        wx.setStorageSync('cart', {
          cart: tem
        })
        this.setData({
          goods: tem,
          is_empty: tem.length > 0 ? false : true,
          checkAll: tem.filter(item => item.check == false).length > 0 ? false : true,
          allmoney: temmoney
        })

      }
    })
    

  },
  //删除商品
  delete(){
    let tem = this.data.goods.filter(item => item.check==false)
    wx.setStorageSync('cart', {
      cart: tem
    })
    this.setData({
      goods: tem,
      is_empty: tem.length > 0 ? false : true,
      checkAll: tem.filter(item => item.check == false).length > 0 ? false : true,
    })
  },
  //完成
  comoentCart(){
    this.setData({
      eidt: false
    })
  },
  //去结算
  goClearing() {
    if(this.data.goods.filter(item => item.check == true).length>0){
      wx.navigateTo({
        url: '/pages/ordersubmit/index'
      })
    }else{
      alert("请选中商品")
    }
    
  },
})