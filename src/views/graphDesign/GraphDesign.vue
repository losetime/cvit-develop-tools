<template>
  <div class="flow-design-wrapper">
    <div class="header-wrap">
      <div class="title">拓扑图设计器</div>
      <a-space>
        <a-button type="primary" @click="goBack">返回</a-button>
        <a-button type="primary" @click="handleSaveGraph">保存</a-button>
      </a-space>
    </div>
    <div class="main-wrap">
      <div class="sidebar-wrap">
        <div class="group-item-wrap">
          <div class="title">通用</div>
          <div class="unit-wrap">
            <div class="unit-item-wrap" @mousedown="createUnit">
              <img src="../../assets/images/graphDesign/model.png" />
              <span>模型</span>
            </div>
          </div>
          <div class="unit-wrap">
            <div class="unit-item-wrap" @mousedown="createArea">
              <img src="../../assets/images/graphDesign/model.png" />
              <span>区域</span>
            </div>
          </div>
        </div>
      </div>
      <div class="flow-wrap">
        <div id="graph-wrap"></div>
        <node-form
          :graph="graph"
          :activeNodeId="activeNodeId"
          :flowId="flowId"
          :handleClose="handleClose"
          :handleLogTrigger="handleLogTrigger"
          v-if="activeNodeId"
        />
      </div>
    </div>
    <edge-info :graph="graph" ref="edgeInfoInstance" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, createVNode } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useGraph from '@/hooks/useGraph'
