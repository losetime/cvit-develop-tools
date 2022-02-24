<template>
  <div class="breadcrumb-wrap">
    <menu-unfold-outlined class="icon" @click="triggerSidebar" v-if="sidebarStatus" />
    <menu-fold-outlined class="icon" @click="triggerSidebar" v-else />
    <a-breadcrumb>
      <a-breadcrumb-item v-for="item in routes" :key="item.name">
        <span v-if="item.meta.level === 1">{{ item.meta.title }}</span>
        <router-link :to="{ name: item.name }" v-else>{{ item.meta.title }}</router-link>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons-vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'

const route = useRoute()

const routes = computed(() => route.matched)

const store = useStore()

const sidebarStatus = computed(() => store.state.sidebarStatus)

/**
 * @desc 打开/收起侧边栏
 */
const triggerSidebar = () => {
  if (sidebarStatus.value) {
    store.commit('SET_SIDEBAR_STATUS', false)
  } else {
    store.commit('SET_SIDEBAR_STATUS', true)
  }
}
</script>

<style lang="less" scoped>
.breadcrumb-wrap {
  display: flex;
  align-items: center;
  padding: 14px 0 14px 28px;
  .icon {
    font-size: 18px;
    margin-right: 14px;
    cursor: pointer;
    &:hover {
      color: #015c61;
    }
  }
}
</style>
