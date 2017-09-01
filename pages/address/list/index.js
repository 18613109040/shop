let app = getApp()
import { confirm } from '../../../utils/util'
import { getListAddress, deleteAddressById} from '../../../actions/address'
const pageConfig = {
  data: {
    serverImg: app.globalData.serverImg,
    actionSheetHidden: true,
    actionSheetItems:['编辑','删除'],
    list:[],
    clickid:"",//保存点击对象
    showNoPage:false
  },

  onLoad: function (options) {
    
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    let option = {
      "page.pageSize": 10,
      "page.currentPage": 1,
      "memberId": 1
    }
    getListAddress({
      data: option,
      success:(res)=>{
        res.result.data.map(item=>{
          item.title = item.title;
          item.address = item.detail;
        })
        this.setData({
          list: res.result.data
        })
        if (res.result.totalCount == 0){
          this.setData({
            showNoPage: true
          }) 
        }else{
          this.setData({
            showNoPage: false
          })
        }
      }
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
  onClick(e){
    let {id} = e.currentTarget.dataset;
    this.setData({
      actionSheetHidden:false,
      clickid:id
    })
  },
  bindTap(e){
    let { name } = e.currentTarget.dataset;
    if (name =="编辑"){
      wx.navigateTo({
        url: `/pages/address/add/index?id=${this.data.clickid}`
      })
    }else{
      confirm({
        title:"删除",
        content:"是否删除该地址",
        cancelText:"取消",
        ok:()=>{
          this.deleteAdress()
        }
      })
      
      
    }
    this.setData({
      actionSheetHidden: true
    })
  },
  deleteAdress(){
    let option = {
      memberId: 1,
      id: this.data.clickid
    }
    deleteAddressById({
      data: option,
      success: (res) => {
        let tem = this.data.list.filter((item) => item.id != this.data.clickid);
        this.setData({
          list: tem
        })
        wx.showToast({
          title: '删除成功',
          icon: 'success',
          duration: 2000
        })
      },
      error: (res) => {
        wx.showToast({
          title: '删除失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  actionSheetChange(){
    this.setData({
      actionSheetHidden: true
    })
  }
}
Page(pageConfig)

