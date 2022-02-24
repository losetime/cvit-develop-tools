import { $http } from '../http/index'

import { SubmitLoginInterface } from '../types/login'

enum Api {
  getCodeImage = '/usermanager/captchaImage',
  submitLogin = '/usermanager/login',
  getUserInfo = '/usermanager/getInfo',
  getRoutersInfo = '/usermanager/getRouters',
  signOut = '/usermanager/logout',
}

/**
 * @desc: 获取token
 */
export function apiGetCodeImage(): Promise<any> {
  return $http.request({
    url: Api.getCodeImage,
    method: 'GET',
  })
}

/**
 * @desc: 登录
 */
export function apiSubmitLogin(params: SubmitLoginInterface): Promise<any> {
  return $http.request({
    url: Api.submitLogin,
    method: 'POST',
    params,
  })
}

/**
 * @desc: 获取用户信息
 */
export function apiGetUserInfo(): Promise<any> {
  return $http.request({
    url: Api.getUserInfo,
    method: 'GET',
  })
}

/**
 * @desc: 获取路由信息
 */
export function apiGetRoutersInfo(): Promise<any> {
  return $http.request({
    url: Api.getRoutersInfo,
    method: 'GET',
  })
}

/**
 * @desc: 退出
 */
export function apiSignOut(): Promise<any> {
  return $http.request({
    url: Api.signOut,
    method: 'POST',
  })
}
