/**
 * 数据开发表单验证规则
 */
import { reactive } from 'vue'

// ---------------------------------- 流程中心 ------------------------------------------

export const newGraphRules = reactive({
  flowName: [{ required: true, message: '流程名称不能为空', trigger: 'change' }],
})

export const nodeInfoRules = reactive({
  name: [{ required: true, message: '节点名称不能为空', trigger: 'change' }],
  type: [{ required: true, message: '节点类型不能为空', trigger: 'change' }],
})
