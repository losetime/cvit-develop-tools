<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :destroyOnClose="true"
    :afterClose="handleCancel"
    :confirm-loading="confirmLoading"
    @ok="handleConfirm"
    width="600px"
  >
    <a-form labelAlign="left">
      <a-form-item v-bind="validateInfos.name">
        <a-input v-model:value="detailInfo.name" placeholder="请输入图名称" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { newGraphRules } from '@/validator/graphDesign'
import { actionTypeEnum } from '@/enums/commonEnum'
import { apiAddGraphName, apiUpdateGraphName } from '@/service/api/graphDesign'
import { Form, message } from 'ant-design-vue'

const props = defineProps<{
  handleRefresh: Function
  getSourceData: Function
}>()

const visible = ref<boolean>(false)

const title = ref<string>('新增拓扑图')

const detailInfo = reactive<any>({
  id: '',
  name: '',
})

const handleType = ref<number>(actionTypeEnum.ADD)

const useForm = Form.useForm

const { validate, validateInfos, resetFields } = useForm(detailInfo, newGraphRules)

/**
 * @desc 初始化对话框
 */
const initModal = (type: number, initInfo: any) => {
  handleType.value = type
  if (type !== actionTypeEnum.ADD) {
    title.value = '编辑拓扑图'
    Object.assign(detailInfo, initInfo)
  }
  visible.value = true
}

// 确认loading
const confirmLoading = ref(false)

/**
 * @desc 确认操作
 */
const handleConfirm = () => {
  validate()
    .then(async () => {
      confirmLoading.value = true
      const params = { ...detailInfo }
      if (handleType.value === actionTypeEnum.ADD) {
        const { code } = await apiAddGraphName(params)
        confirmLoading.value = false
        if (code === 20000) {
          props.handleRefresh()
          message.success('数据添加成功')
          handleCancel()
        }
      } else {
        const { code } = await apiUpdateGraphName(params)
        confirmLoading.value = false
        if (code === 20000) {
          props.getSourceData()
          message.success('数据更新成功')
          handleCancel()
        }
      }
    })
    .catch((e: any) => {
      console.log(e)
    })
}

/**
 * @desc 取消操作
 */
const handleCancel = () => {
  visible.value = false
  resetFields()
}

defineExpose({
  initModal,
})
</script>
