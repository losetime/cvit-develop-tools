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
      <a-form-item label="key">
        <a-input v-model:value="detailInfo.key" placeholder="请输入边key" />
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
  key: '',
})

const currentEdge = ref()

/**
 * @desc 初始化对话框
 */
const initModal = (edge: any) => {
  currentEdge.value = edge
  detailInfo.key = edge.data.key
  visible.value = true
}

/**
 * @desc 确认操作
 */
const handleConfirm = () => {
  const edgeData = currentEdge.value.getData()
  currentEdge.value.setData({ ...edgeData, key: detailInfo.key })
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
