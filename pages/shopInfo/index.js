// index.js
import { getShopImage} from '../../actions/index'
Page({

  /**
   * 页面的初始数据
   */

  data: {
    shopinfo: {},//wx.getStorageSync("shopinfo"),
    imageList:[],
    markers:[]

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key: 'shopinfo',
      success: (res)=> {
        console.dir(res.data)
      getShopImage({
          data: {
            id: res.data.id
          },
          success: (resp) => {
            this.setData({
              imageList: resp.result
            })
          }
      })
      this.setData({
        shopinfo: res.data,
         markers:[{
           iconPath: "../../images/universal_location_red.png",
           id: 0,
           latitude: res.data.latitude,
           longitude: res.data.longitude,
           width: 30,
           height: 30
         }]
       })
      }
    })

  },
  onReady: function (e) {

  },
  onShow: function (e) {
    // console.dir(this.data.shopinfo.id)
    // getShopImage({
    //   data: {
    //     id: this.data.shopinfo.id
    //   },
    //   success:(res)=>{
    //     this.setData({
    //       imageList: res.result
    //     })
    //   }
    // })
  }
})