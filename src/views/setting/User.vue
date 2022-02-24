<template>
  <div class="user-wrapper">
    <div class="department-tree-wrap">
      <ym-tree
        :tree-data="treeList"
        :field-names="fieldNames"
        :custom-title="true"
        @select="onSelectNode"
        @search="onSearchTree"
      >
        <template #title="{ record }">
          <span v-if="record.label.indexOf(searchVal) > -1">
            <span>{{ record.label.substr(0, record.label.indexOf(searchVal)) }}</span>
            <span style="color: #ff7875">{{ searchVal }}</span>
            <span>{{ record.label.substr(record.label.indexOf(searchVal) + searchVal.length) }}</span>
          </span>
          <span v-else>{{ record.label }}</span>
        </template>
      </ym-tree>
    </div>
    <div class="user-list-wrap">
      <div class="handle-wrap">
        <a-space>
          <a-button type="primary" @click="handleAdd">新增</a-button>
        </a-space>
        <a-space />
      </div>
      <div class="table-wrap">
        <ym-table
          rowKey="userId"
          :columns="userColumns"
          :getTableList="getUserList"
          :isImmediately="false"
          :rowSelection="false"
          ref="tableInstance"
        >
          <template #slotOne="{ record }">
            <a-switch
              :checked="record.status"
              checked-children="启用"
              un-checked-children="停用"
              checkedValue="0"
              unCheckedValue="1"
              :disabled="record.admin"
              @change="(checked: string) => changeUserStatus(checked, record)"
            />
          </template>
          <template #action="{ record }">
            <a-space v-show="!record.admin">
              <a-button type="link" size="small" @click="handleEdit(record)">修改</a-button>
              <a-button type="link" size="small" @click="handleReset(record)">重置</a-button>
              <a-button type="link" size="small" danger @click="handleDel(record.userId)">删除</a-button>
            </a-space>
          </template>
        </ym-table>
      </div>
    </div>
    <user-detail ref="detailInstance" :getSourceData="getSourceData" :handleRefresh="handleRefresh" />
    <modify-password ref="passwordInstance" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import YmTable from '@/components/common/YmTable.vue'
import YmTree from '@/components/common/YmTree.vue'
import UserDetail from '@/components/setting/UserDetail.vue'
import ModifyPassword from '@/components/setting/ModifyPassword.vue'
import { apiGetDepartmentList, apiGetUserList, apiModifyUserStatus, apiDeleteUser } from '@/service/api/setting'
import { userColumns } from '@/enums/tableHeadEnum'
import { actionTypeEnum } from '@/enums/commonEnum'
import { message } from 'ant-design-vue'
import { YmModal } from '@/utils/antd'

onMounted(() => {
  getDepartmentList()
})

/**
 ********************************* 部门树逻辑 ******************************************
 */

const treeList = ref([])

const fieldNames = ref({
  title: 'label',
  key: 'id',
})

const searchVal = ref('')

const onSelectNode = (keys: number[] | string[]) => {
  if (keys.length > 0) {
    deptId.value = keys[0] as number
    handleRefresh()
  }
}

const onSearchTree = (val: string) => {
  searchVal.value = val
}

/**
 * @desc 获取部门列表
 */
const getDepartmentList = async () => {
  const { code, data } = await apiGetDepartmentList()
  if (code === 20000) {
    treeList.value = data
    deptId.value = data[0].id
    tableInstance.value.getSourceData()
  }
}

/**
 ********************************* 表格逻辑 ******************************************
 */

// 表格实例
const tableInstance = ref()

// 用户详情实例
const detailInstance = ref()

// 修改密码实例
const passwordInstance = ref()

const deptId = ref(-1)

/**
 * @desc 列表刷新
 */
const handleRefresh = () => {
  tableInstance.value.handleRefresh()
}

/**
 * @desc 重新获取当前页列表
 */
const getSourceData = () => {
  tableInstance.value.getSourceData()
}

/**
 * @desc 获取用户列表
 */
const getUserList = async () => {
  const { current, size } = tableInstance.value.reqParams
  const { code, rows, total } = await apiGetUserList({
    deptId: deptId.value,
    pageSize: size,
    pageNum: current,
  })
  return Promise.resolve({
    code,
    data: {
      records: rows,
      total,
    },
  })
}

/**
 * @desc 列表删除
 */
const handleDel = (userId: number) => {
  YmModal.delete(async () => {
    const { code } = await apiDeleteUser({ userId })
    if (code === 20000) {
      message.success('删除成功')
      tableInstance.value.getSourceData()
    }
  })
}

/**
 * @desc 修改用户状态
 */
const changeUserStatus = async (checked: string, record: any) => {
  const { userId } = record
  const { code } = await apiModifyUserStatus({ status: checked, userId })
  if (code === 20000) {
    tableInstance.value.getSourceData()
    message.success(checked === '0' ? '已启用' : '已停用')
  }
}

/**
 * @desc 新增
 */
const handleAdd = () => {
  detailInstance.value.initModal(actionTypeEnum.ADD)
}

/**
 * @desc 编辑
 */
const handleEdit = (record: any) => {
  detailInstance.value.initModal(actionTypeEnum.EDIT, record)
}

/**
 * @desc 重置
 */
const handleReset = (record: any) => {
  passwordInstance.value.initModal({ userId: record.userId })
}
</script>

<style lang="less" scoped>
.user-wrapper {
  display: flex;
  .department-tree-wrap {
    width: 300px;
    padding: 14px;
    margin-right: 14px;
    background-color: #ffffff;
  }
  .user-list-wrap {
    flex: 1;
    .handle-wrap {
      display: flex;
      justify-content: space-between;
      margin-bottom: 14px;
    }
  }
}
</style>
