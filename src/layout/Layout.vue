<template>
  <div class="app-wrapper">
    <router-view />
    <div class="container-wrap">
      <router-view name="sidebar" />
      <div class="main-wrapper">
        <router-view name="breadcrumb" />
        <router-view name="main" class="main-wrap" v-if="currentLevel === 2" />
        <router-view name="main" class="main-wrap" v-if="currentLevel === 3">
          <router-view name="mainSub" class="main-sub-wrap" />
        </router-view>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentLevel = computed(() => route.meta.level)
</script>
<style lang="less">
.app-wrapper {
  background-color: #f0f2f5;
  .container-wrap {
    display: flex;
    .main-wrapper {
      width: 100%;
      height: calc(100vh - 92px);
      .main-wrap {
        height: calc(100vh - 128px);
        width: calc(100vw - 200px);
        padding: 0 14px;
        box-sizing: border-box;
        overflow: auto;
        .handle-wrap {
          background-color: #ffffff;
          padding: 14px;
        }
        .table-wrap {
          background-color: #ffffff;
          padding: 14px 14px 0 14px;
          margin-top: 14px;
          height: calc(100% - 74px);
        }
      }
      .main-sub-wrap {
        height: calc(100vh - 128px);
        margin: 0 14px;
        overflow: auto;
      }
    }
  }
}
</style>
