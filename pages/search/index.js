// index.js
const storageKey = 'SEARCH_HISTORY_LIST'
import { getSearchGoods } from '../../actions/home'
Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    // 热搜
    windowHeight: "",
    windowWidth: "",
    hotList:[
      { text: '黛莱美', key: '黛莱美' },
      { text: 'BB霜', key:'BB霜'},
      { text: '自然菲', key: '自然菲' },
      { text: '雅素', key: '雅素' },
      { text: '5100', key: '5100' },
      { text: '纾雅', key:'纾雅'},
    ],
    load:false,
    goods: [],
    searchKey:"",
    resultstatus:1, 
    currentPage: 1,
    // 历史搜索
    hisList:[
      
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getStorage({
      key:storageKey,
      success:(res)=>{
        this.setData({
          hisList:res.data.filter((item,index)=>index<4)
        })
      },
      fail:()=>{
        console.log('fail')
      }
    })
  },
  onShow: function (e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
  },
  /**
   * 搜索input输入框 
   */
  onInputSearch:function(e){
    this.setData({
      searchKey: e.detail.value
    })
  },
  /**
   * 点击搜索
   */
  onSearch: function (e) {
      
    if (this.data.searchKey){
      var list = this.data.hisList
      list.unshift({
        key: this.data.searchKey,
        text: this.data.searchKey
      })
      this.setData({
        hisList:list,
        currentPage:1,
        goods:[]
      })  
      // 搜索记录保存到storage
      wx.setStorage({
        key: storageKey,
        data:list,
        success:  ()=>{
          console.log(this)
        },
        fail: function () {
          console.log('fail')
        }
      })
      
      this.getData(this.data.searchKey);

    }
  },
  scrollLower() {
    if (this.data.load) {
      return;
    } else {
      this.getData(this.data.searchKey)
    }

  },
  getData(name) {
    this.setData({
      load: true
    })
    getSearchGoods({
      data: {
        keyWord: name,
        "page.pageSize": 10,
        "page.currentPage": this.data.currentPage,
      },
      success: (res) => {
        
        if (res.result.totalCount == 0) {
          this.setData({
            load: true,
            goods: [],
            currentPage: this.data.currentPage + 1,
            resultstatus:3
          })
        } else {
          if (res.result.totalPage <= this.data.currentPage) {
            this.setData({
              load: true,
              goods: this.data.goods.concat(res.result.data),
              currentPage: this.data.currentPage + 1,
              resultstatus: 2
            })
          } else {
            this.setData({
              load: false,
              goods: this.data.goods.concat(res.result.data),
              currentPage: this.data.currentPage + 1,
              resultstatus: 2

            })
          }
        }

      }
    })
  },
  //点击历史记录
  clickhis(e){
    let { name } = e.currentTarget.dataset;
    this.setData({
      searchKey: name,

    })
    this.getData(name)
  },
  goToShop(e){
    let { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/commodityDetails/index?id=${id}`
    })
  },
  /**
   * 清空搜索记录 
   */
  onClearHis:function(){
    wx.removeStorage({
      key: storageKey,
      success:()=>{
        this.setData({
          hisList:[]
        })
      }
    })
  }
})