<template>
  <div class="area-node-wrap">
    <span class="title">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue'

const getNode: Function = inject('getNode') as Function

// 节点名称
const title = ref('新建节点')

onMounted(() => {
  const node = getNode()
  const data = node.getData()
  title.value = data.name
  // 监听数据改变事件
  node.on('change:data', ({ current }: { current: any }) => {
    title.value = current.name
  })
})
</script>

<style lang="less">
.area-node-wrap {
  width: 100%;
  height: 100%;
  border-radius: 2px;
  border: 1px solid #c1c1c1;
  .title {
    display: inline-block;
    flex-shrink: 0;
    width: 100%;
    margin-left: 8px;
    color: #666;
    font-size: 12px;
  }
}
</style>
