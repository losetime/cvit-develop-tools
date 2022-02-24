<template>
  <a-popover title="主机信息" trigger="click" v-if="type === 'monitored'" :getPopupContainer="getPopupContainer">
    <template #content>
      <div class="content-wrap">
        <div class="item-wrap">
          <div class="title">部署系统</div>
          <div class="content">系统1,系统2,系统3</div>
        </div>
        <div class="item-wrap">
          <div class="title">主机信息</div>
          <div class="content">
            <p>CPU核数：8核</p>
            <p>CPU使用率：8核</p>
            <p>内存：8核</p>
            <p>内存使用率：8核</p>
            <p>磁盘：8核</p>
            <p>已用磁盘：8核</p>
            <p>上行速率：8核</p>
            <p>下行速率：8核</p>
          </div>
        </div>
      </div>
    </template>
    <div :class="{ 'algo-node-wrap': true, 'active-node': type === 'monitored' }" @click="getHostInfo">
      <Iconfont :type="icon" class="iconfont" />
      <span class="title">{{ title }}</span>
    </div>
  </a-popover>
  <div :class="{ 'algo-node-wrap': true, 'active-node': type === 'monitored' }" v-else>
    <Iconfont :type="icon" class="iconfont" />
    <span class="title">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue'
import Iconfont from '../common/Iconfont.vue'

const getNode: Function = inject('getNode') as Function

// 节点名称
const title = ref('新建节点')

// 节点标志
const icon = ref('icon-zhanweifu')

const type = ref('')

onMounted(() => {
  onNodeInit()
})

/**
 * @desc 节点初始化
 */
const onNodeInit = () => {
  const node = getNode()
  const data = node.getData()
  title.value = data.name
  icon.value = data.icon && data.icon.split('-')[0] === 'icon' ? data.icon : 'icon-zhanweifu'
  type.value = data.type
  // 监听数据改变事件
  node.on('change:data', ({ current }: { current: any }) => {
    title.value = current.name
  })
}

/**
 * @desc 获取主机详情
 */
const getHostInfo = async () => {}

/**
 * @desc 菜单渲染父节点
 */
const getPopupContainer = (triggerNode: any) => triggerNode.parentNode
</script>

<style lang="less">
.algo-node-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 2px;
  .iconfont {
    font-size: 35px;
  }
  .title {
    display: inline-block;
    flex-shrink: 0;
    width: 100%;
    text-align: center;
    margin-left: 8px;
    color: #666;
    font-size: 12px;
  }
  .loading {
    margin-right: 5px;
  }
  .node-log {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
}
.active-node {
  cursor: pointer;
}
.content-wrap {
  .item-wrap {
    .title {
      font-weight: bold;
    }
    .content {
      p {
        margin: 2px 0;
      }
    }
  }
  .item-wrap:first-child {
    margin-bottom: 14px;
  }
}
</style>
