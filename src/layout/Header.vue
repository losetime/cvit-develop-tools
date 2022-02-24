<template>
  <div class="header-wrapper">
    <div class="header-left-wrap">
      <div class="logo-wrap">
        <img src="../assets/images/common/logo.png" alt="logo" />
        <span>CVIT开发管理系统</span>
      </div>
      <a-menu mode="horizontal" :selectedKeys="currentNavKey" @select="handleSelectKeys">
        <template v-for="item in headerMenu">
          <a-menu-item :key="item.name" v-if="item.meta.visible">{{ item.meta.title }}</a-menu-item>
        </template>
      </a-menu>
    </div>
    <div class="header-right-wrap">
      <div class="screen-wrap">
        <Iconfont
          type="icon-tuichuquanping"
          class="quit-full-screen-icon"
          @click="toggleFullscreen"
          v-if="isFullscreen"
        />
        <Iconfont type="icon-quanping" class="full-screen-icon" @click="toggleFullscreen" v-else />
      </div>
      <a-dropdown placement="bottomRight" :trigger="['click']">
        <a-avatar class="avatar-wrap">
          <template #icon>
            <Iconfont type="icon-nan_7" />
          </template>
        </a-avatar>
        <template #overlay>
          <a-menu>
            <a-menu-item key="0" @click="handleSetting">系统设置</a-menu-item>
            <a-menu-item key="1" @click="onLogout">退出登录</a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, createVNode } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Iconfont from '@/components/common/Iconfont.vue'
import screenfull from 'screenfull'
import store from '@/store'
import { apiSignOut } from '@/service/api/login'
import { Modal } from 'ant-design-vue'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()

// 所有导航菜单
const headerMenu = computed<Array<any>>(() => router.getRoutes().filter((val) => val.meta.level === 1))

// 匹配当前一级导航
const currentNavKey = computed(() => [route.matched[0].name])

const isFullscreen = ref(false)

/**
 * @desc 选择菜单
 */
const handleSelectKeys = ({ selectedKeys }: { selectedKeys: Array<string> }) => {
  router.push({ name: selectedKeys[0] })
}

/**
 * @desc 全屏切换
 */
const toggleFullscreen = () => {
  if (screenfull.isEnabled) {
    screenfull.toggle()
    isFullscreen.value = !screenfull.isFullscreen
  }
}

/**
 * @desc 系统设置
 */
const handleSetting = () => {
  router.push({
    name: 'Setting',
  })
}

/**
 * @desc 退出登录
 */
const onLogout = () => {
  Modal.confirm({
    title: '操作提示',
    content: '是否要退出登录？',
    icon: createVNode(ExclamationCircleOutlined),
    async onOk() {
      const { code } = await apiSignOut()
      if (code === 20000) {
        localStorage.removeItem('ymToken')
        store.commit('SET_TOKEN', '')
        router.replace({ path: '/login' })
      }
    },
  })
}
</script>

<style lang="less" scoped>
.header-wrapper {
  display: flex;
  justify-content: space-between;
  background-color: #015c61;
  .header-left-wrap {
    height: 64px;
    display: flex;
    .logo-wrap {
      width: 200px;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 35px;
        height: 35px;
      }
      span {
        font-size: 16px;
        color: #ffffff;
        margin-left: 10px;
      }
    }
    ::v-deep(.ant-menu) {
      flex: 1;
      background-color: #015c61;
      border-bottom: 1px solid #015c61;
      .ant-menu-item {
        display: flex;
        align-items: center;
        color: #b2cecf;
        &:hover {
          color: #ffffff;
          border-bottom: 1px solid #ffffff;
        }
      }
      .ant-menu-item-selected {
        color: #ffffff;
        border-bottom: 1px solid #ffffff;
      }
    }
  }
  .header-right-wrap {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 150px;
    .screen-wrap {
      .full-screen-icon,
      .quit-full-screen-icon {
        font-size: 25px;
        color: #ffffff;
        cursor: pointer;
      }
    }
    .avatar-wrap {
      margin: 0 20px;
      cursor: pointer;
      font-size: 22px;
    }
  }
}
</style>
