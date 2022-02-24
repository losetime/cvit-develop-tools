<template>
  <a-modal
    v-model:visible="visible"
    :title="title"
    :destroyOnClose="true"
    :afterClose="handleCancel"
    :footer="null"
    width="800px"
  >
    <div class="logs-info-wrapper">
      <div class="logs-info">{{ logInfo }}</div>
      <div class="handle-wrap" v-show="!isEnd">
        <a-button @click="getLogsInfo">更多</a-button>
      </div>
      <div class="loading-wrap" v-if="loading">
        <a-spin tip="加载中..." size="large" />
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

const props = defineProps<{
  getLogsInfo?: Function
}>()

const visible = ref<boolean>(false)

const title = ref<string>('查看日志')

const reqParams = reactive<any>({ fromLineNum: 1 })

const logInfo = ref('')

const isEnd = ref(false)

const loading = ref(true)

/**
 * @desc 初始化对话框
 * @param initInfo 请求参数/log内容
 * @param isSubstep 日志是否时分步获取的，如果是false,则initInfo可以直接传日志内容
 */

interface initInfo {
  execId: string
  execDate: string
  jobId: string
}

const initModal = (initInfo: string | initInfo, isSubstep = true) => {
  if (isSubstep) {
    Object.assign(reqParams, initInfo)
    getLogsInfo()
  } else {
    logInfo.value = initInfo as string
    isEnd.value = true
    loading.value = false
  }
  visible.value = true
}

/**
 * @desc 获取日志
 */
const getLogsInfo = async () => {
  if (props.getLogsInfo) {
    loading.value = true
    const { toLineNum, logContent, end, lineCount } = await props.getLogsInfo(reqParams)
    Object.assign(reqParams, { fromLineNum: lineCount > 0 ? toLineNum + 1 : toLineNum })
    logInfo.value += logContent
    isEnd.value = end
    loading.value = false
  }
}

/**
 * @desc 关闭
 */
const handleCancel = () => {
  reqParams.fromLineNum = 1
  logInfo.value = ''
}

defineExpose({
  initModal,
})
</script>

<style lang="less" scoped>
.logs-info-wrapper {
  position: relative;
  .logs-info {
    width: 100%;
    height: 500px;
    white-space: pre-wrap;
    overflow: auto;
  }
  .handle-wrap {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  .loading-wrap {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