import NodeForm from '@/components/graphDesign/NodeForm.vue'
import EdgeInfo from '@/components/graphDesign/EdgeInfo.vue'
import { apiGetGraphInfo, apiUpdateGraph } from '@/service/api/graphDesign'
import { message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

const flowId = computed(() => parseInt(route.query.id as string))

const { initGraph, initAddon, graph, dnd } = useGraph()

const edgeInfoInstance = ref()

onMounted(() => {
  initGraph('graph-wrap')
  initAddon()
  registerGraphListener()
  getFlowInfo()
})

/**
 * @desc 获取流程详情数据
 */
const getFlowInfo = async () => {
  const { code, data } = await apiGetGraphInfo({ id: flowId.value })
  if (code === 20000) {
    const nodes = data.nodes.map((val: any) => {
      const node = val.extension ? JSON.parse(val.extension) : {}
      node.data = {
        ...node.data,
        id: val.id,
      }
      return node
    })
    const renderNodes = nodes.map((item: any) => {
      if (item.data.type === 'area') {
        return graph.value.createNode({ ...item, shape: 'flow-area' })
      } else {
        return graph.value.createNode({ ...item, shape: 'flow-node' })
      }
    })
    const renderEdges = data.edges
      ? data.edges.map((item: any) => graph.value.createEdge({ ...item, shape: 'flow-edge' }))
      : []
    const cells = [...renderNodes, ...renderEdges]
    graph.value.resetCells(cells)
  }
}

/**
 ********************************* header相关逻辑 ******************************************
 */

/**
 * @desc 格式化保存/执行流程参数
 */
const formattParams = () => {
  let validateNode = true
  const nodes = graph.value.getNodes().map((item: any) => {
    const { name, type, icon, description, properties, id } = item.data
    if (!name || !type) {
      validateNode = false
    }
    return {
      graphId: flowId.value,
      nodeKey: item.id,
      id: id,
      name,
      type,
      icon,
      description,
      properties,
      extension: JSON.stringify(item),
    }
  })
  const edges = graph.value.getEdges().map((item: any) => {
    return {
      source: item.source,
      target: item.target,
      id: item.data?.id,
    }
  })
  const params = {
    id: flowId.value,
    name: route.query.name as string,
    edges,
    nodes,
  }
  return validateNode ? params : null
}

/**
 * @desc 保存整体流程
 */
const handleSaveGraph = async () => {
  const params = formattParams()
  if (!params) {
    message.warning('请完善节点信息')
    return
  }
  const { code } = await apiUpdateGraph(params)
  if (code === 20000) {
    message.success('流程保存成功')
    // getFlowInfo()
  }
}

/**
 * @desc 返回列表
 */
const goBack = () => {
  router.replace({ name: 'GraphList' })
}

/**
 ********************************* 组件相关逻辑 ******************************************
 */

const activeNodeId = ref('')

const showLog = ref(false)

/**
 * @desc 创建组件
 */
const createUnit = (e: Event) => {
  const node = graph.value.createNode({
    shape: 'flow-node',
    data: {
      nodeId: '',
      scriptId: [],
      params: '',
      name: '新建节点',
      description: '',
    },
  })
  dnd.value.start(node, e)
}

/**
 * @desc 创建区域
 */
const createArea = (e: Event) => {
  const node = graph.value.createNode({
    shape: 'flow-area',
    data: {
      nodeId: '',
      scriptId: [],
      params: '',
      name: '区域节点',
      description: '',
    },
  })
  dnd.value.start(node, e)
}

const timeout = ref()

/**
 * @desc 注册监听事件
 */
const registerGraphListener = () => {
  // 点击事件
  graph.value.on('node:click', ({ node, e }: { node: any; e: any }) => {
    activeNodeId.value = node.id
    if (e.target.id === 'node-log_exist') {
      handleLogTrigger(true)
    } else {
      handleLogTrigger(false)
    }
  })
  // 边单击事件
  graph.value.on('edge:click', ({ edge }: { edge: any }) => {
    clearTimeout(timeout.value)
    timeout.value = setTimeout(() => {
      edgeInfoInstance.value.initModal(edge)
    }, 250)
  })
  // 边双击事件
  graph.value.on('edge:dblclick', ({ edge }: { edge: any }) => {
    clearTimeout(timeout.value)
    Modal.confirm({
      title: '确定删除这条连接线吗?',
      icon: createVNode(ExclamationCircleOutlined),
      onOk() {
        graph.value.removeEdge(edge.id)
      },
    })
  })
  // 节点鼠标移入事件
  graph.value.on('node:mouseenter', () => {
    const container = document.getElementById('graph-wrap')!
    const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
    showPorts(ports, true)
  })
  // 节点鼠标移出事件
  graph.value.on('node:mouseleave', () => {
    const container = document.getElementById('graph-wrap')!
    const ports = container.querySelectorAll('.x6-port-body') as NodeListOf<SVGElement>
    showPorts(ports, false)
  })
}

// 控制连接桩显示/隐藏
const showPorts = (ports: NodeListOf<SVGElement>, show: boolean) => {
  for (let i = 0, len = ports.length; i < len; i = i + 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden'
  }
}

/**
 * @desc 关闭Form窗口
 */
const handleClose = () => {
  activeNodeId.value = ''
  graph.value.cleanSelection()
}

/**
 * @desc 打开/关闭日志
 */
const handleLogTrigger = (trigger: boolean) => {
  showLog.value = trigger
}
</script>

<style lang="less" scoped>
.flow-design-wrapper {
  .header-wrap {
    height: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #015c61;
    padding: 0 14px;
    .title {
      color: #ffffff;
    }
  }
  .main-wrap {
    display: flex;
    height: calc(100vh - 64px);
    .sidebar-wrap {
      width: 200px;
      height: 100%;
      border-right: 1px solid #f0f0f0;
      .group-item-wrap {
        .title {
          height: 54px;
          line-height: 54px;
          padding-left: 20px;
          margin-bottom: 14px;
          background: #f0f0f0;
        }
        .unit-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          .unit-item-wrap {
            width: 138px;
            height: 48px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 16px;
            border: 3px solid #f0f0f0;
            background-color: #f5f5f5;
            cursor: pointer;
            img {
              width: 20px;
              height: 20px;
              margin-top: 3px;
              margin-right: 6px;
            }
          }
        }
      }
    }
    .flow-wrap {
      flex: 1;
      display: flex;
      // border-right: 1px solid #f0f0f0;
      // border-bottom: 1px solid #f0f0f0;
      padding: 14px;
      position: relative;
      #graph-wrap {
        flex: 1;
        height: 100%;
        overflow: auto;
        border-bottom: 1px solid #f0f0f0;
        background-color: #f2f2f2;
      }
    }
  }
}
</style>
