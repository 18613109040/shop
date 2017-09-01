// order.js
import { alert, getKeyAdress } from '../../../utils/util'
import { getAddressById, eidtAddressById, addAddressById } from '../../../actions/address'
import WxValidate from '../../../utils/WxValidate'
let query = {}
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showpage: false,
    searchData:{},
    result: [],//保存补完与提示
    contact: "",
    phone: "",
    title: "",
    houseNumber: "",
    id:0,
    loading: false,
    checked:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    query = option;
    this.initValidate();
    if (query.id) {
      wx.setNavigationBarTitle({
        title: '编辑地址'
      })
      let options = {
        memberId: 1,
        id: query.id
      }
      getAddressById({
        data: options,
        success: (res) => {
          this.setData({
            contact: res.result.contact,
            phone: res.result.phone,
            title: res.result.title,
            houseNumber: res.result.houseNumber,
            eidtData: res.result,
            city: res.result.city,
            checked: res.result.gender,
            searchData:{
              province: res.result.province,
              city: res.result.city,
              district: res.result.area,
              detail: res.result.detail,
              title: res.result.title,
              address: res.result.detail,
              location:{
                lng: res.result.lng,
                lat: res.result.lat
              }
            }          
          })
        }
      })
    }else{
      let value = wx.getStorageSync('userInfo')
      if (value) {
        this.setData({
          city: value.city
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  radioChange(e){
    this.setData({
      checked: e.detail.value
    })
  },
  
  initValidate() {
    this.validate = new WxValidate({
      contact: {
        required: true,
      },
      phone: {
        required: true,
        tel: true,
      },
      title: {
        required: true
      },
      houseNumber: {
        required: true
      },
    }, {
        contact: {
          required: '请输入收货人姓名'
        },
        phone: {
          required: '请输入手机号',
          tel: '请输入有效手机号码'
        },
        title: {
          required: '请输入收货地址'
        },
        houseNumber: {
          required: '请输入详细地址'
        },
      })
  },
  //点击地址
  clickAdress() {
    this.setData({
      showpage: true
    })
  },
  changeImput(e){
    console.dir(e.detail)
    let value = e.detail.value;
    let { name } = e.currentTarget.dataset;
    if (name == "contact"){
      this.setData({
        contact: value
      })
    } else if (name == "phone"){
      this.setData({
        phone: value
      })
    } else if (name == 'houseNumber'){
      this.setData({
        houseNumber: value
      })
    }
    
  },
  bindAddressInput(e){
    let value = e.detail.value;
    console.dir(this.data.city)
    let optins = {
      value: value,
      region: this.data.city
    }
    getKeyAdress(optins, (res) => {
      this.setData({
        result: res.data
      })
    })
  },
  //点击搜索结果
  clickSuchAdress(e) {
    let { name } = e.currentTarget.dataset;
    this.setData({
      showpage:false,
      result: [],
      searchData: name,
      title:  name.title,


    })
  },
  formSubmit: function (e) {
    if (!this.validate.checkForm(e)) {
      const error = this.validate.errorList[0]
      return alert(error.msg)
    }
    console.dir(this.data.searchData)
    let option = {
      contact: e.detail.value.contact,
      phone: e.detail.value.phone,
      gender: e.detail.value.gender,
      title: this.data.searchData.title,
      detail: this.data.searchData.address ,
      houseNumber: e.detail.value.houseNumber,
      isDefault: 1,
      province: this.data.searchData.province,
      city: this.data.searchData.city,
      area: this.data.searchData.district,
      lng: this.data.searchData.location.lng,
      lat: this.data.searchData.location.lat

    }
    if (query.id) {
      eidtAddressById({
        data: Object.assign({ id: query.id}, option),
        success: (res) => {
          wx.showToast({
            title: '修改成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack();
        },
        error: (res) => {

        }
      })

    } else {
      addAddressById({
        data: option,
        success: (res) => {
          wx.showToast({
            title: '新增成功',
            icon: 'success',
            duration: 2000
          })
          wx.navigateBack()
        },
        error: (res) => {

        }

      })
    }

  }

})