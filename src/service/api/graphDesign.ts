import { $http } from '../http/index'

import { IUpdateGraphName, IGetGraphList, IUpdateGraphNode } from '../types/graphDesign'

enum Api {
  getGraphList = 'http://192.168.35.211:19900/monitor/topologygraph/queryPage',
  addGraphName = 'http://192.168.35.211:19900/monitor/topologygraph/add',
  updateGraphName = 'http://192.168.35.211:19900/monitor/topologygraph/rename',
  deleteGraphInfo = 'http://192.168.35.211:19900/monitor/topologygraph/batchDeleteGraph',
  updateGraphNode = 'http://192.168.35.211:19900/monitor/topologygraph/saveNode',
  updateGraph = 'http://192.168.35.211:19900/monitor/topologygraph/updateGraph',
  getGraphInfo = 'http://192.168.35.211:19900/monitor/topologygraph/getGraphDetail',
  deleteGraphNode = 'http://192.168.35.211:19900/monitor/topologygraph/deleteNode',
}

/**
 * @desc 分页查询图列表
 */
export function apiGetGraphList(params: IGetGraphList): Promise<any> {
  return $http.request({
    url: Api.getGraphList,
    method: 'GET',
    params,
  })
}

/**
 * @desc 新增拓扑图
 */
export function apiAddGraphName(params: { name: string }): Promise<any> {
  return $http.request({
    url: Api.addGraphName,
    method: 'POST',
    params,
  })
}

/**
 * @desc 更新拓扑图名称
 */
export function apiUpdateGraphName(params: IUpdateGraphName): Promise<any> {
  return $http.request({
    url: Api.updateGraphName,
    method: 'POST',
    params,
  })
}

/**
 * @desc 删除拓扑图
 */
export function apiDeleteGraphInfo(params: number[]): Promise<any> {
  return $http.request({
    url: Api.deleteGraphInfo,
    method: 'POST',
    params,
  })
}

/**
 * @desc 更新节点
 */
export function apiUpdateGraphNode(params: IUpdateGraphNode): Promise<any> {
  return $http.request({
    url: Api.updateGraphNode,
    method: 'POST',
    params,
  })
}

/**
 * @desc 更新整个拓扑图
 */
export function apiUpdateGraph(params: any): Promise<any> {
  return $http.request({
    url: Api.updateGraph,
    method: 'POST',
    params,
  })
}

/**
 * @desc 获取拓扑图详情
 */
export function apiGetGraphInfo(params: { id: number }): Promise<any> {
  return $http.request({
    url: Api.getGraphInfo + '/' + params.id,
    method: 'GET',
    params,
  })
}

/**
 * @desc 删除图节点
 */
export function apiDeleteGraphNode(params: { id: number }): Promise<any> {
  return $http.request({
    url: Api.deleteGraphNode + '/' + params.id,
    method: 'POST',
    params,
  })
}
