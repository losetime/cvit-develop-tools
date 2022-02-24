import { $http } from '../http'

const baseUrl = '//api.dev.jwschain.cn'

enum Api {
  uploadAuth = '/api/v1/oss/uploadOss',
  readOss = '/api.dev.jwschain.cn/api/v1/oss/readImage',
  getDicts = '/usermanager/system/dict/data/type',
}

/**
 * @description: 获取OSS上传权限
 * 这里分了三步,首先请求公司服务器，拿到oss的权限数据；
 * 然后请求阿里oss服务器，上传文件，提供拿到的相关权限数据；
 * 最后把oss返回的数据再次提交给公司服务器做保存
 */
export function getUploadAuth(params: object) {
  return $http.request(
    {
      url: Api.uploadAuth,
      method: 'POST',
      params: params,
    },
    {
      apiUrl: baseUrl,
    },
  )
}

/**
 * @description: 上传文件到OSS服务器
 * oss上传需要的参数，参考以下文档
 * https://help.aliyun.com/document_detail/31925.html?spm=a2c4g.11186623.2.8.123e4367hMqpVu#concept-frd-4gy-5db
 * https://help.aliyun.com/document_detail/31988.html?spm=a2c4g.11186623.2.15.22dc49e8yGtKDc#reference-smp-nsw-wdb
 */
export function uploadAppPackage(params: Object, uploadOss: string) {
  return $http.uploadFiles(
    {
      url: '',
      method: 'POST',
    },
    params,
    {
      apiUrl: uploadOss,
    },
  )
}

/**
 * @description: 获取后端字典
 */
export function apiGetDicts(params: { typeKey: string }) {
  return $http.request({
    url: Api.getDicts + `/${params.typeKey}`,
    method: 'GET',
  })
}
