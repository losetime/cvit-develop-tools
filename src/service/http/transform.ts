import type { AxiosResponse } from 'axios'
import axios from 'axios'
import type { RequestOptions } from './types'
import { getToken } from '@/utils/auth'
import { AxiosTransform } from './abstracts'
import { handleNetworkStatus, handleBusinessStatus } from './handleStatus'
import { RequestEnum, ResultEnum } from '@/enums/httpEnum'
import { Prefix } from '@/enums/envEnum'
import { isString } from 'lodash-es'
import { errorResult } from './const'
import { message as messageTip } from 'ant-design-vue'
import { downloadFiles } from '@/utils'

/**
 * @description: 数据处理，方便区分多种处理方式
 */
export const transform: AxiosTransform = {
  /**
   * @description: 请求拦截处理
   */
  requestInterceptors: (config) => {
    // 请求之前处理config
    const token = getToken()
    if (token) {
      // jwt token
      config.headers.common['Authorization'] = `Bearer ${token}`
    }
    return config
  },

  /**
   * @description: 请求之前处理config
   */
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix } = options
    // 拼接接口中间变量
    if (joinPrefix) {
      config.url = `${Prefix}${config.url}`
    }
    // 重新设置请求基础接口
    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`
    }
    // 判断请求类型
    if (config.method === RequestEnum.GET) {
      // const now = new Date().getTime()
      if (!isString(config.params)) {
        config.data = {
          // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
          params: config.params || {},
          // params: Object.assign(config.params || {}, {
          //     _t: now
          // })
        }
      } else {
        // 兼容restful风格
        // + `?_t=${now}`
        config.url = config.url + config.params
        config.params = {}
      }
    } else {
      // 说明是上传
      if (config.data) {
        return config
      }
      // 普通post请求
      else {
        config.data = config.params
        config.params = {}
      }
    }
    return config
  },

  /**
   * @description: 响应拦截处理
   */
  responseInterceptors: (res): AxiosResponse<any> | any => {
    const { code, msg } = res.data
    if (code === ResultEnum.SUCCESS) {
      return Promise.resolve(res)
    } else if (res.config.responseType === 'blob') {
      return Promise.resolve(res)
    } else {
      handleBusinessStatus(code, msg)
      return Promise.resolve(res)
    }
  },

  /**
   * @description: 处理响应成功的数据
   */
  transformRequestData: (res: any, options: RequestOptions) => {
    const { isTransformRequestResult } = options
    // 请求错误
    if (res === errorResult) {
      return res
    } else {
      if (isTransformRequestResult) {
        return res.data.data
      }
      // 下载文件，直接返回所有信息
      else if (res.config.responseType === 'blob') {
        downloadFiles(res)
        return Promise.resolve(res)
      }
      // 过滤第一层，返回{code,data,message}
      else {
        return res.data
      }
    }
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const { response, code, message } = error || {}
    // 是否是被取消的请求
    if (axios.isCancel(error)) {
      console.warn('请求被取消：', error)
      return Promise.resolve(errorResult)
    }
    const msg: string = response && response.data && response.data.error ? response.data.error.message : ''
    const err: string = error.toString()
    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        messageTip.error('接口请求超时,请刷新页面重试!')
        return Promise.resolve(errorResult)
      }
      if (err && err.includes('Network Error')) {
        messageTip.error('网络异常，请稍后重试')
        return Promise.resolve(errorResult)
      }
    } catch (error: any) {
      throw new Error(error)
    }
    handleNetworkStatus(error.response && error.response.status, msg)
    return Promise.resolve(errorResult)
  },
}
