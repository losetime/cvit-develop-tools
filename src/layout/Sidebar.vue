<template>
  <a-layout-sider
    width="200"
    v-model:collapsed="sidebarStatus"
    :trigger="null"
    collapsible
    class="layout-sider-wrapper"
  >
    <a-menu mode="inline" :selectedKeys="navKey" @select="handleSelectKeys">
      <a-menu-item :key="item.name" v-for="item in sidebarMenu">
        <template #icon>
          <Iconfont :type="item.meta.icon" class="icon-font" />
        </template>
        <span>{{ item.meta.title }}</span>
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from '@/store'
import Iconfont from '@/components/common/Iconfont.vue'

const route = useRoute()
const router = useRouter()
const store = useStore()

// 所有二级导航菜单
const sidebarMenu = computed<Array<any>>(() => route.matched[0].children)

// 匹配当前二级导航
const navKey = computed(() => [route.matched[1].name])

// 侧边栏打开/收起
const sidebarStatus = computed(() => store.state.sidebarStatus)

/**
 * @desc 选择菜单
 */
const handleSelectKeys = ({ selectedKeys }: { selectedKeys: Array<string> }) => {
  router.replace({ name: selectedKeys[0] })
}
</script>

<style lang="less" scoped>
.layout-sider-wrapper {
  height: calc(100vh - 64px);
  overflow: auto;
  background: #fff;
  .anticon {
    font-size: 20px;
  }
}
</style>
