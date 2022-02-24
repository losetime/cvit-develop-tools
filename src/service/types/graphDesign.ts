import { IPaging } from './common'

/**
 * @desc 更新拓扑图名称
 */
export interface IUpdateGraphName {
  id: number
  name: string
}

/**
 * @desc 获取图列表
 */
export interface IGetGraphList extends IPaging {
  name: string
}

/**
 * @desc 更新节点
 */
export interface IUpdateGraphNode {
  name: string
  type: string
  icon: string
  description: string
  extension: string
  graphId: number
  nodeKey: string
  id?: number
  properties?: string
}
