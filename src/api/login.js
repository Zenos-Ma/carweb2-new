import request from "@/utils/request.js";

import api from "@/utils/api.js";

//登入
export function Login(data) {
  return request({
    url: api.loginCheck,
    method: "post",
    data: data,
  });
}

// 获取当前用户的信心
export function getUserInfo(data) {
  return request({
    url: api.main1,
    method: "get",
  });
}

// 判定是否登录了
export function checkLogin() {
  return request({
    url: api.isLogin,
    method: "get",
  });
}

// 登出
export function Logout() {
  return request({
    url: api.logout,
    method: "get",
  });
}

// 修改用户的密码
export function changeUserPwd(data) {
  return request({
    url: api.changePwd,
    method: "post",
    data: data,
  });
}

// 修改设备的密码
export function changeDevPwd(data) {
  return request({
    url: api.changePwdDev,
    method: "post",
    data: data,
  });
}

// 判断是否是邓总
export function superParentUserInfo(data) {
  return request({
    url: api.superParentUser,
    method: 'post',
    data: data
  })
}