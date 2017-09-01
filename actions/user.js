import { fetch } from '../utils/util'
//获取授权 code
export function getOpenid(option) {
  fetch({
    url: 'wechat/wxlogin_jscode',
    method: "POST",
    data: option.data,
    success: option.success,
    error: option.error
  })

}

//获取用户信息
export function getUserInfo(option) {
  fetch({
    url: 'wechat/decodeUserInfo',
    method: "POST",
    data: option.data,
    success: option.success,
    error: option.error
  })

}

//获取手机验证码
// export function getCode(){
//   fetch({
//     url: 'wechat/decodeUserInfo',
//     method: "POST",
//     data: option.data,
//     success: option.success,
//     error: option.error
//   })

// }

//用户注册
export function register(option){
  fetch({
    url: 'wechat/wechatRegister',
    method: "POST",
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//获取用户信息
export function getUser(option) {
  fetch({
    url: 'api/user/get',
    data: option.data,
    success: option.success,
    error: option.error
  })
}
//退出登陆
export function longinOut(option){
  fetch({
    url: 'api/user/removeXcxUser',
    data: option.data,
    success: option.success,
    error: option.error
  })
}

//发送验证码
export function sendCode(option){
  fetch({
    url: 'sms/registerCode',
    data: option.data,
    method: "POST",
    success: option.success,
    error: option.error
  })
}

//编辑用户信息
export function eidtUser(option) {
  fetch({
    url: 'api/user/updateUser',
    data: option.data,
    method: "POST",
    success: option.success,
    error: option.error
  })
}