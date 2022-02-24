<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :destroyOnClose="true"
    :afterClose="handleCancel"
    @ok="handleConfirm"
    width="600px"
  >
    <a-form :label-col="labelCol" labelAlign="left">
      <a-form-item label="ID">
        <a-input v-model:value="detailInfo.id" placeholder="请输入边ID" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const labelCol = { span: 2 }

const visible = ref<boolean>(false)

const title = ref<string>('扩展边属性')

const detailInfo = reactive<any>({
  id: '',
})

const currentEdge = ref()

/**
 * @desc 初始化对话框
 */
const initModal = (edge: any) => {
  currentEdge.value = edge
  visible.value = true
}

/**
 * @desc 确认操作
 */
const handleConfirm = () => {
  const degeData = currentEdge.value.getData()
  currentEdge.value.setData({ ...degeData, id: detailInfo.id })
  handleCancel()
}

/**
 * @desc 取消操作
 */
const handleCancel = () => {
  detailInfo.id = ''
  visible.value = false
}

defineExpose({
  initModal,
})
</script>
