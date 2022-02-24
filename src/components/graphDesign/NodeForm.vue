<template>
  <div class="node-form-wrapper">
    <div class="action-wrap">
      <a-space>
        <a-button type="primary" @click="handleSaveNode">保存</a-button>
        <a-button @click="handleCancel">取消</a-button>
      </a-space>
      <a-space>
        <a-button danger @click="handleDelNode">删除节点</a-button>
      </a-space>
    </div>
    <a-form :model="formInfo" layout="vertical">
      <a-form-item label="节点名称" v-bind="validateInfos.name">
        <a-input v-model:value="formInfo.name" />
      </a-form-item>
      <a-form-item label="节点类型" v-bind="validateInfos.type">
        <a-input v-model:value="formInfo.type" />
      </a-form-item>
      <a-form-item label="节点图标" v-bind="validateInfos.icon">
        <a-input v-model:value="formInfo.icon" />
      </a-form-item>
      <a-form-item label="节点描述" v-bind="validateInfos.description">
        <a-textarea v-model:value="formInfo.description" placeholder="请输入节点描述" :rows="4" />
      </a-form-item>
      <a-form-item label="数据扩展" v-bind="validateInfos.properties">
        <a-textarea
          v-model:value="formInfo.properties"
          placeholder="请输入扩展数据,对象键值对格式,以','分隔"
          :rows="4"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, createVNode } from 'vue'
import { apiUpdateGraphNode, apiDeleteGraphNode } from '@/service/api/graphDesign'
import { nodeInfoRules } from '@/validator/graphDesign'
import { Form, message, Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { debounce, trim } from 'lodash-es'
import type { Cell } from '@antv/x6'

const props = defineProps<{
  graph: any
  activeNodeId: string
  flowId: number
  handleClose: Function
}>()

interface iFromInfo {
  name: string
  type: string
  icon: string
  description: string
  properties: string
}

const formInfo = ref<iFromInfo>({
  name: '',
  type: '',
  icon: '',
  description: '',
  properties: '',
})

const useForm = Form.useForm

const { validate, validateInfos } = useForm(formInfo, nodeInfoRules)

watch(
  () => props.activeNodeId,
  async () => {
    if (props.activeNodeId) {
      setFormDefaultVal()
    }
  },
)

watch(
  () => formInfo.value,
  () => {
    debounleSetCellData()
  },
  {
    deep: true,
  },
)

onMounted(async () => {
  await setFormDefaultVal()
})

/**
 * @desc 设置节点内容防抖函数
 */
const debounleSetCellData = debounce(function () {
  const cell = getCell()
  // 设置画布信息
  cell.setData({
    ...formInfo.value,
    nodeId: props.activeNodeId,
  })
}, 500)

/**
 * @desc 获取当前节点
 */
const getCell = () => {
  return props.graph.getCellById(props.activeNodeId)
}

/**
 * @desc 设置表单初始化信息
 */
const setFormDefaultVal = () => {
  console.log(getCell().getData())
  const { name, type, icon, description, properties } = getCell().getData()
  formInfo.value = { name, type, icon, description, properties }
}

/**
 * @desc 保存节点
 */
const handleSaveNode = () => {
  validate().then(async () => {
    const cell = getCell()
    const { name, type, icon, description, properties } = formInfo.value
    // 去除参数的空格和回车
    let formattProperties = formInfo.value.properties
    formattProperties = trim(properties).replace(/[\r\n]/g, '')
    let params: any = {
      name,
      type,
      icon,
      description,
      properties: formattProperties,
      extension: JSON.stringify(cell),
      nodeKey: props.activeNodeId,
      graphId: props.flowId,
    }
    const { id } = cell.getData()
    if (id) {
      params = { ...params, id }
    }
    const { code, data } = await apiUpdateGraphNode(params)
    if (code === 20000) {
      message.success('节点保存成功')
      // 设置当前节点的数据库id
      const nodeData = cell.getData()
      cell.setData({
        ...nodeData,
        id: data.id,
      })
    }
  })
}

/**
 * @desc 删除节点
 */
const handleDelNode = async () => {
  Modal.confirm({
    title: '确定要删除该节点吗?',
    icon: createVNode(ExclamationCircleOutlined),
    async onOk() {
      const cell = getCell()
      const nodeData = cell.getData()
      if (nodeData.id) {
        const { code } = await apiDeleteGraphNode({ id: nodeData.id })
        if (code === 20000) {
          delGraphNode(cell)
        }
      } else {
        delGraphNode(cell)
      }
    },
  })
}

/**
 * @desc 删除画布节点元素
 */
const delGraphNode = (cell: Cell) => {
  props.graph.removeConnectedEdges(cell)
  props.graph.removeNode(cell)
  message.success('节点删除成功')
  handleCancel()
}

/**
 * @desc 取消
 */
const handleCancel = () => {
  props.handleClose()
}
</script>

<style lang="less" scoped>
.node-form-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  height: calc(100vh - 64px);
  padding: 14px;
  background-color: #ffffff;
  .action-wrap {
    display: flex;
    justify-content: space-between;
    margin-bottom: 14px;
  }
}
</style>
