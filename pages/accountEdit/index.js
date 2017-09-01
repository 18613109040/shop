import { host } from '../../config'
import { eidtUser} from '../../actions/user'
import {alert} from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionSheetHidden: true,
    actionSheetItems: ['相机拍摄', '相册'],
    userInfo: wx.getStorageSync('userInfo')
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
  actionSheetChange() {
    this.setData({
      actionSheetHidden: true
    })
  },
  onClickImage() {
    this.setData({
      actionSheetHidden: false,
    })
  },
  bindTap(e) {
    let { name } = e.currentTarget.dataset;
    let token = wx.getStorageSync('token');
    let uid = wx.getStorageSync('uid')
    if (name == "相机拍摄") {
      let uploadTask= wx.chooseImage({
        count: 1, // 默认9
       // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
        success:  (res)=> {
          console.dir(res)
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths;
          console.dir(tempFilePaths)
          console.dir(host + "/api/upload/photoUpload")
          wx.uploadFile({
            url: host +"/api/upload/photoUpload",
            filePath: tempFilePaths[0],
            name: 'file',
            header:{
              "content-type":"multipart/form-data",
              "Shop-Token": token,
              "Shop-UID": uid
            },
            formData: {
              'file': tempFilePaths[0]
            },
            success:  (res)=> {
              this.setData({
                userInfo: Object.assign(this.data.userInfo, { avatarUrl: JSON.parse(res.data).result})
              })
            }, fail:(red)=>{
              console.dir(res)
            }
          })
        }
      })

      
    } else {
      let uploadTask= wx.chooseImage({
        count: 1, // 默认9
      //  sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
        success: (res)=> {
          console.dir(res)
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          var tempFilePaths = res.tempFilePaths;
          console.dir(tempFilePaths)
          console.dir(host + "/api/upload/photoUpload")
          wx.uploadFile({
            url: host + "/api/upload/photoUpload", 
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              "content-type": "multipart/form-data",
              "Shop-Token": token,
              "Shop-UID": uid
            },
            formData: {
              'file': tempFilePaths[0]
            },
            success:  (res)=>{
              this.setData({
                userInfo: Object.assign(this.data.userInfo, { avatarUrl: JSON.parse(res.data).result })
              })       
            },fail: (red) => {
              console.dir(res)
            }
          })
        }
      })

      
    }
    this.setData({
      actionSheetHidden: true
    })
  },
  //保存用户信息
  formSubmit(e){

    console.dir(e.detail.value);
    if (!e.detail.value.nickName){
      alert("请填写昵称")
      return ;
    }
  
    eidtUser({
      data:{
        nickName: e.detail.value.nickName,
        gender: e.detail.value.gender,
        avatarUrl: this.data.userInfo.avatarUrl,
        // country: this.data.userInfo,
        // province: this.data.userInfo.city,
        city: this.data.userInfo.city

      },
      success:(res)=>{
        alert("修改用户信息成功")
        wx.setStorageSync('userInfo',
        Object.assign(this.data.userInfo, { nickName: e.detail.value.nickName, gender: e.detail.value.gender }))
        wx.navigateBack();
      }

    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})