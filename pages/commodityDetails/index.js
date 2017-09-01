import { getcommodityDetails, getGoodsSkuList} from '../../actions/classification'
import { getCarouselList } from '../../actions/home'
let query = {}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    commodity:{},
    detail:[],
    shopInfo: {},
    showModalStatus: false,//弹出层
    modelData: {},//用于保存弹出层的数据
    itemlistid: "",
    currentPage: 1,
    load: false,
    goodsSkuList: {
      skulist: []
    },
    goodsSku: [], //保存服务器sku数据
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
    getcommodityDetails({
      id: query.id,//query.id,
      data:{},
      success:(res)=>{
        //同步本地数据
        let value = wx.getStorageSync('cart');
        let temData = value.cart;
        if (value) {
          console.dir(temData.filter(dx => dx.id == res.result.id && dx.multiKinds == res.result.multiKinds))
          if (temData.filter(dx => dx.id == res.result.id && dx.multiKinds == res.result.multiKinds).length > 0) {
            this.setData({
              commodity: temData.filter(dx => dx.id == res.result.id && dx.multiKinds == res.result.multiKinds)[0]
            })
          } else {
            this.setData({
              commodity: Object.assign({}, res.result, { number:0}),
              detail: res.result.detail?JSON.parse(res.result.detail):[]
            })
          }
        } else {
          this.setData({
            commodity: Object.assign({}, res.result, { number: 0 }),
            detail: res.result.detail?JSON.parse(res.result.detail):[]
          })
        }
      }
    })

  },
  //跳转订单界面
  goPay(){
    wx.navigateTo({
      url: `/pages/ordersubmit/index?id=${query.id}`
    })
  },
  //减商品
  minusCount: function (e) {
    let { id } = query;
    let tem = this.data.commodity;
    this.setData({
      commodity: Object.assign({}, this.data.commodity, { number: this.data.commodity.number - 1 })
    })
    let value = wx.getStorageSync('cart') || [];
    let temData = value.cart;
    if (value) {
      if (temData.filter(i => i.id == id).length > 0) {
        temData.map(item => {
          if (item.id == id) {
            item.number = item.number - 1;
          }
        })
      } else {
        temData.push(Object.assign(tem, { number: 1 }))
      }
      wx.setStorageSync('cart', {
        cart: temData.filter(item=>item.number>0)
      })
    } 

  },
  //增加商品
  addCount: function (e) {
    let { id } = query;
    let tem = this.data.commodity;
    this.setData({
      commodity: Object.assign({}, this.data.commodity, { number: this.data.commodity.number+1})
    })
    let value = wx.getStorageSync('cart')||[];
    let temData = value.cart;
    if(value){
      if (temData.filter(i=>i.id == id).length>0){
        temData.map(item => {
          if (item.id == id) {
            item.number = item.number + 1;
          }
        })
      }else{
        temData.push(Object.assign(tem, { number: 1 }))
      }
      wx.setStorageSync('cart', {
        cart: temData
      })
    }else{
      temData.push(Object.assign(tem, { number: 1 }))
      wx.setStorageSync('cart', {
        cart: temData
      })
    }
  },

  changeSpecification(e) {
    let { name } = e.currentTarget.dataset;


  },
  //选规格
  powerDrawer: function (e) {
    let { name, statu } = e.currentTarget.dataset;
    let stroeCart = wx.getStorageSync('cart');
    if (statu == "open") {
      if (stroeCart && stroeCart.cart.filter(item => item.id == name.id && item.multiKinds == 1).length > 0) {
        this.setData({
          goodsSkuList: stroeCart.cart.filter(item => item.id == name.id && item.multiKinds == 1)[0],
          goodsSku: stroeCart.cart.filter(item => item.id == name.id && item.multiKinds == 1)[0].skuData
        })
      } else {
        getGoodsSkuList({
          id: name.id,
          data: {},
          success: (res) => {
            let ary = {}
            res.result.map(item => {
              item.attrValues.split(";").map(i => {
                let key = i.split(':')[0];
                let value = i.split(':')[1];
                if (ary[key]) {
                  ary[key] = ary[key] + "," + value
                } else {
                  ary[key] = value;
                }
              })
            })
            let array = []
            Object.keys(ary).map((item, index) => {
              let temarray = []
              console.dir(ary)
              Array.from(new Set(ary[item].split(","))).map((it, id) => {
                if (id == 0) {
                  temarray[id] = {
                    title: it,
                    check: true
                  }
                } else {
                  temarray[id] = {
                    title: it,
                    check: false
                  }
                }
              })
              array[index] = {
                name: item,
                value: temarray
              }
            })
            this.setData({
              goodsSkuList: {
                skulist: array,
                attrIds: res.result[0].attrIds,
                skuid: res.result[0].id,
                price: res.result[0].price,
                skuSalenum: res.result[0].skuSalenum,
                skuStock: res.result[0].skuStock,
                attrValues: res.result[0].attrValues,
                skuData: res.result,
                number: 0,
                noshop: false,
                id: name.id
              },
              goodsSku: res.result
            })
          }

        })
      }
    }

    this.util(statu)
    this.setData({
      modelData: name
    })
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)
    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  },
  closeTap() {
    this.setData(
      {
        showModalStatus: false
      }
    );
  },
  //点击sku
  clickSku(e) {
    let { name, type } = e.currentTarget.dataset;
    let temp = this.data.goodsSkuList.skulist;
    temp.map(item => {
      if (item.name == type) {
        item.value.map(d => {
          if (d.title == name) {
            d.check = true
          } else {
            d.check = false
          }
        })
      }
    })
    let str = ""
    temp.map(item => {
      item.value.map(d => {
        if (d.check == true) {
          if (str == "") {
            str = item.name + ":" + d.title
          } else {
            str = str + ";" + item.name + ":" + d.title
          }
        }
      })
    })
    let skutmp = this.data.goodsSku.filter(item => item.attrValues == str)
    if (skutmp.length > 0) {
      let value = wx.getStorageSync('cart');
      let temData = value.cart;
      if (value && temData.filter(item => item.multiKinds == 1 && item.id == this.data.goodsSkuList.id && skutmp[0].id == item.skuid).length > 0) {
        this.setData({
          goodsSkuList: Object.assign(this.data.goodsSkuList, {
            skulist: temp,
            attrIds: skutmp[0].attrIds,
            skuid: skutmp[0].id,
            price: skutmp[0].price,
            skuSalenum: skutmp[0].skuSalenum,
            skuStock: skutmp[0].skuStock,
            attrValues: skutmp[0].attrValues,
            number: temData.filter(item => item.multiKinds == 1 && item.id == this.data.goodsSkuList.id && skutmp[0].id == item.skuid)[0].number,
            noshop: false
          })
        })

      } else {
        this.setData({
          goodsSkuList: Object.assign(this.data.goodsSkuList, {
            skulist: temp,
            attrIds: skutmp[0].attrIds,
            skuid: skutmp[0].id,
            price: skutmp[0].price,
            skuSalenum: skutmp[0].skuSalenum,
            skuStock: skutmp[0].skuStock,
            attrValues: skutmp[0].attrValues,
            noshop: false,
            number: 0
          })
        })

      }

    } else {
      this.setData({
        goodsSkuList: Object.assign(this.data.goodsSkuList, { noshop: true })
      })
    }


  },
  //加入购物车
  addCart() {
    this.setData({
      goodsSkuList: Object.assign(this.data.goodsSkuList, { number: this.data.goodsSkuList.number + 1 })
    })
    let value = wx.getStorageSync('cart');
    if (value) {
      let fliterData = value.cart.filter(item => item.multiKinds == 1 && this.data.modelData.id == item.id && item.skuid == this.data.goodsSkuList.skuid)
      let temData = value.cart;
      if (fliterData.length > 0) {
        temData.map(item => {
          if (item.multiKinds == 1 && this.data.modelData.id == item.id && item.skuid == this.data.goodsSkuList.skuid) {
            item.number = item.number + 1
          }
        })
        wx.setStorageSync('cart', {
          cart: temData
        })

      } else {
        temData.push(Object.assign(this.data.modelData, this.data.goodsSkuList))
        wx.setStorageSync('cart', {
          cart: temData
        })
      }
    } else {
      let tem = [];
      tem.push(Object.assign(this.data.modelData, this.data.goodsSkuList, { id: this.data.modelData.id }))
      wx.setStorageSync('cart', {
        cart: tem
      })
    }
  },
  //减少
  skuMinusCount() {
    let value = wx.getStorageSync('cart');
    let temData = value.cart;
    temData.map(item => {
      if (item.multiKinds == 1 && this.data.modelData.id == item.id && item.skuid == this.data.goodsSkuList.skuid) {
        item.number = item.number - 1
      }
    })
    //商品0 删除store对应数据

    wx.setStorageSync('cart', {
      cart: temData.filter(item=>item.number>0)
    })
    this.setData({
      goodsSkuList: Object.assign(this.data.goodsSkuList, { number: this.data.goodsSkuList.number - 1 })
    })

  },
  //增加
  skuAddCount() {
    let value = wx.getStorageSync('cart');
    let temData = value.cart;
    temData.map(item => {
      if (item.multiKinds == 1 && this.data.modelData.id == item.id && item.skuid == this.data.goodsSkuList.skuid) {
        item.number = item.number + 1
      }
    })
    this.setData({
      goodsSkuList: Object.assign(this.data.goodsSkuList, { number: this.data.goodsSkuList.number + 1 })
    })
    wx.setStorageSync('cart', {
      cart: temData
    })
  }
})