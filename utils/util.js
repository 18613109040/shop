import QQMapWX from './qqmap-wx-jssdk.min'
import { host, qqmapKey } from '../config'
//import { getOpenid } from '../actions/user'
const qqmap = new QQMapWX({
  key: qqmapKey
});

export function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
export function convertTimeToStr(timeStamp, fmt = 'yyyy-MM-dd hh:mm:ss') {
  let date, k, o, tmp;
  if (!timeStamp) { return false; }
  if (typeof timeStamp == 'string') {
    timeStamp = parseInt(timeStamp)
  }
  //如果是10位数,则乘以1000转换为毫秒
  if (timeStamp.toString().length == 10) {
    timeStamp = timeStamp * 1000
  }
  date = new Date(timeStamp);
  o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        tmp = RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length);
        fmt = fmt.replace(RegExp.$1, tmp);
      }
    }
  }
  return fmt
}
//关键子输入提示
export function getKeyAdress(options, cb) {
  qqmap.getSuggestion({
    keyword: options.value,
    region: options.region,
    success: function (res) {
      cb(res);
    },
    fail: function (res) {
     
    },
    complete: function (res) {

    }
  });
}
// 获取当前地址
export function getCurrentAddress(callback) {
  getCurrentAddressList({
    success(addressList) {
      if (addressList.length > 0) {
        callback(addressList[0])
      }
    }
  })
}
// 获取当前地理位置
export function getCurrentAddressList(options) {
  const {
    success, complete
  } = options
  wx.getLocation({
    type: 'gcj02',
    success(res) {
      getAddressFromLocation({
        location: {
          latitude: res.latitude,
          longitude: res.longitude,
        },
        success, complete
      })
    },
    fail(res) {
      if (res.errMsg == 'getLocation:fail auth deny' && wx.openSetting) {
        confirm({
          content: '若不授权地理位置权限, 则无法正常使用, 请重新授权地理位置权限',
          cancelText: '不授权',
          confirmText: '授权',
          ok() {
            wx.openSetting({
              success(res) {
                console.log(res)
                if (res.authSetting['scope.userLocation']) {
                  getCurrentAddressList(options)
                } else {
                  alert('获取用户地址失败')
                }
              }
            })
          }
        })
      } else {
        alert('获取用户地址失败')
      }

    }
  })
}
// 根据坐标获取地址信息
export function getAddressFromLocation(options) {
  const { location, success } = options
  getPois({
    location,
    success(pois) {
      var addressList = []
      pois.forEach(poi => {
        var {
          title, location,
          address, ad_info
        } = poi
        addressList.push(Object.assign({
          title, location, address
        }, resolveAdInfo(ad_info)))
      })
      success && success(addressList)
    }
  })
}
// 获取兴趣点
export function getPois(options) {
  const {
    location, success, complete
  } = options
  qqmap.reverseGeocoder({
    location,
    get_poi: 1,
    success: function (res) {
      success && success(res.result.pois)
    },
    fail: function (err) {
      console.log(err)
    },
    complete
  })
}
function resolveAdInfo(adInfo) {
  const { city, district, adcode } = adInfo
  return {
    city, district,
    district_id: adcode,
    city_id: adcode.replace(/\d{2}$/, '00')
  }
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 提示框
export function alert(content, callback) {
  wx.showModal({
    title: '提示',
    content: content,
    showCancel: false,
    success: callback
  })
}
// 确认框
export function confirm(options) {
  var {
    content, confirmText, cancelText,
    ok,
  } = options
  confirmText = confirmText || '确定'
  cancelText = cancelText || '取消'
  wx.showModal({
    content,
    confirmText,
    cancelText,
    confirmColor: '#ff004c',
    success(res) {
      if (res.confirm) {
        ok && ok()
      }
    }
  })
}
//请求
export function fetch(options) {
  wx.showLoading({
    title: '加载中',
  })
  let token = wx.getStorageSync('token');
  let uid = wx.getStorageSync('uid')
  wx.request({
    url: `${host}/${options.url}`,
    data: Object.assign(options.data, {

    }),
    method: options.method || 'GET',
    header: Object.assign( {
      'content-type': 'application/x-www-form-urlencoded',
      "Shop-Token":token,
      "Shop-UID":uid
    }, options.header),
    success: function (res) {
      wx.hideLoading()
      const data = res.data
      if (data.errorCode === 0) {
        options.success && options.success(data)

      } else if (data.errorCode === 1) {
        wx.login({
          success: (res) => {
            if (res.code) {
              wx.request({
                url: `${host}/wechat/wxlogin_jscode`,
                method: "POST",
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                  code: res.code
                },
                success:(response)=>{
                  wx.setStorageSync("openid", response.data.result.openid);
                  wx.setStorageSync("token", response.data.result.token);
                  wx.setStorageSync("uid", response.data.result.uid);
                  if (response.data.errorCode==2){
                    wx.navigateTo({
                      url: '/pages/login/index'
                    })
                  } else if (response.data.errorCode == 1 ){
                    wx.switchTab({
                      url: '/pages/account/index'
                    })
                  }
                },
                error: (res)=>{
                  console.debug(res)
                }
              })
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })
      } else {
        alert(data.errorMsg)
        options.error && options.error(data)
      }
      options.complete && options.complete()
    }
  })
}
export function get(url = "", data = null, callback = (json) => { }, reducersConnect = (json) => { }) {
  return wx.request({
    url: `${host}/${url}`,
    data: data,
    method: 'GET',
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      'Wesale-Token': 'iQcNCXIEd6NTyy0mRv25Up0I8T0NdTSMi6aiUVwXTmlnFt7h4p9VfTQ3TLaCbawdUoX3pc1gt:0_'
    },
    success: function (res) {
      console.dir(res)
      const data = res.data
      if (data.State == 'Success') {
        dispatch(reducersConnect(data.data));
        callback(data.data);
        return data.data
      } else {
        callback(data.data);
      }

    }
  })

}


