<template>
  <icon-font :type="type" />
</template>

<script setup lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue'

const iconUrl = new URL('../../assets/iconfont/iconfont.js', import.meta.url).href

const IconFont = createFromIconfontCN({
  scriptUrl: iconUrl,
})

defineProps<{
  type: string
}>()
</script>
