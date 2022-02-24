<template>
  <div class="flow-center-wrapper">
    <div class="handle-wrap">
      <a-space>
        <a-button type="primary" @click="handleAdd">新增</a-button>
        <a-button danger @click="handleDelete" :disabled="selectedRowKeys.length <= 0">删除</a-button>
      </a-space>
      <a-space>
        <a-input-search v-model:value="searchParams.name" placeholder="图名称关键字" enter-button @search="onSearch" />
      </a-space>
    </div>
    <div class="table-wrap">
      <ym-table
        rowKey="id"
        :columns="graphDesignColumns"
        :getTableList="apiGetGraphList"
        :params="searchParams"
        ref="tableInstance"
      >
        <template #action="{ record }">
          <a-space>
            <a-button type="link" size="small" @click="handleRename(record)">重命名</a-button>
            <a-button type="link" size="small" :disabled="disableEdit(record.status)" @click="handleEdit(record)"
              >编辑</a-button
            >
          </a-space>
        </template>
      </ym-table>
    </div>
    <new-graph ref="newGraphInstance" :handleRefresh="onSearch" :getSourceData="getSourceData" />
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import NewGraph from '@/components/graphDesign/NewGraph.vue'
import { apiGetGraphList, apiDeleteGraphInfo } from '@/service/api/graphDesign'
import { graphDesignColumns } from '@/enums/tableHeadEnum'
import { actionTypeEnum } from '@/enums/commonEnum'
import { message } from 'ant-design-vue'
import { useRouter } from 'vue-router'
import { YmModal } from '@/utils/antd'

/**
 ********************************* 表格操作 ******************************************
 */

// 表格实例
const tableInstance = ref()

// 搜索参数
const searchParams = reactive({ name: '' })

const selectedRowKeys = computed(() => (tableInstance.value ? tableInstance.value.selectedRowKeys : []))

/**
 * @desc 列表搜索
 */
const onSearch = () => {
  tableInstance.value.handleRefresh()
}

/**
 * @desc 重新获取当前页列表
 */
const getSourceData = () => {
  tableInstance.value.getSourceData()
}

/**
 * @desc 列表删除
 */
const handleDelete = () => {
  YmModal.delete(async () => {
    const { code } = await apiDeleteGraphInfo(selectedRowKeys.value)
    if (code === 20000) {
      message.success('删除成功')
      tableInstance.value.getSourceData()
    }
  })
}

/**
 * @desc 禁用编辑
 */
const disableEdit = (status: string): boolean => {
  return status === '1'
}

/**
 ********************************* 详情操作 ******************************************
 */

/**
 * @desc 详情对话框实例
 */
const newGraphInstance = ref()

const router = useRouter()

/**
 * @desc 添加流程名称
 */
const handleAdd = () => {
  newGraphInstance.value.initModal(actionTypeEnum.ADD)
}

/**
 * @desc 重命名
 */
const handleRename = (record: any) => {
  const { id, name } = record
  newGraphInstance.value.initModal(actionTypeEnum.EDIT, { id, name })
}

/**
 * @desc 编辑流程详情
 */
const handleEdit = (record: any) => {
  router.push({
    name: 'GraphDesign',
    query: {
      id: record.id,
      name: record.name,
    },
  })
}
</script>

<style lang="less" scoped>
.flow-center-wrapper {
  height: 100%;
  .handle-wrap {
    display: flex;
    justify-content: space-between;
  }
}
</style>
