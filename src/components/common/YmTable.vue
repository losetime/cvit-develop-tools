<template>
  <div ref="ymTableInstance" class="ym-table-wrapper">
    <a-table
      :row-selection="rowSelection"
      :columns="columns"
      :data-source="tableData.result"
      :row-key="(record: any) => record[rowKey]"
      :loading="tableData.loading"
      :scroll="{ y: ymHeight }"
      :pagination="pagination"
      size="small"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.key === 'serialNumber'">
          <span>{{ index + 1 }}</span>
        </template>
        <template v-else-if="column.key === 'action'">
          <slot name="action" :index="index" :record="record"></slot>
        </template>
        <template v-else-if="column.key === 'slotOne'">
          <slot name="slotOne" :index="index" :record="record"></slot>
        </template>
        <template v-else-if="column.key === 'slotTwo'">
          <slot name="slotTwo" :index="index" :record="record"></slot>
        </template>
        <template v-else-if="column.key === 'slotThree'">
          <slot name="slotThree" :index="index" :record="record"></slot>
        </template>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, unref, onMounted } from 'vue'
import useTable from '@/hooks/useTable'

interface Props {
  rowKey: string
  columns: Array<any>
  pagination?: boolean
  rowSelection?: boolean
  params?: Object
  isImmediately?: boolean
  getTableList: Function
  getCheckboxProps?: Function // 设置禁用选择框条件
}

const props = withDefaults(defineProps<Props>(), {
  pagination: true,
  rowSelection: true,
  isImmediately: true,
})

const ymTableInstance = ref()

const ymHeight = ref('')

const selectedRowKeys = ref<number[]>([])

const selectedRows = ref<any[]>([])

const { tableData, reqParams, getSourceData, handleRefresh, onPagination, onChangeSize } = useTable(
  props.getTableList,
  props.params,
  props.isImmediately,
)

onMounted(() => {
  setDomClientView()
  window.addEventListener('resize', function () {
    const timeout = setTimeout(() => {
      setDomClientView()
      clearTimeout(timeout)
    }, 200)
  })
})

const setDomClientView = () => {
  if (!ymTableInstance.value) return
  const parentNode = ymTableInstance.value.parentNode
  const paddingTop = parseInt(getComputedStyle(parentNode)['paddingTop'].slice(0, -2))
  const paddingLeft = parseInt(getComputedStyle(parentNode)['paddingLeft'].slice(0, -2))
  const height = parentNode.clientHeight - paddingTop * 2 - 40
  if (pagination.value) {
    ymHeight.value = height - 56 + 'px'
  } else {
    ymHeight.value = height + 'px'
  }
  ymTableInstance.value.style.width = parentNode.clientWidth - paddingLeft * 2 + 'px'
}

// 是否需要分页器
const pagination = computed(() =>
  props.pagination
    ? {
        current: reqParams.current,
        pageSize: reqParams.size,
        total: tableData.total,
        showTotal: (total: any) => `共${total}条`,
        onChange: onPagination,
        showQuickJumper: true,
        showSizeChanger: true,
        onShowSizeChange: (current: number, pageSize: number) => {
          onChangeSize(pageSize)
        },
      }
    : props.pagination,
)

// 是否需要多选
const rowSelection = computed(() =>
  props.rowSelection
    ? {
        selectedRowKeys: unref(selectedRowKeys),
        onChange: onSelectChange,
        getCheckboxProps: getCheckboxProps,
      }
    : null,
)

/**
 * @desc 监听多选
 */
const onSelectChange = (keys: number[], rows: any[]) => {
  selectedRowKeys.value = keys
  selectedRows.value = rows
}

/**
 * @desc 设置chexkbox禁用
 */
const getCheckboxProps = (record: any) => {
  if (props.getCheckboxProps) {
    return props.getCheckboxProps(record)
  } else {
    return null
  }
}

defineExpose({
  reqParams,
  selectedRowKeys,
  selectedRows,
  onPagination,
  getSourceData,
  handleRefresh,
})
</script>
<style lang="less" scoped>
.ym-table-wrapper {
  position: absolute;
  ::v-deep(.ant-table-body) {
    overflow-y: auto !important;
  }
}
</style>
